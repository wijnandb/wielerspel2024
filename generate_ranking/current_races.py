"""
- get calendar
- filter it for upcoming races
- get startlists
- create html files
"""


import process_files, start_list

from datetime import timedelta
import datetime

calendar = process_files.read_csv_file('calendar.csv')

today = datetime.datetime.now()

# print(today)
currentweek = today.isocalendar().week
# print(currentweek)
calendar_with_startdate = [[datetime.datetime.strptime(item[0], '%Y-%m-%d')] + item[1:] for item in calendar[1:]]

#races = filter(lambda x: x[0] > datetime.datetime.now(), calendar[1:])
calendar_with_dates = []
for c in calendar_with_startdate:
    if c[1] != "":
        c[1] = datetime.datetime.strptime(c[1], '%Y-%m-%d')
    calendar_with_dates.append(c)
    # print(calendar_with_dates[-1])


def create_html_file(c):
    # generate the HTML output
    output = '---\nlayout: startlist\ntitle: Startlijst '+ c[2] +' ('+ c[4] +')\n'
    output += 'race_id: '+ c[3] +'\n---\n\n'
    # output += '{% include startlist.html %}\n\n'
    output += '<a href="https://firstcycling.com/race.php?r='+ c[3] +'&y=2023&k=8" target="_new" title="Bekijk op FirstCycling.com">Bekijk volledige startlijst op FirstCycling</a>\n\n'


    # write the output to an HTML file
    with open('startlist/races/'+ c[3] +'.html', 'w') as htmlfile:
        htmlfile.write(output)


def is_current_race(race):
    """
    For races that are going on now, or are starting with a week, we want to create a startlist.
    There are one day races and races that span multiple days.
    Starting with all racves, we can eliminate one-day races that have already been run, so where there
    is only a startdate and it is in the past.
    Also, for multiple day races that are in the past, we can skip those too

    """
    days_in_future = 5
    # skip multiple day races in the past
    if race[1]:
        # these are the multiple day races
        if race[1].date() < today.date():
            # the finish is in the past, so skip
            return False
        elif race[0].date() < today.date() + timedelta(days=days_in_future):
            print(f"{race} Finish in the future, start in the past, now or in near future")
            return True
    # now checking one day races
    elif race[0].date() < today.date():
        # print(f"{race} in the past")
        return False
    elif race[0].date() < today.date() + timedelta(days=days_in_future):
        print(f"One day race to show: {race}")
        return True
    else:
        # print("Future one day race")
        return False



current_races = [['startdate','enddate','race','FC_race_id','category','points','jpp']]    
for race in calendar_with_dates:
    if is_current_race(race):
        print(race)
        current_races.append(race)
        create_html_file(race)
        try:
            start_list.get_riders(race[3], '2023')
        except:
            print("No startlist found")
        
        
process_files.write_csv_file("current_races.csv", current_races)
