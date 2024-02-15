#!/bin/sh
set -ex

#nginx

pm2-runtime start npm --name "omer-backend" -- start
