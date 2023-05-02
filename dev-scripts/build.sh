
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

echo $PROGRAM_ID

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


APP_CONFIG_FILE="app/src/artifacts/config.json"
# Update the PROGRAM_ID in the config.json file
TEMP_FILE=$(mktemp)

# Replace the existing programId value with the new PROGRAM_ID
awk -v program_id="$PROGRAM_ID" \
  'BEGIN {FS=OFS="\""} \
  /"programId":/ {$4=program_id} \
  {print}' "$APP_CONFIG_FILE" > "$TEMP_FILE"

# Replace the original config file with the modified one
mv "$TEMP_FILE" "$APP_CONFIG_FILE"