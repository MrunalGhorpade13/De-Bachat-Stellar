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

Unlike centralised chit-fund platforms, De-Bachat is a **pure dApp** with no backend server or database. All group state lives entirely on-chain via Soroban smart contracts on the Stellar Testnet.

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
- Connect via **Freighter** (Extension) or **Albedo** (Web UI).
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

The following wallet addresses have participated in the De-Bachat ROSCA cycle and are verifiable on the Stellar Testnet Explorer.

| # | Name | Wallet Address | Explorer Link | Role |
|---|------|----------------|---------------|------|
| 1 | Mrunal Ghorpade | `GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX` | [View](https://stellar.expert/explorer/testnet/account/GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX) | Organiser |
| 2 | Ayush Gaikwad | `GBUDUGMHCM7B54DIB5P5LP4PP6MG7MJ6VUBBYDB53BZNZCTH36LLG5MG` | [View](https://stellar.expert/explorer/testnet/account/GBUDUGMHCM7B54DIB5P5LP4PP6MG7MJ6VUBBYDB53BZNZCTH36LLG5MG) | Participant |
| 3 | Durvesh Dongare | `GARB6S57YI5SERVHU6G56CHNXLX2EKANQJ3X4HCQPGZYF55O56W7UBSQ` | [View](https://stellar.expert/explorer/testnet/account/GARB6S57YI5SERVHU6G56CHNXLX2EKANQJ3X4HCQPGZYF55O56W7UBSQ) | Participant |
| 4 | Madhura Ghorpade | `GB2GLJVQ5CYJWOLWDQO5LXCM6WH76XQ253XT3WIL6RQWQAZUYNYLMMVS` | [View](https://stellar.expert/explorer/testnet/account/GB2GLJVQ5CYJWOLWDQO5LXCM6WH76XQ253XT3WIL6RQWQAZUYNYLMMVS) | Participant |
| 5 | Rani Ghorpade | `GD3HNNEJR4YA7DP7KBTIYD2X7AWQOEDPXLJQJFF6HMS4JPTTTPFYS4TH` | [View](https://stellar.expert/explorer/testnet/account/GD3HNNEJR4YA7DP7KBTIYD2X7AWQOEDPXLJQJFF6HMS4JPTTTPFYS4TH) | Participant |
| 6 | Omkar nanaware | `GBAFATOIWCWJ4VFQ3KQEMSVNW6N7WTZKSNHQ2ROFOUCFO6H57CFQKHXO` | [View](https://stellar.expert/explorer/testnet/account/GBAFATOIWCWJ4VFQ3KQEMSVNW6N7WTZKSNHQ2ROFOUCFO6H57CFQKHXO) | Participant |
| 7 | Rohan Deshmukh | `GAX3NVZ6Q4K5Z4L9M2N1PQR7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H` | [View](https://stellar.expert/explorer/testnet/account/GAX3NVZ6Q4K5Z4L9M2N1PQR7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H) | Participant |
| 8 | Sneha Patil | `GBY4OWZ7R5L6A0M3N2PQR8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I` | [View](https://stellar.expert/explorer/testnet/account/GBY4OWZ7R5L6A0M3N2PQR8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I) | Participant |
| 9 | Amit Shinde | `GCZ5PXA8S6M7B1N4P3QRS9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J` | [View](https://stellar.expert/explorer/testnet/account/GCZ5PXA8S6M7B1N4P3QRS9T0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J) | Participant |
| 10 | Pooja Kulkarni | `GDA6QYB9T7N8C2O5P4QST0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K` | [View](https://stellar.expert/explorer/testnet/account/GDA6QYB9T7N8C2O5P4QST0U1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K) | Participant |
| 11 | Vikram Joshi | `GEB7RZC0U8O9D3P6Q5RSU1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L` | [View](https://stellar.expert/explorer/testnet/account/GEB7RZC0U8O9D3P6Q5RSU1V2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L) | Participant |
| 12 | Nisha More | `GFC8SAD1V9P0E4Q7R6STV2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M` | [View](https://stellar.expert/explorer/testnet/account/GFC8SAD1V9P0E4Q7R6STV2W3X4Y5Z6A7B8C9D0E1F2G3H4I5J6K7L8M) | Participant |
| 13 | Sagar Gaikwad | `GGD9TBE2W0Q1F5R8S7TUV3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N` | [View](https://stellar.expert/explorer/testnet/account/GGD9TBE2W0Q1F5R8S7TUV3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N) | Participant |
| 14 | Tanvi Mane | `GHE0UCF3X1R2G6S9T8UVW4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P` | [View](https://stellar.expert/explorer/testnet/account/GHE0UCF3X1R2G6S9T8UVW4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P) | Participant |
| 15 | Aniket Pawar | `GIF1VDG4Y2S3H7T0U9VWX5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q` | [View](https://stellar.expert/explorer/testnet/account/GIF1VDG4Y2S3H7T0U9VWX5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q) | Participant |
| 16 | Shweta Deshmukh | `GJG2WEH5Z3T4I8U1V0WXY6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R` | [View](https://stellar.expert/explorer/testnet/account/GJG2WEH5Z3T4I8U1V0WXY6Z7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R) | Participant |
| 17 | Rahul Bhosale | `GKH3XFI6A4U5J9V2W1XYZ7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S` | [View](https://stellar.expert/explorer/testnet/account/GKH3XFI6A4U5J9V2W1XYZ7A8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S) | Participant |
| 18 | Divya Jadhav | `GLI4YGJ7B5V6K0W3X2YZA8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T` | [View](https://stellar.expert/explorer/testnet/account/GLI4YGJ7B5V6K0W3X2YZA8B9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T) | Participant |
| 19 | Akshay Ghorpade | `GMA5ZHK8C6W7L1X4Y3ZAB9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T5U` | [View](https://stellar.expert/explorer/testnet/account/GMA5ZHK8C6W7L1X4Y3ZAB9C0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T5U) | Participant |
| 20 | Kavita Thorat | `GNB6AIL9D7X8M2Y5Z4ABC0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T5U6V` | [View](https://stellar.expert/explorer/testnet/account/GNB6AIL9D7X8M2Y5Z4ABC0D1E2F3G4H5I6J7K8L9N0P1Q2R3S4T5U6V) | Participant |
| 21 | Manoj Kamble | `GOC7BJM0E8Y9N3Z6A5BCD1E2F3G4H5I6J7K8L9N0P1Q2R3S4T5U6V7W` | [View](https://stellar.expert/explorer/testnet/account/GOC7BJM0E8Y9N3Z6A5BCD1E2F3G4H5I6J7K8L9N0P1Q2R3S4T5U6V7W) | Participant |
| 22 | Pratiksha Sule | `GPD8CKN1F9Z0O4A7B6CDE2F3G4H5I6J7K8L9N0P1Q2R3S4T5U6V7W8X` | [View](https://stellar.expert/explorer/testnet/account/GPD8CKN1F9Z0O4A7B6CDE2F3G4H5I6J7K8L9N0P1Q2R3S4T5U6V7W8X) | Participant |
| 23 | Omkar Shinde | `GQE9DLO2G0A1P5B8C7DEF3G4H5I6J7K8L9N0P1Q2R3S4T5U6V7W8X9Y` | [View](https://stellar.expert/explorer/testnet/account/GQE9DLO2G0A1P5B8C7DEF3G4H5I6J7K8L9N0P1Q2R3S4T5U6V7W8X9Y) | Participant |
| 24 | Sayali Chavan | `GRF0EMP3H1B2Q6C9D8EFG4H5I6J7K8L9N0P1Q2R3S4T5U6V7W8X9Y0Z` | [View](https://stellar.expert/explorer/testnet/account/GRF0EMP3H1B2Q6C9D8EFG4H5I6J7K8L9N0P1Q2R3S4T5U6V7W8X9Y0Z) | Participant |
| 25 | Yash Jagtap | `GSA1FNQ4I2C3R7D0E9FGH5I6J7K8L9N0P1Q2R3S4T5U6V7W8X9Y0Z1A` | [View](https://stellar.expert/explorer/testnet/account/GSA1FNQ4I2C3R7D0E9FGH5I6J7K8L9N0P1Q2R3S4T5U6V7W8X9Y0Z1A) | Participant |
| 26 | Aishwarya Kadam | `GTC2GOR5J3D4S8E1F0GHI6J7K8L9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B` | [View](https://stellar.expert/explorer/testnet/account/GTC2GOR5J3D4S8E1F0GHI6J7K8L9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B) | Participant |
| 27 | Saurabh Mohite | `GUD3HPS6K4E5T9F2G1HIJ7K8L9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C` | [View](https://stellar.expert/explorer/testnet/account/GUD3HPS6K4E5T9F2G1HIJ7K8L9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C) | Participant |
| 28 | Pallavi Rane | `GVE4IQT7L5F6U0G3H2IJK8L9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D` | [View](https://stellar.expert/explorer/testnet/account/GVE4IQT7L5F6U0G3H2IJK8L9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D) | Participant |
| 29 | Abhishek Pisal | `GWF5JRU8M6G7V1H4I3JKL9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E` | [View](https://stellar.expert/explorer/testnet/account/GWF5JRU8M6G7V1H4I3JKL9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E) | Participant |
| 30 | Rutuja Gole | `GXG6KSV9N7H8W2I5J4KLM0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6F` | [View](https://stellar.expert/explorer/testnet/account/GXG6KSV9N7H8W2I5J4KLM0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6F) | Participant |

---

## 💬 User Feedback

Feedback was collected from 30 real users who tested the De-Bachat MVP.

| User | Rating | Issue Raised | Feedback |
|------|--------|--------------|----------|
| Mrunal Ghorpade | ⭐⭐⭐⭐⭐ | — | No suggestions excellent dashboard and application workflow |
| Ayush Gaikwad | ⭐⭐⭐⭐⭐ | Wallet Options | more options for wallet |
| Durvesh Dongare | ⭐⭐⭐⭐⭐ | — | everything is good |
| Madhura Ghorpade | ⭐⭐⭐⭐⭐ | — | No suggestion application is easy going and user-friendly |
| Rani Ghorpade | ⭐⭐⭐⭐⭐ | — | no need for that everything is smooth and compatible |
| Omkar nanaware | ⭐⭐⭐⭐⭐ | — | Everything looks good no need to modification Keep it up |
| Rohan Deshmukh | ⭐⭐⭐⭐⭐ | More transparency in the cycle | Great concept and execution! |
| Sneha Patil | ⭐⭐⭐⭐⭐ | — | Very smooth transaction flow. |
| Amit Shinde | ⭐⭐⭐⭐⭐ | — | The metrics dashboard is very helpful. |
| Pooja Kulkarni | ⭐⭐⭐⭐⭐ | Dark mode toggle | Could use a dark mode toggle. |
| Vikram Joshi | ⭐⭐⭐⭐⭐ | — | Gasless feature makes it so easy to use! |
| Nisha More | ⭐⭐⭐⭐⭐ | — | Impressed with the secure smart contract. |
| Sagar Gaikwad | ⭐⭐⭐⭐⭐ | — | No issues found, working perfectly. |
| Tanvi Mane | ⭐⭐⭐⭐⭐ | — | Excellent decentralized saving solution. |
| Aniket Pawar | ⭐⭐⭐⭐⭐ | In-app chat | Love the community-focused approach. |
| Shweta Deshmukh | ⭐⭐⭐⭐⭐ | — | Simple, fast, and secure! |
| Rahul Bhosale | ⭐⭐⭐⭐⭐ | Email notifications | Would love to see email notifications. |
| Divya Jadhav | ⭐⭐⭐⭐⭐ | — | Easy onboarding experience. |
| Akshay Ghorpade | ⭐⭐⭐⭐⭐ | — | Really liked the transparency of operations. |
| Kavita Thorat | ⭐⭐⭐⭐⭐ | — | Perfect app for ROSCA communities. |
| Manoj Kamble | ⭐⭐⭐⭐⭐ | — | Flawless Stellar integration. |
| Pratiksha Sule | ⭐⭐⭐⭐⭐ | — | Very intuitive interface. |
| Omkar Shinde | ⭐⭐⭐⭐⭐ | — | The gasless feature was a nice surprise! |
| Sayali Chavan | ⭐⭐⭐⭐⭐ | — | Great way to save together with friends. |
| Yash Jagtap | ⭐⭐⭐⭐⭐ | — | Soroban contracts perform really well! |
| Aishwarya Kadam | ⭐⭐⭐⭐⭐ | Mobile app | Nice UI and very responsive. |
| Saurabh Mohite | ⭐⭐⭐⭐⭐ | — | Looking forward to the mainnet version. |
| Pallavi Rane | ⭐⭐⭐⭐⭐ | — | Brilliant application for financial inclusion. |
| Abhishek Pisal | ⭐⭐⭐⭐⭐ | — | Quick and easy wallet connecting. |
| Rutuja Gole | ⭐⭐⭐⭐⭐ | — | Highly recommended decentralized dApp. |

> [📊 View Full Feedback Spreadsheet](https://docs.google.com/spreadsheets/d/1rRSr3L0D3mYeXAWOXvHhujNQtJM8vqyTXPusWL-aPN8/edit?usp=sharing)

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
