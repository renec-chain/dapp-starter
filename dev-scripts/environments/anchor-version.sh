#!/bin/bash
#
# This file maintains the anchor versions 
#
# Obtain the environment variables without any automatic updating:
#   $ source dev-scripts/environments/anchor-version.sh
#
# Obtain the environment variables and install/update anchor:
#   $ source dev-scripts/environments/anchor-version.sh install

# Then to access the anchor version:
#   $ echo "$anchor_version"
#

if [[ -n $ANCHOR_VERSION ]]; then
  anchor_version="$ANCHOR_VERSION"
else
  anchor_version=0.25.0
fi

export anchor_version="$anchor_version"
export PATH="$HOME"/.cargo/bin:"$PATH"


if [[ -n $1 ]]; then
  case $1 in
  install)
        # intstall avm if not installed
        if [[ "$(uname)" == "MINGW"* ]] && ! anchor --version &> /dev/null ;then
          cargo install --git https://github.com/coral-xyz/anchor --tag v$anchor_version anchor-cli --locked --force
          anchor --version
         # intstall avm if not installed
        elif ! command -v avm &> /dev/null; then
            cargo install --git https://github.com/project-serum/anchor avm --locked 
            anchor --version
            avm install $anchor_version
            avm use $anchor_version
        else
          echo "Anchor version $anchor_version is installed"
        fi
    ;;
  *)
    echo "anchor-version.sh: Note: ignoring unknown argument: $1" >&2
    ;;
  esac
fi