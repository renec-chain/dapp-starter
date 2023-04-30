.PHONY: install-deps gen-wallet set-cluster-url

export RENEC_TESTNET_URL:= https://api-testnet.renec.foundation:8899/
export RENEC_MAINNET_URL:= https://api-mainnet-beta.renec.foundation:8899/
export RENEC_LOCALNET_URL:= http://127.0.0.1:8899

CLUSTER ?= testnet

export CLUSTER_URL := $(if $(filter testnet,$(CLUSTER)),$(RENEC_TESTNET_URL),\
                 $(if $(filter mainnet,$(CLUSTER)),$(RENEC_MAINNET_URL),\
                 $(if $(filter localnet,$(CLUSTER)),$(RENEC_LOCALNET_URL),\
                 $(error Unknown cluster name: $(CLUSTER)))))

install-deps:
	@. ./dev-scripts/install-program-deps.sh

set-cluster-url: install-deps 
	@solana config set --url $(CLUSTER_URL)

gen-wallet: install-deps
	@./dev-scripts/gen-wallet.sh "$(name)"

faucet: set-cluster-url
	@./dev-scripts/faucet.sh --name "$(name)" $(amount)