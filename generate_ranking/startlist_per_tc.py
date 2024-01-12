import csv
"""
WIP. Tour is hardcoded, I should run this for all the GTs and I could run it for every race to come.
It's even possible to schedule when this script should run, because we have the date for each race

"""
races = (("Giro d'Italia", "13"), ("Tour de France","17"), ("Vuelta a España", "23"))
for race, race_id in races:
    print(f"Race: {race} met id: {race_id}")
    filtered_data = []
    # read the CSV file
    with open('_data/startlist-filtered.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        data = list(reader)
        # Filter the data by race_id equal to the given race_id
        filtered_data = [row for row in data if row['race_id'] == race_id]
        if filtered_data:
            # Sort the data by team_captain in ascending order and price in descending order
            sorted_data = sorted(filtered_data, key=lambda x: (x['team_captain'], -float(x['price'])))

            # create a dictionary to store the data by team captain
            data = {}
            for row in sorted_data:
                team_captain = row['team_captain']
                price = float(row['price'])
                if team_captain in data:
                    data[team_captain]['riders'].append(row)
                    data[team_captain]['price'] += price
                else:
                    data[team_captain] = {'riders': [row], 'price': price}
        
            # generate the HTML output
            output = '---\nlayout: default\ntitle: Startlijst '+ race + ' per ploegleider\n---\n\n'
            output += '{% include startlist-links.html %}\n\n'
            output += '<table class="table table-striped">\n'
            for team_captain, team_data in data.items():
                riders = team_data['riders']
                num_riders = len(riders)
                if num_riders != 1:
                    noun = 'renners'
                else:
                    noun = 'renner'
                total_price = team_data['price']
                output += f'\t<tr><td colspan="2"><h3>{team_captain}</h3></td><td><h3>{num_riders} {noun}</h3></td><td colspan="2"><h3>{int(total_price)} punten</h3></td></tr>\n'
                for rider in riders:
                    start_number = rider['start_number']
                    name = rider['rider']
                    team = rider['team']
                    country = rider['country']
                    price = rider['price']
                    if rider['dropped_out'] == '1':
                        output += f'\t<tr style="text-decoration: line-through; font-style: italic; color: red;">\n'
                    else:
                        output += '\t<tr>\n'
                    output += f'\t<td>{start_number}</td><td>{name}</td><td>{team}</td><td>{country}</td><td>{price}</td></tr>\n'
            output += '</table>\n\n'

            # write the output to an HTML file
            with open('startlist/races/GT/index.html', 'w') as htmlfile:
                htmlfile.write(output)
                print(f"created startlist per tc for { race }")
