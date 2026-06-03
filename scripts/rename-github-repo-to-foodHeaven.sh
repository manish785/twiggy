#!/usr/bin/env bash
# Rename GitHub repo manish785/twiggy -> manish785/foodHeaven and update local remote.
set -euo pipefail

OWNER="manish785"
OLD_NAME="twiggy"
NEW_NAME="foodHeaven"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Renaming GitHub repo ${OWNER}/${OLD_NAME} -> ${OWNER}/${NEW_NAME} ..."

if command -v gh >/dev/null 2>&1; then
  gh repo rename "$NEW_NAME" --repo "${OWNER}/${OLD_NAME}" --yes
else
  if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    echo "Install GitHub CLI (gh) and run: gh auth login"
    echo "Or set GITHUB_TOKEN and re-run this script."
    echo ""
    echo "Manual rename:"
    echo "  https://github.com/${OWNER}/${OLD_NAME}/settings"
    echo "  Repository name -> ${NEW_NAME} -> Rename"
    exit 1
  fi
  curl -fsSL -X PATCH \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${OWNER}/${OLD_NAME}" \
    -d "{\"name\":\"${NEW_NAME}\"}"
  echo ""
fi

cd "$REPO_ROOT"
git remote set-url origin "https://github.com/${OWNER}/${NEW_NAME}.git"
echo "Local remote updated:"
git remote -v
echo ""
echo "Done. Push with: git push -u origin main"
