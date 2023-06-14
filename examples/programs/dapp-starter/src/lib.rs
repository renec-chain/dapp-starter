use anchor_lang::prelude::*;

declare_id!("ErCnpxub8XL8SGjdUSZLgs5FuRN57WD8KfUgCaboeuPW");

#[program]
pub mod dapp_starter {
    use super::*;
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = deployer, space = 8 + 8)]
    pub config: Account<'info, Counter>,

    #[account(mut)]
    pub deployer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(
        mut
    )]
    pub config: Account<'info, Counter>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
}
