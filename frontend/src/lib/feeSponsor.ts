import { rpc as StellarRpc } from "@stellar/stellar-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org:443";
const server = new StellarRpc.Server(RPC_URL, { allowHttp: false });

export async function submitSponsoredTransaction(signedInnerXdr: string): Promise<string> {
  const res = await fetch("/api/sponsor-fee", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ signedInnerXdr }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to submit sponsored transaction");
  }

  const hash = data.hash;
  if (!hash) {
    throw new Error("No hash returned from sponsor API");
  }

  // Poll for Soroban confirmation
  let getResult = await server.getTransaction(hash);
  for (let i = 0; i < 20; i++) {
    if (getResult.status !== StellarRpc.Api.GetTransactionStatus.NOT_FOUND) break;
    await new Promise((r) => setTimeout(r, 1500));
    getResult = await server.getTransaction(hash);
  }

  if (getResult.status === StellarRpc.Api.GetTransactionStatus.SUCCESS) {
    return hash;
  }

  throw new Error(`Sponsored transaction failed or timed out: ${getResult.status}`);
}
