#!/usr/bin/env bash
set -e

source dev-scripts/environments/cli-version.sh install
source dev-scripts/environments/anchor-version.sh install
source dev-scripts/environments/remove-renec-cli.sh

set -x
