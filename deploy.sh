#!/bin/sh
npm run build
rm -rf ..\..\..\mooc_web_fs\teht_2_17/build
cp -r build ..\..\..\mooc_web_fs\teht_2_17