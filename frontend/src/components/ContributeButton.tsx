"use client";

import { useState } from "react";
import { buildContributeTx, submitTransaction } from "../lib/contractClient";
import { signTransaction } from "../lib/contractClient";

interface Props {
  contractId: string;
  address: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

export function ContributeButton({ contractId, address, disabled, onSuccess }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleContribute = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const xdrTx = await buildContributeTx(contractId, address);
      const { signedTxXdr } = await signTransaction(xdrTx, {
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
      });
      await submitTransaction(signedTxXdr);
      setStatus("success");
      onSuccess?.();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleContribute}
        disabled={disabled || status === "loading"}
        className={`
          w-full py-3 rounded-xl font-semibold transition-all active:scale-95
          ${status === "success"
            ? "bg-emerald-600 text-white"
            : status === "error"
            ? "bg-red-600/80 text-white"
            : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {status === "loading" && (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Signing & Submitting…
          </span>
        )}
        {status === "success" && "✓ Contribution Sent!"}
        {status === "error" && "✗ Transaction Failed"}
        {status === "idle" && "Contribute My Share"}
      </button>
      {status === "error" && errorMsg && (
        <p className="text-xs text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-3 py-2 break-all">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
