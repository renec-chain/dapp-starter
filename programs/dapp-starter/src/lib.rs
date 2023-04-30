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
pub struct Initialize<'info>{
    #[account(
        init, 
        payer = deployer, 
        space = 20,
    )]
    pub config: Account<'info, Counter>,

    #[account(mut)]
    pub deployer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Counter {
    pub count: u64,
}
