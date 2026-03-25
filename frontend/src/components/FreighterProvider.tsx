"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  isConnected,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";

interface FreighterContextType {
  address: string | null;
  connect: () => Promise<void>;
  isFreighterInstalled: boolean;
}

const FreighterContext = createContext<FreighterContextType | undefined>(undefined);

export function FreighterProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState<boolean>(false);

  useEffect(() => {
    const checkFreighter = async () => {
      try {
        if (await isConnected()) {
          setIsFreighterInstalled(true);
        }
      } catch (e) {
        setIsFreighterInstalled(false);
      }
    };
    checkFreighter();
  }, []);

  const connect = async () => {
    console.log("Freighter connection attempt started...");
    try {
      if (!isFreighterInstalled) {
        console.warn("Freighter not detected. Redirecting to install...");
        window.open("https://www.freighter.app/", "_blank");
        return;
      }
      const result = await requestAccess();
      console.log("requestAccess result:", result);
      if (result && "address" in result && result.address) {
        setAddress(result.address);
        console.log("Wallet connected successfully:", result.address);
      } else {
        console.error("requestAccess returned no address:", result);
      }
    } catch (e) {
      console.error("Freighter connection error:", e);
      alert("Failed to connect to Freighter. Please ensure the extension is unlocked and you have approved the connection request.");
    }
  };

  return (
    <FreighterContext.Provider value={{ address, connect, isFreighterInstalled }}>
      {children}
    </FreighterContext.Provider>
  );
}

export function useFreighter() {
  const context = useContext(FreighterContext);
  if (context === undefined) {
    throw new Error("useFreighter must be used within a FreighterProvider");
  }
  return context;
}
