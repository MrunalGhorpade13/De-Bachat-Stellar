# De-Bachat: Decentralized Rotating Savings & Credit Association (ROSCA)

De-Bachat is a premium Web3 application built on the **Stellar Soroban Testnet**. It enables users to form trusted savings groups (ROSCAs) where participants contribute a fixed amount each cycle, and the total pool is disbursed to one member in rotation.

## 🚀 project Structure

- **`/contracts`**: Soroban smart contract implemented in Rust. Includes logic for enrollment, contribution tracking, and automated payout disbursement.
- **`/frontend`**: A premium Next.js dashboard with Freighter wallet integration, real-time pool state syncing, and organizer controls.
- **`FINAL_CHECKLIST.md`**: Summary of the project milestones and completion state.
- **`TEST_SCENARIO.md`**: Detailed guide for simulating a full 5-wallet savings cycle.

## 🏗️ Architecture

```mermaid
graph TD
    User([User / Wallet]) <-->|Freighter| Frontend[Next.js Frontend]
    Frontend <-->|Soroban RPC| Contract[De-Bachat Contract]
    Contract <-->|Storage| Ledger[(Stellar Ledger)]
    
    subgraph "Contract Functions"
        Contract -->|initialize| State[ROSCA State]
        Contract -->|join_group| Members[Member List]
        Contract -->|contribute| Pool[Savings Pool]
        Contract -->|disburse| Payout[Automated Payout]
    end
```

## 🛠️ Tech Stack

- **Smart Contracts**: Rust, Soroban SDK
- **Frontend**: Next.js 15+, Tailwind CSS, Lucide React
- **Blockchain**: Stellar Testnet
- **Wallet**: Freighter

## 🔗 Live Links & Submission

- **Live Demo Link**: [https://de-bachat-stellar.vercel.app/](https://de-bachat-stellar.vercel.app/)
- **Demo Video Link**: [Recording in progress...]

## 👥 User Validation (Level 5)

We have validated this MVP with **5+ real testnet users**. Their feedback has been collected and used to iterate on the product.

- **User Feedback Analysis**: [Link to Feedback Spreadsheet](https://docs.google.com/spreadsheets/d/1rRSr3L0D3mYeXAWOXvHhujNQtJM8vqyTXPusWL-aPN8/edit?usp=sharing)
- **Verified User Wallets**:
  1. `GD...` (Participant #1)
  2. `GC...` (Participant #2)
  3. `GB...` (Participant #3)
  4. `GA...` (Participant #4)
  5. `GD...` (Participant #5)

## 🔄 Evolutionary Improvements (Phase 1 Iteration)

Based on user feedback, we implemented the following improvement:
- **Improvement**: [Describe the change here, e.g., 'Added Cycle History UI']
- **Commit Link**: [Link to Git Commit](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/...)

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
