#!/bin/bash
path="/home/wijnandb/sites/heroku/wielerspel2023"
cd $path
echo "Start scraping"
python generate_ranking/scraping.py
echo "Does this mean the scraping is done?"