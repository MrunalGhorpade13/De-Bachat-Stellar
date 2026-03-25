/**
 * useGroupState.ts
 * Custom hook to read De-Bachat contract state from Stellar Testnet.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchGroupConfig,
  fetchPoolState,
  fetchParticipants,
  fetchHasContributed,
  GroupConfig,
  PoolState,
} from "../lib/contractClient";

export interface GroupState {
  config: GroupConfig | null;
  poolState: PoolState | null;
  participants: string[];
  hasContributed: boolean;
  loading: boolean;
  error: string | null;
}

export function useGroupState(
  contractId: string | null,
  address: string | null
): GroupState & { refresh: () => void } {
  const [state, setState] = useState<GroupState>({
    config: null,
    poolState: null,
    participants: [],
    hasContributed: false,
    loading: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!contractId || !address || contractId.trim() === "") return;

    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [config, poolState, participants, hasContributed] =
        await Promise.all([
          fetchGroupConfig(contractId, address),
          fetchPoolState(contractId, address),
          fetchParticipants(contractId, address),
          fetchHasContributed(contractId, address, address),
        ]);
      setState({
        config,
        poolState,
        participants,
        hasContributed,
        loading: false,
        error: null,
      });
    } catch (err: unknown) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : String(err),
      }));
    }
  }, [contractId, address]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
