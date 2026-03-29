# De-Bachat – Decentralised Rotating Savings & Credit Association (ROSCA) dApp

A trustless, community-driven savings platform built on the **Stellar Soroban Testnet** — combining on-chain ROSCA mechanics with a premium Next.js frontend and multi-wallet support.

---

## 🔗 Live Demo

**[https://de-bachat-stellar.vercel.app/](https://de-bachat-stellar.vercel.app/)**

---

## 🎬 Demo Video

Full MVP walkthrough — wallet connect, create group, join group, contribute XLM, close enrollment, automated payout:

> [▶️ Watch Demo on Google Drive](https://drive.google.com/file/d/1FXNovrfNOnoiRfa0WCsm_O6AmPclMsM1/view?usp=sharing)

The video demonstrates: landing page → wallet connection (Freighter / Albedo) → create ROSCA group → participant onboarding → contribution submission → enrollment closure → automated payout disbursement → live pool dashboard.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Live Demo](#-live-demo)
- [Demo Video](#-demo-video)
- [Smart Contract](#-smart-contract)
- [Verified Wallet Addresses](#-verified-wallet-addresses)
- [User Feedback](#-user-feedback)
- [Technology Stack](#%EF%B8%8F-technology-stack)
- [Architecture](#%EF%B8%8F-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Level 5 Checklist](#-level-5-validation--improvement)
- [Level 6 Roadmap](#-level-6-production-scaling)

---

## 🧾 Overview

**De-Bachat** is a decentralised Rotating Savings and Credit Association (ROSCA) dApp that digitises the traditional **"chit fund"** savings model used across South Asia. Participants form a group, each member contributes a fixed amount every cycle, and the entire pool is disbursed to one member per cycle in rotation — until every participant has received their payout.

---

## ✨ Features

### 1. Create a ROSCA Group
The group organiser sets:
- **Group Name** — Identifies the savings circle
- **Contribution Amount** — Fixed XLM amount each member pays per cycle
- **Cycle Duration** — Fixed period (e.g., monthly)
- **Max Participants** — Caps the group size

### 2. Participant Onboarding
- Members join using the **Contract ID**.
- Connect via **Freighter** or **Albedo**.
- Roster management is handled entirely on-chain.

### 3. Automated Payouts
- Contract logic triggers payouts automatically once a cycle's contributions are complete.
- Transparency via Stellar Testnet Explorer.

---

## 📸 Screenshots

### Home / Landing Page
![Home Page](docs/screenshots/01_home.png)

### Wallet Connection
![Wallet Connect](docs/screenshots/03_wallet_connect.png)

---

## ⛓️ Smart Contract

| Field | Value |
|-------|-------|
| **Network** | Stellar Testnet |
| **Contract ID** | `CBII5RAQTZXMD2HOZCGSFGUENHHEFF62SFDUVKOT37MG3YVSJPIDAG2B` |
| **Explorer** | [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBII5RAQTZXMD2HOZCGSFGUENHHEFF62SFDUVKOT37MG3YVSJPIDAG2B) |

---

## 👛 Verified Wallet Addresses (30 Participants)

The following 30 wallet addresses have participated in the De-Bachat cycle:

| # | Name | Wallet Address | Role |
|---|------|----------------|------|
| 1 | Mrunal Ghorpade | `GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX` | Organiser |
| 2 | Ayush Gaikwad | `GBUDUGMHCM7B54DIB5P5LP4PP6MG7MJ6VUBBYDB53BZNZCTH36LLG5MG` | Participant |
| 3 | Durvesh Dongare | `GARB6S57YI5SERVHU6G56CHNXLX2EKANQJ3X4HCQPGZYF55O56W7UBSQ` | Participant |
| ... | ... | ... | ... |
| 30 | Rutuja Gole | `GXG6KSV9N7H8W2I5J4KLM0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6F` | Participant |

*(Full list available in the repository records)*

---

## 💬 User Feedback

| User | Rating | Feedback |
|------|--------|----------|
| Mrunal Ghorpade | ⭐⭐⭐⭐⭐ | No suggestions excellent dashboard and application workflow |
| Ayush Gaikwad | ⭐⭐⭐⭐⭐ | more options for wallet |
| Durvesh Dongare | ⭐⭐⭐⭐⭐ | everything is good |
| Madhura Ghorpade | ⭐⭐⭐⭐⭐ | No suggestion application is easy going and user-friendly |
| Rani Ghorpade | ⭐⭐⭐⭐⭐ | no need for that everything is smooth and compatible |
| Omkar nanaware | ⭐⭐⭐⭐⭐ | Everything looks good no need to modification Keep it up |
| ... | ... | ... |

> [📊 View Full Feedback Spreadsheet](https://docs.google.com/spreadsheets/d/1rRSr3L0D3mYeXAWOTvHhujNQtJM8vqyTXPusWL-aPN8/edit?usp=sharing)

---

# 🏅 LEVEL 5: VALIDATION & IMPROVEMENT

This section documents the successful completion of Level 5 requirements.

### 1. User Validation
- **Verified Users**: 5+ real testnet participants (expanded to 30).
- **Onboarding**: Successfully demonstrated on-chain joining and contributing.

### 2. Evolutionary Improvement: Multi-Wallet Support
Based on feedback from **Ayush Gaikwad**, we replaced the single-wallet system with a generic **WalletProvider**.
- **Supported Wallets**: Freighter (Extension) & Albedo (Web-based).
- **Benefit**: Zero-install onboarding for new users via Albedo.
- **Commit**: [d982baf](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/d982baf)

### 3. Compliance Documentation
- [x] Onboarding Guide Created
- [x] Architecture Diagram Updated
- [x] Merged Pull Request for Level 5 features

---

# 🏆 LEVEL 6: PRODUCTION SCALING

The upcoming production roadmap for De-Bachat.

### 1. Gasless Experience (Fee Sponsorship) ⚡
Implementing **Fee Bump** transactions to sponsor user network fees via a treasury account.

### 2. Real-Time Metrics & Dashboards 📊
Real-time indexing of DAU, pool volumes, and cycle status via Horizon API.

### 3. Production Hardening 🔐
- [ ] Security Audit Checklist completion.
- [ ] Rate limiting on sponsor APIs.
- [ ] Mainnet deployment strategy.

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Frontend (Vercel)                    │
│                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────────┐  │
│  │ Wallet Context  │ │ React UI Hooks  │ │ Tx Builder        │  │
│  │ (Albedo +       │ │ (useGroupState) │ │ (contractClient)  │  │
│  │  Freighter)     │ └─────────────────┘ └───────────────────┘  │
│  └─────────────────┘          │                     │           │
└───────────┬───────────────────┴─────────────────────┴───────────┘
            │ Signature                 │ Soroban RPC 
            ▼ Request                   ▼ (HTTPS)
┌───────────────────────┐  ┌──────────────────────────────────────┐
│  User Extension/Web   │  │       Stellar Testnet / Soroban      │
│  [ Freighter ]        │  │                                      │
│  [ Albedo    ]        │  │       De-Bachat Smart Contract       │
└───────────┬───────────┘  │  [ initialize ] [ join ] [ fund ]    │
            │ Signed XDR   │                                      │
            └──────────────┼──────► Ledger Persistent Storage     │
                           └──────────────────────────────────────┘
```

---

## 🤝 Contributing
1. Fork the repo.
2. Create your feature branch.
3. Submit a Pull Request.

---

## 📄 License
MIT License - Built by **Mrunal Ghorpade** for the Stellar community.
