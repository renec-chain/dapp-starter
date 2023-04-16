#
# This file maintains the solana versions for use by CI.
#
# Obtain the environment variables without any automatic updating:
#   $ source ci/solana-version.sh
#
# Obtain the environment variables and install update:
#   $ source ci/solana-version.sh install

# Then to access the solana version:
#   $ echo "$solana_version"
#

if [[ -n $SOLANA_VERSION ]]; then
  solana_version="$SOLANA_VERSION"
else
  solana_version=1.14.6
fi

export solana_version="$solana_version"
export PATH="$HOME"/.local/share/solana/install/active_release/bin:"$PATH"

if [[ -n $1 ]]; then
  case $1 in
  install)
    # Check if the installed solana version is the same as the desired version
    installed_version=$(solana --version 2>/dev/null | awk '{print $2}' || echo "")
    if [[ "$installed_version" == "$solana_version" ]]; then
      echo "solana-version.sh: solana $solana_version is already installed, skipping download."
    else
      sh -c "$(curl -sSfL https://release.solana.com/v$solana_version/install)"
      solana --version
    fi
    ;;
  *)
    echo "solana-version.sh: Note: ignoring unknown argument: $1" >&2
    ;;
  esac
fi
