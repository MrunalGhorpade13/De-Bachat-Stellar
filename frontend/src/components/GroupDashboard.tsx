"use client";

import { useGroupState } from "../hooks/useGroupState";
import { ContributeButton } from "./ContributeButton";
import { buildDisburseTx, submitTransaction } from "../lib/contractClient";
import { signTransaction } from "@stellar/freighter-api";
import { useState } from "react";

interface Props {
  contractId: string;
  address: string;
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function stroopsToXlm(stroops: bigint): string {
  return (Number(stroops) / 10_000_000).toFixed(2);
}

export function GroupDashboard({ contractId, address }: Props) {
  const { config, poolState, participants, hasContributed, loading, error, refresh } =
    useGroupState(contractId, address);
  const [disburseStatus, setDisburseStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [disburseError, setDisburseError] = useState("");

  const handleDisburse = async () => {
    setDisburseStatus("loading");
    setDisburseError("");
    try {
      const xdrTx = await buildDisburseTx(contractId, address);
      const { signTransaction, submitTransaction } = await import("../lib/contractClient");
      const { signedTxXdr } = await signTransaction(xdrTx, {
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
      });
      await submitTransaction(signedTxXdr);
      setDisburseStatus("done");
      setTimeout(() => { setDisburseStatus("idle"); refresh(); }, 3500);
    } catch (err: unknown) {
      setDisburseStatus("error");
      setDisburseError(err instanceof Error ? err.message : String(err));
      setTimeout(() => setDisburseStatus("idle"), 5000);
    }
  };

  const handleCloseEnrollment = async () => {
    setDisburseStatus("loading");
    setDisburseError("");
    try {
      const { buildCloseEnrollmentTx, signTransaction, submitTransaction } = await import("../lib/contractClient");
      const xdrTx = await buildCloseEnrollmentTx(contractId, address);
      const { signedTxXdr } = await signTransaction(xdrTx, {
        networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
      });
      await submitTransaction(signedTxXdr);
      setDisburseStatus("done");
      setTimeout(() => { setDisburseStatus("idle"); refresh(); }, 3500);
    } catch (err: unknown) {
      setDisburseStatus("error");
      setDisburseError(err instanceof Error ? err.message : String(err));
      setTimeout(() => setDisburseStatus("idle"), 5000);
    }
  };

  if (loading && !config) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-zinc-500">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading group state from Testnet…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/30 border border-red-900 rounded-2xl">
        <p className="text-red-400 font-semibold mb-1">Failed to load group</p>
        <p className="text-xs text-red-300/70 break-all">{error}</p>
        <button onClick={refresh} className="mt-3 text-sm text-emerald-400 underline">Retry</button>
      </div>
    );
  }

  if (!config || !poolState) return null;

  const currentRecipient = participants[poolState.current_recipient_index];
  const isUserRecipient = currentRecipient === address;
  const memberCount = participants.length;
  const allContributed = memberCount > 0 && !poolState.payout_done; // simplified indicator

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Card */}
      <div className="relative p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-block w-2 h-2 rounded-full ${config.is_open ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                {config.is_open ? "Enrollment Open" : "Enrollment Closed"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">{config.name}</h2>
            <p className="text-zinc-500 text-sm font-mono mt-1">{shortenAddress(contractId)}</p>
            
            {config.is_open && config.organizer === address && (
              <button
                onClick={handleCloseEnrollment}
                disabled={disburseStatus === "loading"}
                className="mt-3 px-4 py-1.5 bg-zinc-950 border border-emerald-900 text-emerald-500 text-xs font-bold rounded-lg hover:bg-emerald-950/40 transition-all uppercase tracking-wider"
              >
                {disburseStatus === "loading" ? "Closing…" : "Close Enrollment & Start ROSCA"}
              </button>
            )}
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="text-zinc-500 hover:text-emerald-400 transition-colors text-sm flex items-center gap-1"
          >
            <svg className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114-4M20 15a8 8 0 01-14 4" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pool", value: `${stroopsToXlm(poolState.total_contributed)} XLM`, icon: "💰" },
          { label: "Contribution", value: `${stroopsToXlm(config.contribution_amount)} XLM`, icon: "🪙" },
          { label: "Members", value: `${memberCount} / ${config.max_members}`, icon: "👥" },
          { label: "Cycle", value: `#${poolState.cycle + 1}`, icon: "🔄" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* My Status & Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 border rounded-2xl ${hasContributed ? "bg-emerald-950/30 border-emerald-800" : "bg-zinc-900/40 border-zinc-800"}`}>
          <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-widest">My Contribution Status</h3>
          <div className={`flex items-center gap-2 text-lg font-semibold ${hasContributed ? "text-emerald-400" : "text-yellow-400"}`}>
            <span>{hasContributed ? "✓" : "○"}</span>
            <span>{hasContributed ? "Contributed this cycle" : "Not yet contributed"}</span>
          </div>
          {!hasContributed && (
            <div className="mt-4">
              <ContributeButton
                contractId={contractId}
                address={address}
                disabled={config.is_open}
                onSuccess={refresh}
              />
              {config.is_open && (
                <p className="text-xs text-zinc-500 mt-2">Enrollment must be closed before contributing.</p>
              )}
            </div>
          )}
        </div>

        <div className={`p-5 border rounded-2xl ${isUserRecipient ? "bg-amber-950/30 border-amber-700" : "bg-zinc-900/40 border-zinc-800"}`}>
          <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-widest">Next Payout Recipient</h3>
          {currentRecipient ? (
            <>
              <div className={`font-mono text-sm font-semibold break-all ${isUserRecipient ? "text-amber-300" : "text-zinc-300"}`}>
                {isUserRecipient ? "🎉 YOU are next!" : shortenAddress(currentRecipient)}
              </div>
              {!poolState.payout_done && !config.is_open && (
                <button
                  onClick={handleDisburse}
                  disabled={disburseStatus === "loading"}
                  className="mt-4 w-full py-2 border border-amber-500 text-amber-400 rounded-xl hover:bg-amber-500/10 transition-colors text-sm disabled:opacity-40"
                >
                  {disburseStatus === "loading" ? "Disbursing…" : disburseStatus === "done" ? "✓ Disbursed!" : "Disburse Pool"}
                </button>
              )}
              {disburseError && (
                <p className="mt-2 text-xs text-red-400 break-all">{disburseError}</p>
              )}
            </>
          ) : (
            <p className="text-zinc-500 text-sm">All cycles complete.</p>
          )}
        </div>
      </div>

      {/* Participants List */}
      <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
        <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-widest">Participants ({memberCount})</h3>
        {participants.length === 0 ? (
          <p className="text-zinc-600 text-sm">No members yet.</p>
        ) : (
          <ul className="space-y-2">
            {participants.map((p, i) => (
              <li key={p} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-mono ${p === address ? "bg-emerald-950/40 border border-emerald-900" : "bg-zinc-950/50"}`}>
                <span className="text-zinc-400">#{i + 1}</span>
                <span className={`break-all ${p === address ? "text-emerald-300" : "text-zinc-300"}`}>
                  {p === address ? `${shortenAddress(p)} (you)` : shortenAddress(p)}
                </span>
                <span className="text-zinc-600">
                  {i === poolState.current_recipient_index ? "⬅ next" : i < poolState.cycle ? "✓" : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
