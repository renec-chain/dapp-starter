#
# This file maintains the solana versions for use by CI.
#
# Obtain the environment variables without any automatic updating:
#   $ source dev-scripts/environments/solana-version.sh
#
# Obtain the environment variables and install update:
#   $ source dev-scripts/environments/solana-version.sh install

# Then to access the solana version:
#   $ echo "$cli_version"
#

echo "CLI VERSION: $CLI_VERSION"

if [[ -n $CLI_VERSION ]]; then
  cli_version="$CLI_VERSION"
else
  cli_version=1.14.6
fi


export cli_version="$cli_version"

if [[ -n $1 ]]; then
  case $1 in
  install)
    # Check if the installed solana version is the same as the desired version
    installed_version=$(solana --version 2>/dev/null | awk '{print $2}' || echo "")
    if [[ "$installed_version" == "$cli_version" ]]; then
      echo "solana-version.sh: solana $cli_version is already installed, skipping download."
    else
      sh -c "$(curl -sSfL https://release.solana.com/v$cli_version/install)"
      solana --version
    fi
    ;;
  *)
    echo "solana-version.sh: Note: ignoring unknown argument: $1" >&2
    ;;
  esac
fi
