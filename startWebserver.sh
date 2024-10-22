#!/bin/bash

for running_proc in $(lsof -t -i:8999); do
	kill $running_proc
done
# local server 
SCRIPT_DIR=$(dirname $(realpath "$0"))
cd $SCRIPT_DIR
php -S 127.0.0.1:8999
sleep 5
