.PHONY: install-deps gen-wallet

export SOLANA_VERSION:= 1.14.6
export RENEC_TESTNET_URL:= https://api-testnet.renec.foundation:8899/
export RENEC_MAINNET_URL:= https://api-mainnet-beta.renec.foundation:8899/


install-deps:
	@. ./dev-scripts/install-program-deps.sh


gen-wallet: install-deps
	@./dev-scripts/gen-wallet.sh