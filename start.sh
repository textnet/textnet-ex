#!/bin/bash

while true
do
    rm ./.persistence/*
    yarn start
    sleep 1
done