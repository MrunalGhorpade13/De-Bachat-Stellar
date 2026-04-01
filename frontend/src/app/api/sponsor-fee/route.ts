import { NextResponse } from "next/server";
import {
  TransactionBuilder,
  Networks,
  Keypair,
  rpc as StellarRpc,
  Transaction,
  FeeBumpTransaction,
  Operation,
  xdr,
} from "@stellar/stellar-sdk";

export async function POST(req: Request) {
  try {
    const { signedInnerXdr } = await req.json();

    if (!signedInnerXdr) {
      return NextResponse.json({ error: "Missing signedInnerXdr" }, { status: 400 });
    }

    const sponsorSecret = process.env.SPONSOR_SECRET_KEY;
    if (!sponsorSecret || sponsorSecret.length === 0) {
      return NextResponse.json({ error: "Sponsorship not available" }, { status: 503 });
    }

    const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org:443";
    const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET;

    const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
    const server = new StellarRpc.Server(RPC_URL, { allowHttp: false });

    // 1. Decode the inner transaction
    const innerTx = TransactionBuilder.fromXDR(signedInnerXdr, NETWORK_PASSPHRASE) as Transaction;

    // --- SECURITY VALIDATION ---
    const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;
    
    // Only allow one operation per sponsored transaction for simplicity and safety
    if (innerTx.operations.length !== 1) {
      return NextResponse.json({ error: "Only single-operation transactions are sponsored" }, { status: 400 });
    }

    const op = innerTx.operations[0];

    // Check if it's a Soroban InvokeHostFunction operation
    if (op.type !== "invokeHostFunction") {
      return NextResponse.json({ error: "Only Soroban contract calls are sponsored" }, { status: 400 });
    }

    // Use type assertion for the operation details
    const invokeOp = op as any; 
    const func = invokeOp.func;

    // Verify it's calling OUR contract
    if (func.switch() !== xdr.HostFunctionType.hostFunctionTypeInvokeContract()) {
        return NextResponse.json({ error: "Invalid host function type" }, { status: 400 });
    }

    const invokeArgs = func.invokeContract();
    
    // Convert ScAddress to string. In stellar-sdk v12+, Address.fromScAddress is the way.
    // However, ScAddress itself might have a readable format.
    const contractIdStr = invokeArgs.contractAddress().toString(); 
    
    if (contractIdStr !== CONTRACT_ID) {
        return NextResponse.json({ error: "Unauthorized contract ID", expected: CONTRACT_ID, got: contractIdStr }, { status: 403 });
    }

    const methodName = invokeArgs.functionName().toString();
    const ALLOWED_METHODS = ["join_group", "contribute"];

    if (!ALLOWED_METHODS.includes(methodName)) {
        return NextResponse.json({ error: `Method '${methodName}' is not eligible for sponsorship` }, { status: 403 });
    }
    // --- END SECURITY VALIDATION ---

    // 2. Build the FeeBump transaction
    // We cover the base fee of 100000 stroops (0.01 XLM) just to be safe for Soroban txs.
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      sponsorKeypair,
      "100000",
      innerTx,
      NETWORK_PASSPHRASE
    );

    // 3. Sponsor signs the outer envelope
    feeBumpTx.sign(sponsorKeypair);

    const outerXdr = feeBumpTx.toXDR();

    // 4. Submit to network
    const sendResult = await server.sendTransaction(feeBumpTx);

    if (sendResult.status === "ERROR") {
      console.error("FeeBump Submit Error:", sendResult.errorResult);
      return NextResponse.json(
        { error: "Failed to submit sponsored transaction", details: sendResult.errorResult },
        { status: 400 }
      );
    }

    // Return the hash so the client can poll for confirmation
    return NextResponse.json({ success: true, hash: sendResult.hash });
  } catch (error: any) {
    console.error("Fee Sponsor API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
