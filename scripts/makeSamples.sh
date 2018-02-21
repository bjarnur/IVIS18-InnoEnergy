#!/bin/bash

#
# Use this script to create small samples of the data.
#
# To test smaller datasets, you have to alter the dataLocation in lib/db/tableConfigs.js
#
# then simply type npm test to rebuild the database again. It will delete the old one, 
# so stash it somewhere if you want to save it for later
#


data_file=../secret/el_07_07_2017.csv

dir=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

if [ "$dir" == "$PWD" ]; then
  if [ ! -f $data_file ]; then
    echo "Data file is not found in the secret folder!"
    exit 1
  fi
  head -n 100 $data_file > ../secret/sample100.csv
  head -n 500 $data_file > ../secret/sample500.csv
  echo "Success! Don't forget to alter the path in lib/db/parser.js"
  echo "To build the database again, move the db.sqlite file out of the secret folder."
else
  echo "Please execute this script from the directory its in. Exiting."
  exit 1
fi
