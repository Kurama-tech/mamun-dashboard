#!/bin/sh
set -ex

#nginx
export PORT=8001

pm2-runtime start npm --name "jwc-backend" -- start
