"use client";

import { useState } from "react";
import { signTransaction } from "../lib/contractClient";
import {
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  Address,
  rpc as StellarRpc,
  xdr,
} from "@stellar/stellar-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org:443";
const NETWORK = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || Networks.TESTNET;
// XLM native asset wrapper used on testnet for Soroban
const NATIVE_TOKEN = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

interface Props {
  address: string;
  onCreated?: (contractId: string) => void;
}

export function CreateGroupForm({ address, onCreated }: Props) {
  const [name, setName] = useState("");
  const [maxMembers, setMaxMembers] = useState("5");
  const [contributionXlm, setContributionXlm] = useState("10");
  const [contractId, setContractId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // NOTE: Creating a new group contract requires deploying via stellar-cli.
  // This form assumes the user has an already-deployed contract ID (which they
  // get from `stellar contract deploy`) and calls `initialize` on it.
  const handleInitialize = async () => {
    if (!contractId.trim() || !name.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const server = new StellarRpc.Server(RPC_URL, { allowHttp: false });
      const account = await server.getAccount(address);
      const contract = new Contract(contractId.trim());

      const contributionStroops = BigInt(Math.floor(parseFloat(contributionXlm) * 10_000_000));

      const args: xdr.ScVal[] = [
        nativeToScVal(Address.fromString(address), { type: "address" }),
        nativeToScVal(name.trim(), { type: "string" }),
        nativeToScVal(Address.fromString(NATIVE_TOKEN), { type: "address" }),
        nativeToScVal(contributionStroops, { type: "i128" }),
        nativeToScVal(parseInt(maxMembers, 10), { type: "u32" }),
      ];

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK,
      })
        .addOperation(contract.call("initialize", ...args))
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
      const xdrTx = prepared.toXDR();

      const { signedTxXdr } = await signTransaction(xdrTx, { networkPassphrase: NETWORK });

      const finalTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK);
      const sendResult = await server.sendTransaction(finalTx);
      if (sendResult.status === "ERROR") throw new Error(JSON.stringify(sendResult.errorResult));

      let result = await server.getTransaction(sendResult.hash);
      for (let i = 0; i < 20 && result.status === StellarRpc.Api.GetTransactionStatus.NOT_FOUND; i++) {
        await new Promise((r) => setTimeout(r, 1500));
        result = await server.getTransaction(sendResult.hash);
      }
      if (result.status !== StellarRpc.Api.GetTransactionStatus.SUCCESS) {
        throw new Error(`Transaction failed: ${result.status}`);
      }

      setStatus("success");
      onCreated?.(contractId.trim());
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  if (status === "success") {
    return (
      <div className="p-6 bg-emerald-900/30 border border-emerald-700 rounded-2xl text-center space-y-2">
        <div className="text-3xl">🎉</div>
        <p className="text-emerald-400 font-semibold text-lg">Group Created!</p>
        <p className="text-zinc-400 text-sm font-mono break-all">{contractId}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Initialize New Group</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Deploy a contract first via <code className="text-emerald-400 bg-zinc-950 px-1 rounded">stellar contract deploy</code>, then initialize it here.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-widest block mb-1">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bachat Gat #1"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-widest block mb-1">Max Members</label>
            <input
              type="number"
              value={maxMembers}
              min={2}
              max={20}
              onChange={(e) => setMaxMembers(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-widest block mb-1">Contribution (XLM)</label>
            <input
              type="number"
              value={contributionXlm}
              min={0.1}
              step={0.1}
              onChange={(e) => setContributionXlm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-zinc-400 uppercase tracking-widest block mb-1">Deployed Contract ID</label>
          <input
            type="text"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="C..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600"
          />
        </div>
      </div>

      <button
        onClick={handleInitialize}
        disabled={!name.trim() || !contractId.trim() || status === "loading"}
        className="w-full py-3 bg-white text-black rounded-xl font-medium hover:bg-zinc-200 transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Initializing…" : "Initialize Group"}
      </button>
      {status === "error" && errorMsg && (
        <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-3 py-2 break-all">{errorMsg}</p>
      )}
    </div>
  );
}
