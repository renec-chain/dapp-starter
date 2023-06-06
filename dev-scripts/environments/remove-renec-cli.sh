### Renec CLI is not stable yet

#!/bin/bash
executable="renec"

path_to_remove="$(dirname "$(which "$executable")")"
echo $path_to_remove

# Create an empty variable to store the new PATH
new_path=""

# Remove executable from $PATH
IFS=':' read -ra path <<< "$PATH"
for p in "${path[@]}"; do
  if [[ "$p" != "$path_to_remove" ]]; then
    new_path+="$p:"
  fi
done

# Set the new PATH
export PATH="$new_path"

