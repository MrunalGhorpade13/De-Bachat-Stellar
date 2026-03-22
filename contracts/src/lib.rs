#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, vec,
    Address, Env, Map, String, Symbol, Vec,
};

// ─────────────────────────────── Storage Keys ────────────────────────────────

// Top-level persistent-storage keys
const GROUP_CONFIG: Symbol = symbol_short!("GRP_CFG");
const PARTICIPANTS: Symbol = symbol_short!("PRTCPTS");
const POOL_STATE: Symbol = symbol_short!("POOL_ST");

// ─────────────────────────────── Data Types ──────────────────────────────────

#[contracttype]
#[derive(Clone, Debug)]
pub struct GroupConfig {
    /// Human-readable name of the savings group
    pub name: String,
    /// The token used for contributions (XLM = Stellar native asset wrapper)
    pub token: Address,
    /// Amount each member must contribute per cycle (in stroops / smallest unit)
    pub contribution_amount: i128,
    /// Maximum number of members allowed
    pub max_members: u32,
    /// Address of the group organizer / creator
    pub organizer: Address,
    /// Whether the group is still open for new members
    pub is_open: bool,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct PoolState {
    /// Current accumulated balance in the pool (tracked separately from contract
    /// token balance for accounting clarity)
    pub total_contributed: i128,
    /// Index into the participants list of who receives the payout next
    pub current_recipient_index: u32,
    /// Cycle counter (starts at 0)
    pub cycle: u32,
    /// Whether the current cycle's payout has been disbursed
    pub payout_done: bool,
}

// ─────────────────────────────── Error Codes ─────────────────────────────────

mod error {
    pub const ALREADY_INITIALIZED: u32 = 1;
    pub const GROUP_CLOSED: u32 = 2;
    pub const ALREADY_A_MEMBER: u32 = 3;
    pub const GROUP_FULL: u32 = 4;
    pub const NOT_A_MEMBER: u32 = 5;
    pub const ALREADY_CONTRIBUTED: u32 = 6;
    pub const INSUFFICIENT_CONTRIBUTION: u32 = 7;
    pub const CYCLE_INCOMPLETE: u32 = 8;
    pub const PAYOUT_ALREADY_DONE: u32 = 9;
    pub const ALL_CYCLES_COMPLETE: u32 = 10;
    pub const UNAUTHORIZED: u32 = 11;
    pub const NOT_INITIALIZED: u32 = 12;
}

// ─────────────────────────────── Contract ────────────────────────────────────

#[contract]
pub struct DeBachatContract;

#[contractimpl]
impl DeBachatContract {
    // ──────────────────────── Admin / Setup ──────────────────────────────────

    /// Initialize the savings group. Called once by the organizer.
    pub fn initialize(
        env: Env,
        organizer: Address,
        name: String,
        token: Address,
        contribution_amount: i128,
        max_members: u32,
    ) {
        // Panic if already initialized
        if env.storage().persistent().has(&GROUP_CONFIG) {
            panic!("{}", error::ALREADY_INITIALIZED);
        }

        organizer.require_auth();

        let config = GroupConfig {
            name,
            token,
            contribution_amount,
            max_members,
            organizer: organizer.clone(),
            is_open: true,
        };

        let state = PoolState {
            total_contributed: 0,
            current_recipient_index: 0,
            cycle: 0,
            payout_done: false,
        };

        // Empty participants list
        let participants: Vec<Address> = vec![&env];
        // contributions_this_cycle: Map<Address, bool>
        let contributions: Map<Address, bool> = Map::new(&env);

        env.storage().persistent().set(&GROUP_CONFIG, &config);
        env.storage().persistent().set(&PARTICIPANTS, &participants);
        env.storage().persistent().set(&POOL_STATE, &state);
        // Use a distinct key for contributions map
        env.storage()
            .persistent()
            .set(&symbol_short!("CONTRIBS"), &contributions);
    }

    // ──────────────────────── Participant Onboarding ─────────────────────────

    /// Join the group. Any wallet can call this while the group is open.
    pub fn join_group(env: Env, member: Address) {
        member.require_auth();

        let config: GroupConfig = env
            .storage()
            .persistent()
            .get(&GROUP_CONFIG)
            .expect("group not initialized");

        if !config.is_open {
            panic!("{}", error::GROUP_CLOSED);
        }

        let mut participants: Vec<Address> = env
            .storage()
            .persistent()
            .get(&PARTICIPANTS)
            .unwrap_or(vec![&env]);

        if Self::is_member(&participants, &member) {
            panic!("{}", error::ALREADY_A_MEMBER);
        }

        if participants.len() >= config.max_members {
            panic!("{}", error::GROUP_FULL);
        }

        participants.push_back(member);
        env.storage().persistent().set(&PARTICIPANTS, &participants);
    }

    /// Organizer closes membership enrollment so no new members can join.
    pub fn close_enrollment(env: Env, organizer: Address) {
        organizer.require_auth();

        let mut config: GroupConfig = env
            .storage()
            .persistent()
            .get(&GROUP_CONFIG)
            .expect("group not initialized");

        if config.organizer != organizer {
            panic!("{}", error::UNAUTHORIZED);
        }

        config.is_open = false;
        env.storage().persistent().set(&GROUP_CONFIG, &config);
    }

    // ──────────────────────── Contribution ───────────────────────────────────

    /// A member contributes their share for the current cycle.
    /// The contract pulls `contribution_amount` tokens from the caller.
    pub fn contribute(env: Env, member: Address) {
        member.require_auth();

        let config: GroupConfig = env
            .storage()
            .persistent()
            .get(&GROUP_CONFIG)
            .expect("group not initialized");

        let mut state: PoolState = env
            .storage()
            .persistent()
            .get(&POOL_STATE)
            .expect("pool state missing");

        let participants: Vec<Address> = env
            .storage()
            .persistent()
            .get(&PARTICIPANTS)
            .unwrap_or(vec![&env]);

        if !Self::is_member(&participants, &member) {
            panic!("{}", error::NOT_A_MEMBER);
        }

        let mut contributions: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&symbol_short!("CONTRIBS"))
            .unwrap_or(Map::new(&env));

        if contributions.get(member.clone()).unwrap_or(false) {
            panic!("{}", error::ALREADY_CONTRIBUTED);
        }

        if state.payout_done && state.current_recipient_index as usize >= participants.len() as usize {
            panic!("{}", error::ALL_CYCLES_COMPLETE);
        }

        // Transfer tokens from member → this contract
        let token_client = token::Client::new(&env, &config.token);
        token_client.transfer(
            &member,
            &env.current_contract_address(),
            &config.contribution_amount,
        );

        // Record contribution
        contributions.set(member, true);
        state.total_contributed += config.contribution_amount;
        state.payout_done = false;

        env.storage()
            .persistent()
            .set(&symbol_short!("CONTRIBS"), &contributions);
        env.storage().persistent().set(&POOL_STATE, &state);
    }

    // ──────────────────────── Payout ─────────────────────────────────────────

    /// Disburse the pooled funds to the current cycle's designated recipient.
    /// Can be called by anyone once all members have contributed.
    pub fn disburse(env: Env) -> Address {
        let config: GroupConfig = env
            .storage()
            .persistent()
            .get(&GROUP_CONFIG)
            .expect("group not initialized");

        let mut state: PoolState = env
            .storage()
            .persistent()
            .get(&POOL_STATE)
            .expect("pool state missing");

        let participants: Vec<Address> = env
            .storage()
            .persistent()
            .get(&PARTICIPANTS)
            .unwrap_or(vec![&env]);

        let contributions: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&symbol_short!("CONTRIBS"))
            .unwrap_or(Map::new(&env));

        if state.payout_done {
            panic!("{}", error::PAYOUT_ALREADY_DONE);
        }

        if state.current_recipient_index as usize >= participants.len() as usize {
            panic!("{}", error::ALL_CYCLES_COMPLETE);
        }

        // Verify every member has contributed this cycle
        for i in 0..participants.len() {
            let p = participants.get(i).unwrap();
            if !contributions.get(p).unwrap_or(false) {
                panic!("{}", error::CYCLE_INCOMPLETE);
            }
        }

        let recipient = participants
            .get(state.current_recipient_index)
            .expect("recipient not found");

        let payout_amount = state.total_contributed;

        // Transfer full pool to recipient
        let token_client = token::Client::new(&env, &config.token);
        token_client.transfer(
            &env.current_contract_address(),
            &recipient,
            &payout_amount,
        );

        // Advance cycle
        state.current_recipient_index += 1;
        state.cycle += 1;
        state.total_contributed = 0;
        state.payout_done = true;

        // Reset contributions map for next cycle
        let empty_contributions: Map<Address, bool> = Map::new(&env);
        env.storage()
            .persistent()
            .set(&symbol_short!("CONTRIBS"), &empty_contributions);

        env.storage().persistent().set(&POOL_STATE, &state);

        recipient
    }

    // ──────────────────────── Read-Only Queries ───────────────────────────────

    /// Get the group configuration.
    pub fn get_config(env: Env) -> GroupConfig {
        env.storage()
            .persistent()
            .get(&GROUP_CONFIG)
            .expect("group not initialized")
    }

    /// Get the current pool state.
    pub fn get_pool_state(env: Env) -> PoolState {
        env.storage()
            .persistent()
            .get(&POOL_STATE)
            .expect("pool state missing")
    }

    /// Get the full participant list.
    pub fn get_participants(env: Env) -> Vec<Address> {
        env.storage()
            .persistent()
            .get(&PARTICIPANTS)
            .unwrap_or(vec![&env])
    }

    /// Check whether a specific address has contributed in the current cycle.
    pub fn has_contributed(env: Env, member: Address) -> bool {
        let contributions: Map<Address, bool> = env
            .storage()
            .persistent()
            .get(&symbol_short!("CONTRIBS"))
            .unwrap_or(Map::new(&env));
        contributions.get(member).unwrap_or(false)
    }

    /// Returns the address of the next recipient (or panics if cycles complete).
    pub fn next_recipient(env: Env) -> Address {
        let state: PoolState = env
            .storage()
            .persistent()
            .get(&POOL_STATE)
            .expect("pool state missing");
        let participants: Vec<Address> = env
            .storage()
            .persistent()
            .get(&PARTICIPANTS)
            .unwrap_or(vec![&env]);

        participants
            .get(state.current_recipient_index)
            .expect("all cycles complete")
    }

    // ──────────────────────── Internal Helpers ────────────────────────────────

    fn is_member(participants: &Vec<Address>, addr: &Address) -> bool {
        for i in 0..participants.len() {
            if participants.get(i).unwrap() == *addr {
                return true;
            }
        }
        false
    }
}

// ──────────────────────────────── Tests ──────────────────────────────────────

#[cfg(test)]
mod test {
    extern crate std;

    use super::*;
    use soroban_sdk::{
        testutils::{Address as AddressTestUtils, AuthorizedFunction, AuthorizedInvocation},
        token::{Client as TokenClient, StellarAssetClient},
        Address, Env, IntoVal, String,
    };

    // Helper: create a fresh env, deploy the contract + a mock token,
    // and fund every address with enough tokens to contribute.
    fn setup() -> (
        Env,
        Address,    // contract_id
        Address,    // token_id
        Address,    // organizer
        Vec<Address>, // members (3)
    ) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, DeBachatContract);
        let client = DeBachatContractClient::new(&env, &contract_id);

        // Deploy stellar-asset (mock token)
        let token_admin = Address::generate(&env);
        let token_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
        let token_admin_client = StellarAssetClient::new(&env, &token_id);

        let organizer = Address::generate(&env);
        let m1 = Address::generate(&env);
        let m2 = Address::generate(&env);
        let m3 = Address::generate(&env);

        // Mint 1000 units to each participant and organizer
        for addr in [&organizer, &m1, &m2, &m3] {
            token_admin_client.mint(addr, &1_000_0000000_i128); // 1000 XLM in stroops
        }

        let contribution: i128 = 100_0000000; // 100 XLM
        client.initialize(
            &organizer,
            &String::from_str(&env, "Bachat Gat #1"),
            &token_id,
            &contribution,
            &3_u32,
        );

        let members = std::vec![m1, m2, m3];
        let member_vec: Vec<Address> = Vec::from_slice(&env, &members);

        (env, contract_id, token_id, organizer, member_vec)
    }

    #[test]
    fn test_initialize() {
        let (env, contract_id, _, _, _) = setup();
        let client = DeBachatContractClient::new(&env, &contract_id);
        let config = client.get_config();
        assert_eq!(config.max_members, 3);
        assert_eq!(config.contribution_amount, 100_0000000);
        assert!(config.is_open);
    }

    #[test]
    fn test_join_and_list_participants() {
        let (env, contract_id, _, _, members) = setup();
        let client = DeBachatContractClient::new(&env, &contract_id);

        for i in 0..members.len() {
            client.join_group(&members.get(i).unwrap());
        }

        let participants = client.get_participants();
        assert_eq!(participants.len(), 3);
    }

    #[test]
    fn test_full_cycle_payout() {
        let (env, contract_id, token_id, organizer, members) = setup();
        let client = DeBachatContractClient::new(&env, &contract_id);
        let token_client = TokenClient::new(&env, &token_id);

        // All join
        for i in 0..members.len() {
            client.join_group(&members.get(i).unwrap());
        }
        client.close_enrollment(&organizer);

        // All contribute
        let m0 = members.get(0).unwrap();
        let m1 = members.get(1).unwrap();
        let m2 = members.get(2).unwrap();

        client.contribute(&m0);
        client.contribute(&m1);
        client.contribute(&m2);

        // Check pool state
        let state = client.get_pool_state();
        assert_eq!(state.total_contributed, 3 * 100_0000000_i128);

        // Disburse — recipient should be m0 (index 0)
        let recipient = client.disburse();
        assert_eq!(recipient, m0);

        // m0 should have received 300 XLM back on top of their remaining 900
        let balance = token_client.balance(&m0);
        assert_eq!(balance, 1000_0000000_i128); // paid 100, received 300, started with 1000

        // Next cycle — recipient index should have advanced to 1 (m1)
        let next = client.next_recipient();
        assert_eq!(next, m1);
    }

    #[test]
    #[should_panic]
    fn test_double_contribute_panics() {
        let (env, contract_id, _, organizer, members) = setup();
        let client = DeBachatContractClient::new(&env, &contract_id);

        for i in 0..members.len() {
            client.join_group(&members.get(i).unwrap());
        }
        client.close_enrollment(&organizer);

        let m0 = members.get(0).unwrap();
        client.contribute(&m0);
        client.contribute(&m0); // should panic
    }

    #[test]
    #[should_panic]
    fn test_disburse_before_all_contribute_panics() {
        let (env, contract_id, _, organizer, members) = setup();
        let client = DeBachatContractClient::new(&env, &contract_id);

        for i in 0..members.len() {
            client.join_group(&members.get(i).unwrap());
        }
        client.close_enrollment(&organizer);

        // Only one member contributes
        client.contribute(&members.get(0).unwrap());
        client.disburse(); // should panic — cycle incomplete
    }
}
