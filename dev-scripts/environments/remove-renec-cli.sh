### Renec CLI is not stable yet

#!/bin/bash
executable="renec"

path_to_remove="$(dirname "$(which "$executable")")"
echo $path_to_remove

# Create an empty variable to store the new PATH
new_path=""

# Remove executable path
for segment in $PATH; do
  # Check if the segment is not the one to remove
  if [[ "$segment" != "$path_to_remove" ]]; then
    new_path="${new_path:+$new_path:}$segment"
  fi
done

# Set the new PATH
export PATH="$new_path"

