"use client";

import { useState } from "react";
import { buildJoinGroupTx, submitTransaction, signTransaction } from "../lib/contractClient";
import { useWallet } from "../components/WalletProvider";

interface Props {
  address: string;
  onSuccess?: (contractId: string) => void;
}

export function JoinGroupModal({ address, onSuccess }: Props) {
  const { walletType } = useWallet();
  const [contractId, setContractId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleJoin = async () => {
    if (!contractId.trim()) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      if (!walletType) throw new Error("Wallet not connected");
      const xdrTx = await buildJoinGroupTx(contractId.trim(), address);
      const { signTransaction, submitTransaction } = await import("../lib/contractClient");
      const { signedTxXdr } = await signTransaction(xdrTx, walletType, {
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
      });
      await submitTransaction(signedTxXdr);
      setStatus("success");
      onSuccess?.(contractId.trim());
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  if (status === "success") {
    return (
      <div className="p-6 bg-emerald-900/30 border border-emerald-700 rounded-2xl text-center">
        <div className="text-3xl mb-2">✓</div>
        <p className="text-emerald-400 font-semibold">Successfully joined!</p>
        <p className="text-zinc-400 text-sm mt-1 font-mono break-all">{contractId}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-1">Join an Existing Group</h2>
      <p className="text-zinc-400 text-sm mb-4">Enter the contract ID of an active savings group.</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={contractId}
          onChange={(e) => setContractId(e.target.value)}
          placeholder="Contract ID (C...)"
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-600"
        />
        <button
          onClick={handleJoin}
          disabled={!contractId.trim() || status === "loading"}
          className="px-5 py-2 border border-emerald-500 text-emerald-400 rounded-xl hover:bg-emerald-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : "Join"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-3 py-2 break-all">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
