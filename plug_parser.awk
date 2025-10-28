# plug_parser.awk - Extract plugin names from mkdocs.yml
# Prints one plugin name per line
# Handles both block form:
#   plugins:
#     - search
#     - foo: {opt: 1}
# and inline form:
#   plugins: [search, foo]

BEGIN {
  inBlock = 0
  baseIndent = -1
}

# Inline list form: plugins: [a, b]
/^[[:space:]]*plugins:[[:space:]]*\[.*\][[:space:]]*$/ {
  line = $0
  sub(/^([[:space:]]*)plugins:[[:space:]]*\[/, "", line)
  sub(/\][[:space:]]*$/, "", line)
  # Remove spaces after commas for easier split
  gsub(/[[:space:]]*/, "", line)
  n = split(line, arr, /,/) 
  for (i = 1; i <= n; i++) {
    val = arr[i]
    sub(/:.*/, "", val)  # strip config suffix after ':' if present
    if (val != "") print val
  }
  next
}

# Detect start of block 'plugins:' and remember indentation
/^([[:space:]]*)plugins:[[:space:]]*$/ {
  match($0, /^([[:space:]]*)plugins:[[:space:]]*$/, m)
  baseIndent = length(m[1])
  inBlock = 1
  next
}

# When in plugins block, end when indentation drops to baseIndent or less (and line isn't empty)
{
  if (inBlock) {
    match($0, /^([[:space:]]*)/, m2)
    curIndent = length(m2[1])
    if (curIndent <= baseIndent && $0 !~ /^[[:space:]]*$/ && $0 !~ /^[[:space:]]*-/) {
      inBlock = 0
    }
  }
}

# While in block, extract items beginning with "- "
(inBlock) {
  if ($0 ~ /^[[:space:]]*-[[:space:]]*[^#]/) {
    line = $0
    sub(/^[[:space:]]*-[[:space:]]*/, "", line)
    sub(/#.*/, "", line)     # strip trailing comment
    sub(/:.*/, "", line)      # strip config suffix after ':'
    sub(/^[[:space:]]+/, "", line)
    sub(/[[:space:]]+$/, "", line)
    if (line != "") print line
  }
}
