
#!/bin/bash
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

echo "expected program id: $PROGRAM_ID"

# Replace the existing declare_id! line with the new PROGRAM_ID
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac OSX
    sed -i "" "s/declare_id!(\"[^\"]*\")/declare_id!(\"$PROGRAM_ID\")/g" "$FILE_PATH"
else
    # Linux and others
    sed -i "s/declare_id!(\"[^\"]*\")/declare_id!(\"$PROGRAM_ID\")/g" "$FILE_PATH"
fi

# Get program id from the file
UPDATED_PROGRAM_ID=$(grep -E 'declare_id!\("[A-Za-z0-9]{44}"\);' "$FILE_PATH" | grep -oE '[A-Za-z0-9]{44}')
echo "updated program id: $UPDATED_PROGRAM_ID"

# Compare it to the existing PROGRAM_ID
if [[ "$PROGRAM_ID" != "$UPDATED_PROGRAM_ID" ]]; then
    echo "Warning: PROGRAM_ID does not match the UPDATED_PROGRAM_ID"
    exit 1
fi

# Build the program 
anchor build 

# Copy the artifacts into the app's artifacts folder
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