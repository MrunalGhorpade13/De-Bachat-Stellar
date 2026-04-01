"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  isConnected as isFreighterConnected,
  requestAccess as requestFreighterAccess,
} from "@stellar/freighter-api";
import albedo from "@albedo-link/intent";

export type WalletType = "freighter" | "albedo" | "metamask" | null;

interface WalletContextType {
  address: string | null;
  walletType: WalletType;

  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  isFreighterInstalled: boolean;
  isMetaMaskInstalled: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState<boolean>(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);

  useEffect(() => {
    const checkFreighter = async () => {
      try {
        if (await isFreighterConnected()) {
          setIsFreighterInstalled(true);
        }
      } catch (e) {
        setIsFreighterInstalled(false);
      }
    };
    checkFreighter();
    
    // Check MetaMask
    setTimeout(() => {
      if (typeof window !== "undefined" && (window as unknown as { ethereum?: unknown }).ethereum) {
        setIsMetaMaskInstalled(true);
      }
    }, 0);
  }, []);

  const connect = async (type: WalletType) => {
    console.log(`Connecting to ${type}...`);
    try {
      if (type === "freighter") {
        if (!isFreighterInstalled) {
          window.open("https://www.freighter.app/", "_blank");
          return;
        }
        const result = await requestFreighterAccess();
        if (result && "address" in result && result.address) {
          setAddress(result.address);
          setWalletType("freighter");
        }
      } else if (type === "albedo") {
        const result = await albedo.publicKey({
            token: "de-bachat-auth",
        });
        if (result.pubkey) {
          setAddress(result.pubkey);
          setWalletType("albedo");
        }
      } else if (type === "metamask") {
        if (!isMetaMaskInstalled) {
          window.open("https://metamask.io/download/", "_blank");
          return;
        }
        const accounts = await (window as unknown as { ethereum: { request: (args: { method: string }) => Promise<string[]> } }).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setWalletType("metamask");
        }
      }
    } catch (e) {
      console.error("Wallet connection error:", e);
      alert(`Failed to connect to ${type}.`);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setWalletType(null);
  };

  return (
    <WalletContext.Provider value={{ address, walletType, connect, disconnect, isFreighterInstalled, isMetaMaskInstalled }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
