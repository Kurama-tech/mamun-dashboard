#!/bin/sh
set -ex

#nginx
git pull origin dumdum

docker compose down && docker compose pull && docker compose up -d 