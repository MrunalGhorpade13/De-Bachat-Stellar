# De-Bachat — Decentralized ROSCA on Stellar Soroban

> **De-Bachat** is a pure, non-custodial decentralized Rotating Savings & Credit Association (ROSCA / Bachat Gat) dApp built on the Stellar Soroban Testnet. All group logic lives on-chain — no backend, no database, no middlemen.

---

## 🎬 Demo Video

> 🔗 *[Demo video link — to be added after recording]*

---

## 🏗️ Architecture

See [ARCHITECTURE.md](../ARCHITECTURE.md) for the full data-flow diagram and design decisions.

```
User → Freighter Wallet → De-Bachat Frontend (Next.js)
                               ↕  stellar-sdk / soroban-rpc
                         DeBachat Contract (Soroban / Rust)
                               ↕  SAC token transfer
                         Stellar Testnet Ledger
```

### Contract Functions
| Function | Description |
|---|---|
| `initialize` | Set up group: name, token, contribution amount, max members |
| `join_group` | Any wallet joins the open group |
| `close_enrollment` | Organizer locks the member list |
| `contribute` | Member contributes their share (real token transfer) |
| `disburse` | Pays out entire pool to the designated cycle recipient |
| `get_config` / `get_pool_state` / `get_participants` | Read-only queries |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [Freighter Wallet](https://www.freighter.app/) browser extension
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/install-cli) (for contract deployment)

### Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Deploy the Soroban Contract
```bash
# Build
cargo build --release --target wasm32-unknown-unknown

# Deploy to Testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/de_bachat.wasm \
  --source <YOUR_ACCOUNT_ALIAS> \
  --network testnet

# Copy the returned Contract ID into frontend/.env.local
echo 'NEXT_PUBLIC_CONTRACT_ID="C..."' >> frontend/.env.local
```

### Environment Variables (`frontend/.env.local`)
```env
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_RPC_URL="https://soroban-testnet.stellar.org:443"
NEXT_PUBLIC_CONTRACT_ID="<your-deployed-contract-id>"
```

---

## 🧪 Smart Contract Tests
```bash
# From project root
cargo test
```
Tests cover: initialization, member joining, full-cycle payout, double-contribution guard, early-disburse guard.

---

## 📋 Testnet Wallets (Validation)

The app automatically logs all interacting wallet addresses. Use the **Dashboard → Interacting Wallets** panel to export them.

| # | Role | Address |
|---|---|---|
| 1 | Organizer | *logged at runtime* |
| 2–6 | Members | *logged at runtime* |

---

## 🗺️ Roadmap

- [x] Phase 1 — Project scaffold (Next.js + Soroban Rust workspace)
- [x] Phase 2 — Smart contract (ROSCA logic + unit tests)
- [x] Phase 3 — Wallet integration (Freighter + stellar-sdk)
- [x] Phase 4 — Full dashboard UI with contribute/disburse flows
- [ ] Phase 5 — Testnet deployment + Vercel deploy + demo video

---

## 📄 License
MIT

