#!/bin/bash
# ignore this script.

here=`pwd`
cd ..
rm -rf www
cd $here
mv * ..
cd ..
rm -rf inconvergent-sandbox
refresh

