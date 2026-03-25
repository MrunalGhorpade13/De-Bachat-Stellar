# De-Bachat: Full ROSCA Test Scenario Guide

To fully validate De-Bachat for your submission, you should simulate a complete cycle with 5+ testnet wallets. Here is the Step-by-Step guide.

## 1. Preparation
1. **Wallets**: Ensure you have 5 browser profiles (or 5 different browsers/devices) each with a **Freighter Wallet** installed.
2. **Funding**: Fund all 5 wallets with Testnet XLM using the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet).

## 2. Step-by-Step Simulation

### 🟢 Phase A: Setup
1. **Wallet 1 (Organizer)**: 
   - Select **"Create New Group"**.
   - Enter Name: "Global Savings #1", Max Members: 5, Contribution: 20 XLM.
   - Enter your deployed **Contract ID**.
   - Click **"Initialize Group"**.
   - **IMPORTANT**: Once initialized, click **"Join Group"** to enroll yourself as the first participant!
2. **Dashboard**: Verify the "Enrollment Open" status pill is pulsing and "Participants (1)" is shown.

### 🟡 Phase B: Joining (Wallets 2–5)
1. In each browser profile (Wallets 2, 3, 4, and 5):
   - Click **"Join Group"**.
   - Enter the **Contract ID** provided by the organizer.
   - Click **"Join"**.
2. **Check**: Wallet 1's dashboard should now show "Participants (5)".

### 🔴 Phase C: Starting the Cycle
1. **Wallet 1 (Organizer)**:
   - Click the new **"Close Enrollment & Start ROSCA"** button.
   - Verify the status changes to "Enrollment Closed".
   - The "Contribute" button should now be enabled for everyone.

### 🔵 Phase D: Contributions
1. In **EVERY** wallet dashboard:
   - Click **"Contribute My Share"**.
   - Verify the status changes to "✓ Contributed this cycle".
   - Watch the "Total Pool" increase in real-time.

### 💰 Phase E: Payout
1. Once all 5 have contributed (Total Pool = 100 XLM):
   - **Wallet 1**: Click **"Disburse Pool"**.
   - **Wallet 1 (Recipient #1)**: Check your balance. You should have received the full 100 XLM!
2. **Cycle Advance**: Verify the dashboard now shows "Cycle: #2" and the "Next Recipient" has moved to Wallet 2.

## 📋 Audit Export
- Scroll to the bottom of the Dashboard to find the **"Interacting Wallets"** logger.
- Copy the CSV/Text list of addresses to include in your final project submission notes.
