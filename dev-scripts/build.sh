
# gen new program id
anchor keys list
PROGRAM_ID=$(solana address -k target/deploy/dapp_starter-keypair.json)

# Set the file path
FILE_PATH="programs/dapp-starter/src/lib.rs"

# Make sure the file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File not found: $FILE_PATH"
    exit 1
fi

# Replace the existing declare_id! line with the new PROGRAM_ID
TEMP_FILE=$(mktemp)
awk -v program_id="$PROGRAM_ID" \
    '{gsub(/declare_id!\("[A-Za-z0-9]{44}"\);/, "declare_id!(\""program_id"\");")}1' \
    "$FILE_PATH" > "$TEMP_FILE"
cat "$TEMP_FILE" > "$FILE_PATH"
rm "$TEMP_FILE"

# Print the updated declare_id! line
echo "updated file: $(grep -E 'declare_id!\("[A-Za-z0-9]{44}"\);' "$FILE_PATH")"


# Build the program 
anchor build 

# Copy the artifacts in to app
cp target/idl/dapp_starter.json app/src/artifacts
cp target/types/dapp_starter.ts app/src/artifacts