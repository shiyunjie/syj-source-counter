#!/usr/bin/env bash
rmbuild(){
    if [ ! -d "build" ];then
        mkdir build
    fi
otherFile=`ls build/* |wc -w`
 if [ "$otherFile" -gt "0" ];then
         rm build/*
     fi
}
rmbuild && ./node_modules/.bin/babel src --out-dir build