#!/usr/bin/env bash

i=1
sp="/-\|"

while lsof -i :${PORT:-$1} > /dev/null;
do
    if [[ i -eq 1 ]]
    then
        printf "\e[1;31m[-]\e[0m waiting for port: $PORT"
    fi

    printf "\r\e[1;31m[${sp:i++%${#sp}:1}]\e[0m"
    sleep 1;

done