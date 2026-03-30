"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MetricsData {
  dau: number;
  totalTransactions: number;
  poolVolume: number;
  activeGroups: number;
  lastIndexedLedger?: number;
  _error?: string;
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/metrics");
        const data = await res.json();
        setMetrics(data);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
    // Poll every 10 seconds for real-time vibe
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Live Network Metrics
          </h2>
          <p className="text-gray-400 mt-1">Real-time data indexing from Stellar Soroban JSON-RPC</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/30 border border-emerald-900 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-emerald-400">
            {loading ? "Indexing..." : "Horizon Indexed System Active"}
          </span>
        </div>
      </div>

      {metrics?._error && (
        <div className="bg-amber-950/30 border border-amber-900 text-amber-500 px-4 py-3 rounded-xl text-sm">
          Warning: The Soroban RPC node encountered an error ({metrics._error}). Submitting degraded, fallback read-replicas.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Daily Active Users" value={metrics?.dau || "-"} suffix=" DAU" />
        <StatCard title="Total Transactions" value={metrics?.totalTransactions || "-"} />
        <StatCard title="Total Pool Volume" value={metrics?.poolVolume || "-"} prefix="XLM " />
        <StatCard title="Active ROSCA Groups" value={metrics?.activeGroups || "-"} />
      </div>

      <div className="mt-8 bg-[#0a0f16] border border-gray-800 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Indexing Context</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          The dashboard aggregates on-chain metrics directly from the Stellar Testnet. 
          The indexer queries the Soroban <code>getEvents</code> RPC endpoint dynamically, parsing the
          transaction payloads to compute the network volume, distinct active participants, and smart contract 
          invocation loads.
          {metrics?.lastIndexedLedger && (
             <span className="block mt-2 text-emerald-500">Latest synchronized ledger sequence: {metrics.lastIndexedLedger}</span>
          )}
        </p>
      </div>

    </div>
  );
}

function StatCard({ title, value, prefix = "", suffix = "" }: { title: string; value: string | number; prefix?: string; suffix?: string }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-[#111823] border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col justify-center">
      <span className="text-sm font-medium text-gray-400 mb-2">{title}</span>
      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        {prefix}{value}{suffix}
      </div>
    </div>
  );
}
