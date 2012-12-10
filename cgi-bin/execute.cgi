#!/bin/sh

read param

echo 'Content-Type: application/json'
echo ''
echo $param | cut -d = -f 2- | tr % = | tr + ' ' | nkf -mQ 1>&2
echo $param | cut -d = -f 2- | tr % = | tr + ' ' | nkf -mQ > konoha.k
minikonoha konoha.k &
cmd_pid=$!
sleep 15
kill $cmd_pid
