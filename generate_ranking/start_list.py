"""
For each race a startlist is published on FirstCycling.
https://firstcycling.com/race.php?r=12&y=2023&k=start
r = race_id.
y = year 
and k = start means startlist

The idea is to go over this list, get all the riders and their (cqranking) id's and then
look up the team_captain.

We can then show a table with the riders and their team captains.

If we use datatables, we don't even have to think about sorting, searching etc.

On the page, we look for tables. The first table has nothing, the others each hold a ccyling team with riders.
"""
import requests
from bs4 import BeautifulSoup
import process_files, first_cycling, add_teamcaptains

riders = process_files.read_csv_file('all_riders_cqranking_with_fc_rider_id.csv')
# unknown_riders = process_files.read_csv_file('unknown_riders.csv')

# eventually we need to store it in a startlist csv
# but for now we just print it
startlist = [['race_id', 'start_number', 'rider', 'cq_rider_id', 'team', 'country', 'team_captain', 'team_captain_id', 'price', 'dropped_out']]


def get_riders(race_id, year='2023'):
    start_url = "https://firstcycling.com/race.php?r="+race_id+"&y="+year+"&k=8"
    print(start_url)

    r = requests.get(start_url)
    print(r.status_code)
    if r.status_code == 200:
        
        soup = BeautifulSoup(r.text, 'html.parser')
        result_tables = soup.find_all('table')

        # the first table is empty, the others are the teams
        for table in result_tables[2:]:
            # print(table)
            header = table.find('th')
            team = header.text
            body = table.find('tbody')
            rows = body.find_all('tr')
            for row in rows:
                tds = row.find_all('td')
                if len(tds) > 1:
                    start_number = tds[0].text.strip()
                    # country = tds[1].find('img').get('title')
                    country = ""
                    rider = tds[1].find('a').get('title').strip()
                    link = tds[1].find('a').get('href').split('=')[1]
                    fc_rider_id = link.split('&')[0]
                    style = tds[1].find('a').get('style')
                    if style:
                        dropped_out = 1
                    else:
                        dropped_out = ""
                    # print(fc_rider_id)
                    try:
                        # here I am looking to find a rider by name to add the cq_rider_id
                        # rider_id, country = first_cycling.ridername_to_id(rider, fc_rider_id)
                        # I better look up the rider by fc_rider_id. If that doesn't exist, I don't care about the rider
                        rider_id, country = first_cycling.fcid_to_cqid(fc_rider_id)
                        ploegleider, ploegleider_id, points = add_teamcaptains.add_teamcaptain_to_startlist(rider_id)
                    except:
                        pass
                    
                    # print(race_id, start_number, rider, rider_id, team, country, ploegleider, ploegleider_id, points,dropped_out)
                    if country:
                        startlist.append([race_id, start_number, rider, rider_id, team, country, ploegleider, ploegleider_id, points,dropped_out]) 

        process_files.write_csv_file('startlist.csv', startlist)

        # now filter the startlist to only include riders that have been sold, and sort by team captain and price
        filtered_startlist = [row for row in startlist if row[7] != '-']
        process_files.write_csv_file('startlist-filtered.csv', filtered_startlist)
    else:
        print(f"Error for {start_url}: {r.status_code}")

# calendar = process_files.read_csv_file('calendar2022.csv')
# for c in calendar[1:]: 
# #     print(c)
#      get_riders(c[3], '2022')

"""
Here I can call the function with the right race_id and year.
Based on today's date, I call either Giro (april-may), or Tour (june, july) or Vuelta (august)
"""

# get_riders('258', '2023')
