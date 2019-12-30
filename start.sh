#!/bin/bash

while true
do
    rm -rf ".persistence"
    yarn start
    sleep 1
done