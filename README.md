# De-Bachat: Decentralized Rotating Savings & Credit Association (ROSCA)

De-Bachat is a premium Web3 application built on the **Stellar Soroban Testnet**. It enables users to form trusted savings groups (ROSCAs) where participants contribute a fixed amount each cycle, and the total pool is disbursed to one member in rotation.

## 🚀 project Structure

- **`/contracts`**: Soroban smart contract implemented in Rust. Includes logic for enrollment, contribution tracking, and automated payout disbursement.
- **`/frontend`**: A premium Next.js dashboard with Freighter wallet integration, real-time pool state syncing, and organizer controls.
- **`FINAL_CHECKLIST.md`**: Summary of the project milestones and completion state.
- **`TEST_SCENARIO.md`**: Detailed guide for simulating a full 5-wallet savings cycle.

## 🛠️ Tech Stack

- **Smart Contracts**: Rust, Soroban SDK
- **Frontend**: Next.js 15+, Tailwind CSS, Lucide React
- **Blockchain**: Stellar Testnet
- **Wallet**: Freighter

## 🏁 Quick Start

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```
2. **Run Locally**:
   ```bash
   npm run dev
   ```
3. **Environment**:
   Ensure `frontend/.env.local` contains the correct `NEXT_PUBLIC_CONTRACT_ID`.

## 📜 Contract Details (Testnet)

- **Contract ID**: `CBII5RAQTZXMD2HOZCGSFGUENHHEFF62SFDUVKOT37MG3YVSJPIDAG2B`
- **Network**: Testnet

---
Built with ❤️ for the Stellar community.
