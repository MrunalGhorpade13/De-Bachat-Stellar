"use client";

import { useState } from "react";
import { useFreighter } from "../components/FreighterProvider";
import { GroupDashboard } from "../components/GroupDashboard";
import { JoinGroupModal } from "../components/JoinGroupModal";
import { CreateGroupForm } from "../components/CreateGroupForm";
import { WalletLogger } from "../components/WalletLogger";

type View = "home" | "join" | "create" | "dashboard";

export default function Home() {
  const { address, connect, isFreighterInstalled } = useFreighter();
  const [view, setView] = useState<View>("home");
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
          {address && (
            <>
              <button
                onClick={() => setView("create")}
                className={`nav-pill ${view === "create" ? "nav-pill--active" : ""}`}
              >
                + Create
              </button>
              <button
                onClick={() => setView("join")}
                className={`nav-pill ${view === "join" ? "nav-pill--active" : ""}`}
              >
                Join
              </button>
              {activeContractId && (
                <button
                  onClick={() => setView("dashboard")}
                  className={`nav-pill ${view === "dashboard" ? "nav-pill--active" : ""}`}
                >
                  Dashboard
                </button>
              )}
            </>
          )}

          {address ? (
            <div className="wallet-badge">
              <span className="wallet-dot" />
              {address.slice(0, 5)}…{address.slice(-4)}
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={!isFreighterInstalled}
              className="connect-btn"
            >
              {isFreighterInstalled ? "Connect Freighter" : "Install Freighter"}
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
              onClick={connect}
              disabled={!isFreighterInstalled}
              className="connect-btn connect-btn--hero"
            >
              {isFreighterInstalled
                ? "Connect Freighter to Start"
                : "Install Freighter Extension"}
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

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="de-bachat-footer">
        <span className="text-zinc-600 text-xs">
          De-Bachat · Built on Stellar Soroban Testnet
        </span>
      </footer>
    </main>
  );
}
