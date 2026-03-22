# De-Bachat Architecture & Data Flow

## Overview
De-Bachat is a decentralized Rotating Savings and Credit Association (ROSCA) built on the Stellar network using Soroban smart contracts. It operates as a "pure dApp," meaning there is no centralized database or backend server. All state is maintained directly on-chain, ensuring absolute trustlessness, immutability, and transparency.

## 1. Components & Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS
- **Smart Contract**: Soroban (Rust)
- **Blockchain Interface**: `@stellar/stellar-sdk`
- **Wallet**: Freighter API (Browser Extension)
- **Network**: Stellar Testnet

## 2. On-Chain State Storage
The Soroban smart contract is the single source of truth. It stores:
1. **Group Configuration**: Group Name, Contribution Amount per member, funding goal.
2. **Participant Roster**: A list (or map) of member wallet addresses, determining the order of payouts.
3. **Pool State**: Current accumulated balance, current cycle number, and mapping of who has contributed in the current cycle.
4. **Turn Mapping**: Logic to determine the recipient of the pooled funds at the end of each cycle.

## 3. Core Data Flow & User Journeys

### 3.1 Group Creation Flow
1. **User Action**: Organizer navigates to the "Create Group" page on the frontend.
2. **Input**: Organizer inputs group name, contribution amount, cycle duration, and maximum participants.
3. **Transaction**: The frontend builds a transaction using `@stellar/stellar-sdk` to call the `initialize_group` (or deploy a new contract instance) function.
4. **Signing**: Organizer signs the transaction via the Freighter wallet popup.
5. **On-Chain**: The contract initializes the group config state.

### 3.2 Participant Onboarding Flow
1. **User Action**: Participants navigate to the specific Group Dashboard (via a shared link or Group ID).
2. **Transaction**: They connect their Freighter wallet and click "Join Group".
3. **On-Chain**: The contract calls the `join_group` function, appending their wallet address to the roster if there are open slots.

### 3.3 Contribution Flow
1. **User Action**: When a cycle begins, participants click "Contribute" on the Dashboard.
2. **Transaction**: Frontend initiates a transaction to transfer testnet tokens (Native XLM or an Asset) from the participant to the contract's pool balance.
3. **On-Chain**: Contract updates internal accounting, marking the participant as "paid" for the current cycle to prevent double-charging. The transaction provides immutable proof of payment.

### 3.4 Payout Flow
1. **Trigger**: Once all participants have contributed or the cycle deadline is reached, anyone (typically the last payer) can trigger the payout (or it happens automatically depending on contract logic).
2. **Logic Check**: Contract verifies the pool has met its funding target. It identifies the next eligible recipient based on the participant roster order.
3. **On-Chain Transfer**: The contract programmatically transfers the entire pooled balance to the assigned recipient's wallet address.
4. **State Reset**: Contract increments the cycle counter and clears the "paid" mapping for the new cycle.

## 4. State Verification (Frontend Read)
- Every time a user loads the Next.js frontend, it queries the contract's read-only functions via the RPC server.
- The UI dynamically renders the current state (e.g., "Total Pool: 500 XLM", "Next Recipient: GD3F...4B2A").
- This ensures 100% transparency; anyone can verify the contract's true state without relying on a centralized database.
