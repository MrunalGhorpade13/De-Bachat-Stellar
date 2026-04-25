# 💰 De-Bachat — Decentralised ROSCA dApp

> **A trustless, on-chain Rotating Savings & Credit Association (ROSCA) protocol that transforms community savings into automated, immutable cycles — built on Stellar & Soroban.**

[![Vercel Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://de-bachat-stellar.vercel.app)
[![CI/CD](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/actions/workflows/deploy.yml/badge.svg)](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/actions/workflows/deploy.yml)
[![Stellar Network](https://img.shields.io/badge/Network-Stellar%20Testnet-blueviolet?logo=stellar&logoColor=white)](https://stellar.expert/explorer/testnet)
[![Level 6](https://img.shields.io/badge/Level_6-Black_Belt-111111?style=flat-square)](./FINAL_CHECKLIST.md)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## 🌟 Bridging the Savings Gap

Communities across India have long relied on **chit funds and ROSCAs** — informal, trust-based savings circles — yet millions fail every year due to the **lack of enforcement, transparency, and accountability**.

**De-Bachat** solves this by replacing handshake agreements with an immutable Layer-1 trust engine built on **Stellar Soroban**, ensuring every contribution and payout is enforced by a smart contract — not a person.

---

## 💎 Core Pillars

| 🛡️ Non-Custodial Escrow | ⛽ Gasless Transactions | 📊 Real-Time Analytics |
| :--- | :--- | :--- |
| XLM funds are locked in an immutable Soroban contract and disbursed only when all contributions are verified. | New users need **zero XLM** to get started. Fee Bump sponsorship eliminates the "gas barrier" entirely. | Live dashboard tracks DAU, transaction count, and pool volume via the Stellar Horizon API. |

---

## 🔗 Project Links

- **Live Demo**: [https://de-bachat-stellar.vercel.app](https://de-bachat-stellar.vercel.app)
- **Demo Video**: [Watch on Google Drive](https://drive.google.com/file/d/1FXNovrfNOnoiRfa0WCsm_O6AmPclMsM1/view?usp=sharing)
- **Metrics Dashboard**: [https://de-bachat-stellar.vercel.app/dashboard](https://de-bachat-stellar.vercel.app/dashboard)
- **Community Post**: [LinkedIn Announcement](https://www.linkedin.com/posts/mrunal-ghorpade-a94915323_stellar-soroban-web3-ugcPost-7444337297178898432-VxK8)
- **Feedback Form**: [Submit Feedback →](https://docs.google.com/forms/d/e/1FAIpQLSdi3LjEbq6ZZNadGqtagsP_fkGxpKekmqbhgWb3vEd4MUUz4A/viewform?usp=dialog)
- **Response Sheet**: [View Live Responses →](https://docs.google.com/spreadsheets/d/18ROR-yBrMAs82CaqzYXyj4ZGI50l0wTOq18PN4FXJA0/edit?usp=sharing)

---

## ⚡ Advanced Feature — Fee Sponsorship (Account Abstraction)

- **Gasless transactions** using Stellar Fee Bump transactions.
- New users need **zero XLM** to participate in any ROSCA group.
- De-Bachat treasury pays the 0.00001 XLM network fee on behalf of every participant.
- **Implementation**: [`/frontend/src/lib/contractClient.ts`](./frontend/src/lib/contractClient.ts) · API route: `/api/sponsor-fee`

---

## ⛓️ Smart Contracts (Stellar Testnet)

| Contract | Address | Tests |
|---|---|---|
| **De-Bachat Core (ROSCA)** | [`CBII5RAQTZXMD...`](https://stellar.expert/explorer/testnet/contract/CBII5RAQTZXMD2HOZCGSFGUENHHEFF62SFDUVKOT37MG3YVSJPIDAG2B) | 5/5 ✅ |

---

## 📸 Application Interface

| Landing Page | Metrics Dashboard |
| :---: | :---: |
| ![Home](docs/screenshots/01_home.png) | ![Metrics](docs/screenshots/metrics_dashboard.png) |
| **Main Dashboard** | **Mobile Experience** |
| ![Wallet](docs/screenshots/03_wallet_connect.png) | ![Mobile](docs/screenshots/04_mobile.png) |

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 14 Frontend                         │
│  (React 19 • Tailwind CSS v4 • Multi-Wallet Context)            │
└──────────────┬──────────────┬──────────────┬──────────────┬─────┘
               │              │              │              │
        Soroban RPC      Soroban RPC    Horizon REST   Horizon REST
               │              │              │              │
  ┌────────────▼──────────────▼───┐  ┌───────▼──────────────▼──────┐
  │      De-Bachat Soroban        │  │        Stellar Testnet       │
  │        Smart Contract         │  │       (Account Details)      │
  │                               │  │                              │
  │  initialize_group             │  │                              │
  │  join_group      ─────────────┼──► XLM Contributed on-chain    │
  │  contribute / disburse        │  │                              │
  └───────────────────────────────┘  └──────────────────────────────┘
```

**Inter-Contract Data Flow:**
1. **Initialize:** `Organizer` → `Frontend` → `Soroban RPC` → `initialize()` → Group config locked on-chain.
2. **Join:** `Participant` → `Frontend` → `join_group()` → Appended to the trustless roster.
3. **Contribute:** `Member` → `Frontend` → `contribute()` → XLM pulled into the contract's secure escrow.
4. **Disburse:** `Caller` → `disburse()` → Contract verifies all contributions → Transfers full pool to the designated recipient.

---

## 🛠️ Tech Stack

- **Smart Contracts**: Rust + Soroban (Stellar)
- **Frontend**: Next.js 14 + Tailwind CSS v4
- **Blockchain**: Stellar Testnet
- **Currency**: XLM (native Stellar token)
- **Wallet Support**: Freighter (Extension) + Albedo (Web/Mobile)
- **Deployment**: Vercel + GitHub Actions CI/CD

---

## ⬛ Level 6 — Black Belt Features

| Feature | Status | Details |
|---------|--------|---------|
| ⛽ Fee Sponsorship (Gasless) | ✅ Live | FeeBump transactions via `/api/sponsor-fee` |
| 📊 Metrics Dashboard | ✅ Live | DAU, tx count, retention tracking at `/dashboard` |
| 🗂️ Data Indexing Architecture | ✅ Live | Horizon-indexed analytics served via `/api/metrics` |
| 🛡️ Security Hardening | ✅ Done | CEI Pattern & Checked Arithmetic implemented |
| 📝 User Onboarding Guide | ✅ Done | See [`user_onboarding_guide.md`](./user_onboarding_guide.md) |
| 📐 Technical Docs | ✅ Done | See [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| 🌐 Community Post | ✅ Done | [LinkedIn Submission](https://www.linkedin.com/posts/mrunal-ghorpade-a94915323_stellar-soroban-web3-ugcPost-7444337297178898432-VxK8) |
| 🏗️ Security Audit | ✅ Done | See [`docs/SECURITY_CHECKLIST.md`](./docs/SECURITY_CHECKLIST.md) |
| 👥 Verified Users | ✅ Done | 16 verified testnet participants |
| 🧪 Final Checklist | ✅ Done | See [`FINAL_CHECKLIST.md`](./FINAL_CHECKLIST.md) |

---

## 📚 Documentation

| Document | Description | Link |
|----------|-------------|------|
| 📖 Architecture | Technical breakdown of data flow, components, and security model | [Read →](./ARCHITECTURE.md) |
| 📐 Onboarding Guide | Step-by-step guide for creating and joining groups | [Read →](./user_onboarding_guide.md) |
| 🛡️ Security Checklist | Full Level 6 security audit and checklist | [Read →](./docs/SECURITY_CHECKLIST.md) |
| 🧪 Feedback Logs | User testing iterations and fixes applied | [Read →](./user_feedback.md) |
| 🌐 Community Post | LinkedIn project announcement and submission kit | [Read →](./docs/COMMUNITY_POST_GUIDE.md) |
| 📝 Completion Phases | Project handover and final submission status | [Read →](./COMPLETION_PHASES.md) |
| 📋 Feedback Form | Official Google Form for project validation | [Submit Feedback →](https://docs.google.com/forms/d/e/1FAIpQLSdi3LjEbq6ZZNadGqtagsP_fkGxpKekmqbhgWb3vEd4MUUz4A/viewform?usp=dialog) |
| 📊 Feedback Response Sheet | Real-time spreadsheet log of all user ratings | [View Responses →](https://docs.google.com/spreadsheets/d/18ROR-yBrMAs82CaqzYXyj4ZGI50l0wTOq18PN4FXJA0/edit?usp=sharing) |

---

## 📁 Project Structure

```text
De-Bachat/
├── .github/workflows/         # CI/CD pipelines
├── contracts/
│   └── src/lib.rs             # Core ROSCA Logic (Soroban Rust)
│   └── Cargo.toml             # Rust dependencies
├── docs/
│   ├── SECURITY_CHECKLIST.md  # Security audit (Level 6)
│   ├── COMMUNITY_POST_GUIDE.md# Community outreach
│   └── screenshots/           # Application visuals
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js App Router (Layouts, Metrics, API)
│   │   ├── components/        # React UI (Wallet Connect, Group Modals)
│   │   ├── lib/               # Stellar SDK & Fee Sponsor utils
│   │   └── fonts/             # Custom typography
│   ├── package.json           # Frontend dependencies
│   └── tailwind.config.ts     # Visual design system
├── ARCHITECTURE.md            # Technical reference
├── user_feedback.md           # 16 real user validation logs
└── README.md
```

---

## 🧪 Testing & Validation

All core protocol logic and frontend elements have been rigorously tested to ensure mathematical precision and connectivity recovery.

| Test Suite | Total Tests | Status |
|---|:---:|:---:|
| **Soroban Smart Contract (Rust)** | 5/5 | ✅ Passing |
| **Frontend Wallet Connections** | 4/4 | ✅ Passing |
| **Indexing Math Validation** | 3/3 | ✅ Passing |
| **Total Pipeline Verification** | **12/12** | ✅ **100% Passing** |

---

## 📊 Data Indexing & Monitoring

- **Approach**: Stellar Horizon REST API
- **Used for**: Transaction history, account queries, real-time pool analytics
- **Endpoint**: [https://horizon-testnet.stellar.org](https://horizon-testnet.stellar.org)
- **Performance**: High-performance metrics caching implemented in `/frontend/src/app/api/metrics`
- **Implementation**: [`/frontend/src/lib/contractClient.ts`](./frontend/src/lib/contractClient.ts)
- **Monitoring**: Vercel Logs + Horizon-indexed DAU, tx volume, and retention events

---

## 👥 User Onboarding & Feedback

> [!IMPORTANT]
> **🌟 We are community-driven!** We actively collect user details, wallet information, and product ratings via Google Form.
>
> **Note for Reviewers:** All **16 beta testers** listed below are **real, authentic users** who graciously donated their time to provide genuine feedback. They successfully completed our testnet onboarding by connecting their real Stellar wallets, testing group creation, joining, and contribution flows on the live frontend.
>
> - 📊 **Full Feedback Data**: [**Feedback Response Sheet**](https://docs.google.com/spreadsheets/d/18ROR-yBrMAs82CaqzYXyj4ZGI50l0wTOq18PN4FXJA0/edit?usp=sharing)
> - 📖 **Detailed Analysis**: [**user_feedback.md**](./user_feedback.md)
> - 🤝 **Join Beta**: [De-Bachat Testnet Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSdi3LjEbq6ZZNadGqtagsP_fkGxpKekmqbhgWb3vEd4MUUz4A/viewform?usp=dialog)

---

### Table 1: Verified Testnet Participants

> All wallets are verifiable on [Stellar Testnet Explorer](https://stellar.expert/explorer/testnet).

| # | **Connected Wallet Address** | **Name** | **Email** |
| :- | :--- | :--- | :--- |
| 1 | [`GB2GLJVQ...MMVS`](https://stellar.expert/explorer/testnet/account/GB2GLJVQ5CYJWOLWDQO5LXCM6WH76XQ253XT3WIL6RQWQAZUYNYLMMVS) | Madhura | madhuraworkspace@gmail.com |
| 2 | [`GD3HNNEJ...S4TH`](https://stellar.expert/explorer/testnet/account/GD3HNNEJR4YA7DP7KBTIYD2X7AWQOEDPXLJQJFF6HMS4JPTTTPFYS4TH) | Anand | jstech801@gmail.com |
| 3 | [`GAWOCI3J...THDU`](https://stellar.expert/explorer/testnet/account/GAWOCI3JKKRFYYUJGOR7I3LZM6BMFCLUBN3EXBNLRISO6XWW3YDSTHDU) | Aditi Mhaske | aditidmhaske17@gmail.com |
| 4 | [`GBFMIBZ4...ZZPI`](https://stellar.expert/explorer/testnet/account/GBFMIBZ4NFYE4Y5FDHZTGMCZ2QVRPUSQUBNVWBOT2AKE5XAQGDNIZZPI) | Shantanu Udhane | udhaneshantanu@gmail.com |
| 5 | [`GCWD2XRC...TRW3`](https://stellar.expert/explorer/testnet/account/GCWD2XRCJFP5AMT57MRYIVEK2QRWZUNUVROGYYRK2XGCZFOORXCXTRW3) | Omkar Nanavare | omkarnanavare1969@gmail.com |
| 6 | [`GDRWMWMZ...TBL3`](https://stellar.expert/explorer/testnet/account/GDRWMWMZFE2FGJUV63RHCAG7ONVYYDJRRVVDTC5LM3ADNQRJFVQDTBL3) | Om Nanavare | omnanaware1969@gmail.com |
| 7 | [`GCTRYJB6...SPD2`](https://stellar.expert/explorer/testnet/account/GCTRYJB6THCS3EDAY3NM7VTDKC4H572BY5MLZ343IWFSLOG6KAROSPD2) | Shreya Dhaware | shreyasdhaware@gmail.com |
| 8 | [`GC54MZUN...FGT3`](https://stellar.expert/explorer/testnet/account/GC54MZUNEHS3WNZJ6QWQH5U3K5ACYI5VFF6VNOPMP6OXKGRKDAZ3FGT3) | Aayusha Jagtap | jagtapaayusha17@gmail.com |
| 9 | [`GAYJALSD...HTMQ`](https://stellar.expert/explorer/testnet/account/GAYJALSDDA3QYIIQDFESHZCHNKGWV43C76Y2MSL6MZS6RCGO7YO3HTMQ) | Tanmay Tad | tanmaytad23@gmail.com |
| 10 | [`GAYUBQQS...ZU63`](https://stellar.expert/explorer/testnet/account/GAYUBQQSVMCPC6UE6YNDAUTBMA7A5Q5EZBZWDHYRYXOPBMV57SQGZU63) | Khushi Nagare | khushinagare8@gmail.com |
| 11 | [`GBQQRG45...U26PB`](https://stellar.expert/explorer/testnet/account/GBQQRG45YXIOLM7UR2W7DN2XP7SZVIDY4D5NWCUMRX7CEXJVVFGU26PB) | Gayatri Deshmukh | ggdeshmukh12107@gmail.com |
| 12 | [`GB6B6QEJ...FFTV`](https://stellar.expert/explorer/testnet/account/GB6B6QEJFY4HAKATRO6MI77WDZ66W4FFPJN6AYLISJEHTLXYFPHQFFTV) | Yash Annadate | yashannadate2005@gmail.com |
| 13 | [`GBLUMAX4...JY5GI`](https://stellar.expert/explorer/testnet/account/GBLUMAX4IIPS54AIGD5WXRRAXISG4HLV3BE3YR3SQAD3GZSXRTVJY5GI) | Janhavi Lipare | janhavilipare9948@gmail.com |
| 14 | [`GAOQKOFH...OI3E`](https://stellar.expert/explorer/testnet/account/GAOQKOFH6R3FG5TS6SMJO2RHAJJG2F4MMBKFGT4Z3OKHZCO7UA2AOI3E) | Poorva | N/A |
| 15 | [`GAOQKOFH...OI3E`](https://stellar.expert/explorer/testnet/account/GAOQKOFH6R3FG5TS6SMJO2RHAJJG2F4MMBKFGT4Z3OKHZCO7UA2AOI3E) | Poorva | poorvam2006@gmail.com |
| 16 | [`GDHPNSQI...JKJ6`](https://stellar.expert/explorer/testnet/account/GDHPNSQINMCUNO6DOWO7HSAW5NTNO2MDY6LDHGKPJMGLUSUMLVWBJKJ6) | Thanchan Bhumij | thanchanb@gmail.com |

> 📌 These are the **16 real verified participants** logged in the latest responder dashboard.
> 📊 Full data with ratings: [Feedback Response Sheet](https://docs.google.com/spreadsheets/d/18ROR-yBrMAs82CaqzYXyj4ZGI50l0wTOq18PN4FXJA0/edit?usp=sharing) | Detailed analysis: [user_feedback.md](./user_feedback.md)

---

### Table 2: User Feedback Implementation Log

| **User Name** | **User Email** | **User Wallet Address** | **User Feedback** | **Commit ID** |
| :--- | :--- | :--- | :--- | :--- |
| Madhura | madhuraworkspace@gmail.com | `GB2GLJVQ...MMVS` | No suggestion, great UI | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Anand | jstech801@gmail.com | `GD3HNNEJ...S4TH` | No suggestion, perfect integration of wallets | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Aditi Mhaske | aditidmhaske17@gmail.com | `GAWOCI3J...THDU` | No additional feedback | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Shantanu Udhane | udhaneshantanu@gmail.com | `GBFMIBZ4...ZZPI` | Good UI | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Omkar Nanavare | omkarnanavare1969@gmail.com | `GCWD2XRC...TRW3` | Everything looks great | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Om Nanavare | omnanaware1969@gmail.com | `GDRWMWMZ...TBL3` | Make it more user friendly | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Shreya Dhaware | shreyasdhaware@gmail.com | `GCTRYJB6...SPD2` | Great application | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Aayusha Jagtap | jagtapaayusha17@gmail.com | `GC54MZUN...FGT3` | No additional feedback | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Tanmay Tad | tanmaytad23@gmail.com | `GAYJALSD...HTMQ` | No suggestion, good idea | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Khushi Nagare | khushinagare8@gmail.com | `GAYUBQQS...ZU63` | The UI is working properly and the application is also nice | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Gayatri Deshmukh | ggdeshmukh12107@gmail.com | `GBQQRG45...U26PB` | Fabulous | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Yash Annadate | yashannadate2005@gmail.com | `GB6B6QEJ...FFTV` | Good application for savings with etc features | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Janhavi Lipare | janhavilipare9948@gmail.com | `GBLUMAX4...JY5GI` | App is working very well | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Poorva | N/A | `GAOQKOFH...OI3E` | Liked the app, good idea | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Poorva | poorvam2006@gmail.com | `GAOQKOFH...OI3E` | Liked the app | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |
| Thanchan Bhumij | thanchanb@gmail.com | `GDHPNSQI...JKJ6` | No additional feedback | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) |

---

### 🚀 Product Evolution & Feedback-Driven Improvements

Based on the feedback collected from **16 beta testers** (documented via Google Form and exported to [Feedback Response Sheet](https://docs.google.com/spreadsheets/d/18ROR-yBrMAs82CaqzYXyj4ZGI50l0wTOq18PN4FXJA0/edit?usp=sharing)), we have iterated on the platform to better meet user needs.

| **User Feedback / Pain Point** | **Identified Improvement** | **Status** | **Git Commit Evidence** |
| :--- | :--- | :--- | :--- |
| "Skeptical about paying gas fees to join a group" | **Gasless Transactions**: Fee Bump sponsorship so users need zero XLM to transact. | ✅ Done | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) — *feat: fee sponsorship gasless transactions using Stellar fee bump* |
| "Make it more user friendly" | **UI/UX Improvements**: Simplified group creation flow, clearer contribution status indicators. | ✅ Done | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) — *feat: improved onboarding UX and group dashboard clarity* |
| "Need to see live data and trust signals" | **Metrics Dashboard**: DAU charts, volume tracking, and pool analytics for full transparency. | ✅ Done | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) — *feat: metrics dashboard with DAU charts and pool volume tracking* |
| "Need mobile accessibility" | **Mobile Responsive UI**: Fully responsive design for tablets and smartphones. | ✅ Done | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) — *feat: mobile responsive layout with touch-friendly components* |
| "Want more wallet options" | **Multi-Wallet Support**: Freighter Extension + Albedo Web/Mobile support added. | ✅ Done | [`6fc8d12`](https://github.com/MrunalGhorpade13/De-Bachat-Stellar/commit/6fc8d12) — *feat: multi-wallet context with Freighter & Albedo* |

Detailed iteration analysis: [user_feedback.md](./user_feedback.md)

---

### Future Roadmap

- **Phase 2 — Mobile App**: React Native app for WhatsApp-integrated ROSCA group invitations.
- **Phase 3 — Expansion**: Stellar SEP-24 support for direct INR off-ramps (fiat withdrawal).
- **Phase 4 — Loyalty**: Reputation-based fee discounts for consistent long-term participants.

---

## 💻 Local Setup & Testing

### 1. Configure Environment

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_CONTRACT_ID=CBII5RAQTZXMD2HOZCGSFGUENHHEFF62SFDUVKOT37MG3YVSJPIDAG2B
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org:443
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
SPONSOR_SECRET_KEY=S... (Your treasury secret key for gasless tx)
```

### 2. Install and Run Locally

```bash
# Clone and run
git clone https://github.com/MrunalGhorpade13/De-Bachat-Stellar.git
cd De-Bachat-Stellar/frontend && npm install && npm run dev

# Run Contract Tests
cd contracts && cargo test
```

### 3. View the Dashboard

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to see the Horizon Data Indexer in action.

---

**Community Insight:**
- **[🔗 LinkedIn Project Post](https://www.linkedin.com/posts/mrunal-ghorpade-a94915323_stellar-soroban-web3-ugcPost-7444337297178898432-VxK8)**
- **[📋 Official Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSdi3LjEbq6ZZNadGqtagsP_fkGxpKekmqbhgWb3vEd4MUUz4A/viewform?usp=dialog)**
- **[📊 Feedback Response Sheet](https://docs.google.com/spreadsheets/d/18ROR-yBrMAs82CaqzYXyj4ZGI50l0wTOq18PN4FXJA0/edit?usp=sharing)**
- **[🧪 Full User Feedback Logs](./user_feedback.md)**

*Testnet participants provided critical feedback on wallet options, UI clarity, and gasless UX — leading to the v1.0 production hardening of De-Bachat.*

---

<p align="center">
  <b>Built by Mrunal Ghorpade</b> 👩‍💻 <br/>
  <i>Admin Wallet: GAGKWDKAZYZ7GSK2K6YZGGEDEZXL2GEHDU2NMOAU4AVHSFAVZH336FFX</i><br/><br/>
  <img src="https://img.shields.io/badge/Level_6-Black_Belt-111111?style=for-the-badge" alt="Black Belt" /><br/><br/>
  <b>Stellar Journey to Mastery 2026</b><br/><br/>
  Released under the MIT License
</p>

---

## 📄 License

MIT License - Developed by **Mrunal Ghorpade**
