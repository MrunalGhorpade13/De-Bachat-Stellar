"use client";

import { useState } from "react";

interface Props {
  addresses: string[];
}

export function WalletLogger({ addresses }: Props) {
  const [copied, setCopied] = useState(false);

  const csvContent = addresses.join("\n");
  const handleCopy = () => {
    navigator.clipboard.writeText(csvContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "de-bachat-testnet-wallets.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (addresses.length === 0) return null;

  return (
    <div className="p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">
          Interacting Wallets ({addresses.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs text-emerald-400 border border-emerald-800 rounded-lg hover:bg-emerald-900/30 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 text-xs text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
      <ul className="space-y-1">
        {addresses.map((addr, i) => (
          <li key={addr} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-zinc-600 w-4 shrink-0">{i + 1}</span>
            <span className="break-all">{addr}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
