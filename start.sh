#!/bin/bash

while true
do
    # rm -rf ".persistence/app"
    # rm -rf ".persistence/alt"
    # mkdir ".persistence/app"
    # mkdir ".persistence/alt"
    rm ./.persistence/app/*
    yarn start
    sleep 1
done