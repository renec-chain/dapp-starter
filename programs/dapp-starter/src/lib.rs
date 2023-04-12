use anchor_lang::prelude::*;

declare_id!("ChK6NFUxhKSvKA1dM3x4jeriFpyk2FXjDYyxs8FNFm4w");

#[program]
pub mod dapp_starter {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
