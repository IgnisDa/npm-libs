#!/usr/bin/env sh

for project in "nx-rust" "remix-pagination"; do
    node "./deployment/should-publish-npm.mjs" "${project}"
    status=$?
    [ $status -eq 1 ] && pnpm nx deploy "${project}"
done
