#!/bin/bash
# ignore this script.

here=`pwd`
cd ..
rm -rf views
cd $here
mv * ..
cd ..
rm -rf inconvergent-sandbox
refresh

