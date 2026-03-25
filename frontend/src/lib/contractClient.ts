/**
 * contractClient.ts
 * Handles all communication with the De-Bachat Soroban contract on Stellar Testnet.
 */
import {
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  xdr,
  scValToNative,
  nativeToScVal,
  Address,
  rpc as StellarRpc,
} from "@stellar/stellar-sdk";

const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org:443";
const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
  Networks.TESTNET;
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

const server = new StellarRpc.Server(RPC_URL, { allowHttp: false });

export interface GroupConfig {
  name: string;
  token: string;
  contribution_amount: bigint;
  max_members: number;
  organizer: string;
  is_open: boolean;
}

export interface PoolState {
  total_contributed: bigint;
  current_recipient_index: number;
  cycle: number;
  payout_done: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getContract(contractId: string) {
  return new Contract(contractId);
}

/** Build a simulation-only transaction to read contract state. */
async function simulateContractCall(
  contractId: string,
  method: string,
  args: xdr.ScVal[] = [],
  sourceAddress: string
): Promise<xdr.ScVal> {
  const account = await server.getAccount(sourceAddress);
  const contract = getContract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);

  if (StellarRpc.Api.isSimulationError(simResult)) {
    throw new Error(`Simulation failed: ${simResult.error}`);
  }

  const result = (simResult as StellarRpc.Api.SimulateTransactionSuccessResponse)
    .result;
  if (!result) throw new Error("No result from simulation");
  return result.retval;
}

// ── Read Methods ──────────────────────────────────────────────────────────────

export async function fetchGroupConfig(
  contractId: string,
  sourceAddress: string
): Promise<GroupConfig> {
  const retval = await simulateContractCall(
    contractId,
    "get_config",
    [],
    sourceAddress
  );
  const native = scValToNative(retval) as Record<string, unknown>;
  return {
    name: native.name as string,
    token: native.token as string,
    contribution_amount: native.contribution_amount as bigint,
    max_members: native.max_members as number,
    organizer: native.organizer as string,
    is_open: native.is_open as boolean,
  };
}

export async function fetchPoolState(
  contractId: string,
  sourceAddress: string
): Promise<PoolState> {
  const retval = await simulateContractCall(
    contractId,
    "get_pool_state",
    [],
    sourceAddress
  );
  const native = scValToNative(retval) as Record<string, unknown>;
  return {
    total_contributed: native.total_contributed as bigint,
    current_recipient_index: native.current_recipient_index as number,
    cycle: native.cycle as number,
    payout_done: native.payout_done as boolean,
  };
}

export async function fetchParticipants(
  contractId: string,
  sourceAddress: string
): Promise<string[]> {
  const retval = await simulateContractCall(
    contractId,
    "get_participants",
    [],
    sourceAddress
  );
  return scValToNative(retval) as string[];
}

export async function fetchHasContributed(
  contractId: string,
  memberAddress: string,
  sourceAddress: string
): Promise<boolean> {
  const memberArg = nativeToScVal(
    Address.fromString(memberAddress),
    { type: "address" }
  );
  const retval = await simulateContractCall(
    contractId,
    "has_contributed",
    [memberArg],
    sourceAddress
  );
  return scValToNative(retval) as boolean;
}

// ── Transaction Builders (return XDR for signing) ─────────────────────────────

export async function buildJoinGroupTx(
  contractId: string,
  memberAddress: string
): Promise<string> {
  const account = await server.getAccount(memberAddress);
  const contract = getContract(contractId);
  const memberArg = nativeToScVal(Address.fromString(memberAddress), {
    type: "address",
  });

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("join_group", memberArg))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (StellarRpc.Api.isSimulationError(simResult)) {
    throw new Error(simResult.error);
  }
  const prepared = StellarRpc.assembleTransaction(
    tx,
    simResult as StellarRpc.Api.SimulateTransactionSuccessResponse
  ).build();
  return prepared.toXDR();
}

export async function buildContributeTx(
  contractId: string,
  memberAddress: string
): Promise<string> {
  const account = await server.getAccount(memberAddress);
  const contract = getContract(contractId);
  const memberArg = nativeToScVal(Address.fromString(memberAddress), {
    type: "address",
  });

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("contribute", memberArg))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (StellarRpc.Api.isSimulationError(simResult)) {
    throw new Error(simResult.error);
  }
  const prepared = StellarRpc.assembleTransaction(
    tx,
    simResult as StellarRpc.Api.SimulateTransactionSuccessResponse
  ).build();
  return prepared.toXDR();
}

export async function buildDisburseTx(
  contractId: string,
  callerAddress: string
): Promise<string> {
  const account = await server.getAccount(callerAddress);
  const contract = getContract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("disburse"))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (StellarRpc.Api.isSimulationError(simResult)) {
    throw new Error(simResult.error);
  }
  const prepared = StellarRpc.assembleTransaction(
    tx,
    simResult as StellarRpc.Api.SimulateTransactionSuccessResponse
  ).build();
  return prepared.toXDR();
}

export async function buildCloseEnrollmentTx(
  contractId: string,
  organizerAddress: string
): Promise<string> {
  const account = await server.getAccount(organizerAddress);
  const contract = getContract(contractId);
  const organizerArg = nativeToScVal(Address.fromString(organizerAddress), {
    type: "address",
  });

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("close_enrollment", organizerArg))
    .setTimeout(30)
    .build();

  const simResult = await server.simulateTransaction(tx);
  if (StellarRpc.Api.isSimulationError(simResult)) {
    throw new Error(simResult.error);
  }
  const prepared = StellarRpc.assembleTransaction(
    tx,
    simResult as StellarRpc.Api.SimulateTransactionSuccessResponse
  ).build();
  return prepared.toXDR();
}

/** Submit a signed XDR transaction and wait for confirmation. */
export async function submitTransaction(signedXdr: string): Promise<string> {
  const { TransactionBuilder: TB } = await import("@stellar/stellar-sdk");
  const tx = TB.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const sendResult = await server.sendTransaction(tx);
  if (sendResult.status === "ERROR") {
    throw new Error(`Submit error: ${JSON.stringify(sendResult.errorResult)}`);
  }
  // Poll for confirmation
  let getResult = await server.getTransaction(sendResult.hash);
  for (let i = 0; i < 20; i++) {
    if (getResult.status !== StellarRpc.Api.GetTransactionStatus.NOT_FOUND) break;
    await new Promise((r) => setTimeout(r, 1500));
    getResult = await server.getTransaction(sendResult.hash);
  }
  if (getResult.status === StellarRpc.Api.GetTransactionStatus.SUCCESS) {
    return sendResult.hash;
  }
  throw new Error(`Transaction failed or timed out: ${getResult.status}`);
}

export async function signTransaction(xdrTx: string, walletType: "freighter" | "albedo", opts?: any) {
  if (walletType === "albedo") {
    const albedo = (await import("@albedo-link/intent")).default;
    const result = await albedo.tx({
      xdr: xdrTx,
      network: "testnet",
    });
    return { signedTxXdr: result.signed_envelope_xdr };
  }

  // Default to Freighter
  const { signTransaction: freighterSign } = await import("@stellar/freighter-api");
  return freighterSign(xdrTx, opts);
}

export { CONTRACT_ID };
