import { NextResponse } from "next/server";
import {
  TransactionBuilder,
  Networks,
  Keypair,
  rpc as StellarRpc,
  Transaction,
  FeeBumpTransaction,
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
