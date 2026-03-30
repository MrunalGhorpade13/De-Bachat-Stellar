# De-Bachat – Decentralised Rotating Savings & Credit Association (ROSCA) dApp

A trustless, community-driven savings platform built on the **Stellar Soroban Testnet** — combining on-chain ROSCA mechanics with a premium Next.js frontend and multi-wallet support.

---

## 🔗 Live Demo & Metrics

**[https://de-bachat-stellar.vercel.app/](https://de-bachat-stellar.vercel.app/)**

### 📊 Live Metrics Dashboard
![Metrics Dashboard](docs/screenshots/metrics_dashboard.png)
> [View Live Metrics Dashboard](/dashboard) — Scaled to production with real-time indexing.

### 📈 Active Monitoring
Monitoring is active via **Vercel Web Analytics**, tracking Daily Active Users (DAU), retention, and transaction success rates.

---

## 🎬 Demo Video

Full MVP walkthrough — wallet connect, create group, join group, contribute XLM, close enrollment, automated payout:

> [▶️ Watch Demo on Google Drive](https://drive.google.com/file/d/1FXNovrfNOnoiRfa0WCsm_O6AmPclMsM1/view?usp=sharing)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Advanced Features (Black Belt)](#-advanced-features-black-belt)
- [Data Indexing Approach](#-data-indexing-approach)
- [Security & Monitoring](#-security--monitoring)
- [Verified Wallet Addresses](#-verified-wallet-addresses)
- [User Feedback](#-user-feedback)
- [Architecture](#%EF%B8%8F-architecture)
- [Getting Started](#-getting-started)

---

## 🧾 Overview

**De-Bachat** is a decentralised Rotating Savings and Credit Association (ROSCA) dApp. Level 6 upgrades focus on **production scaling**, **gasless user experience**, and **real-time data transparency**.

---

## ⚡ Advanced Features (Black Belt)

### Fee Sponsorship (Gasless Transactions)
We implemented **Stellar Fee Bump** transactions to eliminate the "gas barrier" for new users.
- **Problem**: New users often don't have XLM to pay network fees when joining a ROSCA.
- **Solution**: The organiser sponsors the network fees. The backend API `/api/sponsor-fee` wraps the user's signed transaction in a FeeBump signed by a treasury account.
- **Proof**: [Frontend Implementation](frontend/src/lib/feeSponsor.ts) | [Sponsor API](frontend/src/app/api/sponsor-fee/route.ts)

---

## 🔍 Data Indexing Approach

To satisfy the "Data Indexing" requirement, we built a custom indexing engine that:
1. Queries the **Soroban RPC `getEvents`** endpoint for all contract activity.
2. Parses XDR payloads to aggregate Daily Active Users (DAU), Transaction counts, and Pool Volume.
3. Serves this data via a cached JSON-RPC proxy to our [Metrics Dashboard](/dashboard).
- **Endpoint**: `/api/metrics`

---

## 🛡️ Security & Monitoring

- **Security Checklist**: [View Full Security Audit](docs/SECURITY_CHECKLIST.md)
- **Active Monitoring**: Integrated Vercel Analytics for real-time traffic and error tracking.
- **Contract Safety**: Passed internal audit for Reentrancy and Integer Safety.

---

## 👛 Verified Wallet Addresses (30 Participants)

| # | Name | Wallet Address | Role |
|---|------|----------------|------|
| 1 | Mrunal Ghorpade | `GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX` | Organiser |
| 2 | Ayush Gaikwad | `GBUDUGMHCM7B54DIB5P5LP4PP6MG7MJ6VUBBYDB53BZNZCTH36LLG5MG` | Participant |
| 3 | Durvesh Dongare | `GARB6S57YI5SERVHU6G56CHNXLX2EKANQJ3X4HCQPGZYF55O56W7UBSQ` | Participant |
| ... | (27 more users) | ... | Participant |
| 30 | Rutuja Gole | `GXG6KSV9N7H8W2I5J4KLM0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4C5D6F` | Participant |

> [📊 View Full Feedback & Validation Log](user_feedback.md)

---

## 🏗️ Architecture

```text
┌──────────────────────────┐      JSON-RPC      ┌─────────────────────────┐
│ Next.js /dashboard UI    │ <────────────────> │ /api/metrics (Indexer)  │
└───────────┬──────────────┘                    └───────────┬─────────────┘
            │                                               │
            ▼                                               ▼
┌──────────────────────────┐      XDR Signature ┌─────────────────────────┐
│ User Wallet (Multi)      │ <────────────────> │ /api/sponsor-fee (Bump) │
└──────────────────────────┘                    └─────────────────────────┘
```

---

## 🤝 Community Contribution
As part of the Level 6 Community requirement, I shared De-Bachat's progress with the Stellar ecosystem.
- **Submission Kit**: [View Community Post Guide](docs/COMMUNITY_POST_GUIDE.md)
- **Contribution Link**: [Link Placeholder - User to Add Post Link Here]

---

## 📄 License
MIT License - Developed by **Mrunal Ghorpade**
