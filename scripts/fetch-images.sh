#!/usr/bin/env bash
# Download every Pexels photo referenced in src/data/images.js into
# public/photos, in two sizes, so the site can self-host them.
# Afterwards build with VITE_PHOTOS_LOCAL=1 (see README).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/photos
ids=$(grep -oE 'id: [0-9]+' src/data/images.js | grep -oE '[0-9]+' | sort -u)
for id in $ids; do
  for w in 800 1600; do
    out="public/photos/${id}-${w}.jpg"
    if [ -s "$out" ]; then continue; fi
    echo "→ $out"
    curl -fsSL "https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}" -o "$out"
  done
done
echo "done: $(ls public/photos | wc -l) files in public/photos"
