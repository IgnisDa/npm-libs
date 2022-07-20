#!/usr/bin/env sh

set -o errexit
set -o nounset

cd dist/apps/${PROJECT_NAME}
npx remix-serve ./index.js
