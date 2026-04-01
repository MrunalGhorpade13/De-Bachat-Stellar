"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet, WalletType } from "../components/WalletProvider";
import { GroupDashboard } from "../components/GroupDashboard";
import { JoinGroupModal } from "../components/JoinGroupModal";
import { CreateGroupForm } from "../components/CreateGroupForm";
import { WalletLogger } from "../components/WalletLogger";

type View = "home" | "join" | "create" | "dashboard";

export default function Home() {
  const { address, walletType, connect, disconnect, isFreighterInstalled, isMetaMaskInstalled } = useWallet();
  const [view, setView] = useState<View>("home");
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [activeContractId, setActiveContractId] = useState(
    process.env.NEXT_PUBLIC_CONTRACT_ID || ""
  );
  // Track all wallets that interact so they can be exported for validation
  const [walletLog, setWalletLog] = useState<string[]>([]);

  const addWallet = (addr: string) => {
    setWalletLog((prev) => (prev.includes(addr) ? prev : [...prev, addr]));
  };

  const handleJoined = (contractId: string) => {
    setActiveContractId(contractId);
    if (address) addWallet(address);
    setView("dashboard");
  };

  const handleCreated = (contractId: string) => {
    setActiveContractId(contractId);
    if (address) addWallet(address);
    setView("dashboard");
  };

  const handleConnect = (type: WalletType) => {
    connect(type);
    setShowWalletSelector(false);
  };

  return (
    <main className="de-bachat-root">
      {/* ── Header ────────────────────────────────────── */}
      <header className="de-bachat-header">
        <button
          onClick={() => setView("home")}
          className="brand-logo"
        >
          <span className="brand-icon">💰</span>
          De-Bachat
        </button>

        <nav className="header-nav">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-900/50 hover:bg-emerald-500/20 transition-all flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            Metrics
          </Link>
          
          {address && (
            <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-full p-1 overflow-x-auto">
              <button
                onClick={() => setView("create")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${view === "create" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                Create
              </button>
              <button
                onClick={() => setView("join")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${view === "join" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
              >
                Join
              </button>
              {activeContractId && (
                <button
                  onClick={() => setView("dashboard")}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${view === "dashboard" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
                >
                  Dashboard
                </button>
              )}
            </div>
          )}

          {address ? (
            <div className="flex items-center gap-2">
              <div className="wallet-badge" title="Connected Wallet">
                <span className="wallet-dot" />
                <span className="capitalize text-[10px] mr-1 opacity-60">[{walletType}]</span>
                {address.slice(0, 5)}…{address.slice(-4)}
              </div>
              <button 
                onClick={disconnect}
                className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 text-zinc-500 transition-all"
                title="Disconnect Wallet"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowWalletSelector(true)}
              className="connect-btn"
            >
              Connect Wallet
            </button>
          )}
        </nav>
      </header>

      {/* ── Content ───────────────────────────────────── */}
      <div className="de-bachat-content">
        {!address && (
          <section className="hero-section">
            <div className="hero-orb">💰</div>
            <h1 className="hero-title">Decentralized Rotating Savings</h1>
            <p className="hero-subtitle">
              De-Bachat brings the trusted ROSCA model on-chain. No middlemen.
              No banks. Just your community — secured by Stellar Soroban.
            </p>
            <div className="hero-features">
              {[
                { icon: "🔐", text: "Non-custodial" },
                { icon: "⚡", text: "Stellar Testnet" },
                { icon: "🌍", text: "Trust-minimised" },
              ].map((f) => (
                <div key={f.text} className="feature-chip">
                  <span>{f.icon}</span> {f.text}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowWalletSelector(true)}
              className="connect-btn connect-btn--hero"
            >
              Connect Wallet to Start
            </button>
          </section>
        )}

        {address && view === "home" && (
          <section className="home-cards">
            <button
              onClick={() => setView("create")}
              className="home-card home-card--create"
            >
              <span className="home-card-icon">✦</span>
              <span className="home-card-title">Create New Group</span>
              <span className="home-card-sub">
                Deploy & initialize your own ROSCA contract
              </span>
            </button>
            <button
              onClick={() => setView("join")}
              className="home-card home-card--join"
            >
              <span className="home-card-icon">⬡</span>
              <span className="home-card-title">Join Existing Group</span>
              <span className="home-card-sub">
                Enter a contract ID to join an active savings pool
              </span>
            </button>
            {activeContractId && (
              <button
                onClick={() => setView("dashboard")}
                className="home-card home-card--dashboard"
              >
                <span className="home-card-icon">◈</span>
                <span className="home-card-title">My Dashboard</span>
                <span className="home-card-sub">
                  View pool state, contribute & track payouts
                </span>
              </button>
            )}
          </section>
        )}

        {address && view === "create" && (
          <div className="view-container">
            <CreateGroupForm address={address} onCreated={handleCreated} />
          </div>
        )}

        {address && view === "join" && (
          <div className="view-container">
            <JoinGroupModal address={address} onSuccess={handleJoined} />
          </div>
        )}

        {address && view === "dashboard" && activeContractId && (
          <div className="view-container">
            <GroupDashboard
              contractId={activeContractId}
              address={address}
            />
            <WalletLogger addresses={walletLog} />
          </div>
        )}

        {address && view === "dashboard" && !activeContractId && (
          <div className="view-container empty-state">
            <p className="text-zinc-500">
              No group selected.{" "}
              <button onClick={() => setView("join")} className="text-emerald-400 underline">
                Join a group
              </button>{" "}
              or{" "}
              <button onClick={() => setView("create")} className="text-emerald-400 underline">
                create one
              </button>
              .
            </p>
          </div>
        )}
      </div>

      {/* ── Wallet Selector Modal ───────────────────────── */}
      {showWalletSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Connect Wallet</h2>
              <button onClick={() => setShowWalletSelector(false)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
            </div>
            <div className="grid gap-3">
              <button 
                onClick={() => handleConnect("freighter")}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800 transition-all text-left"
              >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-xl">⚓</div>
                  <div>
                    <div className="font-semibold text-zinc-100">Freighter</div>
                    <div className="text-xs text-zinc-400">{isFreighterInstalled ? "Detected" : "Install extension"}</div>
                  </div>
              </button>

              <button 
                onClick={() => handleConnect("albedo")}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800 transition-all text-left"
              >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-xl">✨</div>
                  <div>
                    <div className="font-semibold text-zinc-100">Albedo</div>
                    <div className="text-xs text-zinc-400">Browser Extension / Web</div>
                  </div>
              </button>

              <button 
                onClick={() => handleConnect("metamask")}
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-orange-500/50 hover:bg-zinc-800 transition-all text-left"
              >
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-xl">🦊</div>
                  <div>
                    <div className="font-semibold text-zinc-100">MetaMask</div>
                    <div className="text-xs text-zinc-400">{isMetaMaskInstalled ? "Installed" : "Browser Extension"}</div>
                  </div>
              </button>
            </div>
            <p className="mt-6 text-center text-xs text-zinc-500">
              New to Stellar? <a href="https://stellar.org" target="_blank" className="text-emerald-400 hover:underline">Learn more</a>
            </p>
          </div>
        </div>
      )}

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="de-bachat-footer">
        <span className="text-zinc-600 text-xs">
          De-Bachat · Built on Stellar Soroban Testnet
        </span>
      </footer>
    </main>
  );
}
