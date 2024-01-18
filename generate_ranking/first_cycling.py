import requests
from bs4 import BeautifulSoup
import process_files
YEAR = 2024
""""
Some results are not on CQranking, for innstance for the Big Tours
we also award points for the leaders of the GC, the points and mountains ranking 
and for the best young rider in the GC.

On First Cycling, we can find those results.
The url is https://firstcycling.com/race.php?r=13&y=2022&e=
r=13 is Giro d'Italia

y is the year and 
e is the stage number

Without a value for e, we get the final GC results.

There are different divs for each ranking:
div id="gc" is the General Classification
div id="youth" is the best young rider
div id="point" is the points ranking
div id="mountain" is the mountains ranking

Within the div there is a table with the results.
In the first tr is the leader.
td 0 contains the position
td 1 is hidden and contains the year of birth of the rider
td 2 has an image with the flag of country of the rider
td 3 has an href with rider_id (this is a different rider_id than the one on CQranking),
a span with the last name and the first name in text.
td 4 has an href with the team name
td 5 has UCI points
td 6 has the time

These functions get called from the 'normal' scraping process and return the cq_riderid



"""
riders = process_files.read_csv_file('all_riders_cqranking_with_fc_rider_id.csv')

def scrape_result(racename, jersey, year=YEAR):
    """
    Visit the page.
    Get the number 1 for the different rankings.
    Find the CQranking id for the rider
    Create a result line, containing:

    - rank
    - category
    - race_name
    - race_id ??
    - rider
    - rider_id (CQranking id)
    - points
    - JPP
    Or: call this function with a specific stage number, to get 
    - the stage winner (if at all necessary)
    - the leader jerseys

    There are different divs for each ranking:
        div id="sta" is the stage result
        div id="gc" is the General Classification
        div id="youth" is the best young rider
        div id="point" is the points ranking
        div id="mountain" is the mountains ranking
    
    """
    race_id = str(racename_to_id(racename))
    # print(f"{racename} omgezet naar id: {race_id}")
    stage = str(stagename_to_number(racename))
    # print(stage)
    if stage == "0":
        stage=""
    year = str(year)
    base_result_url = "https://firstcycling.com/race.php?r="+race_id+"&y="+year+"&e="+stage
    # print(base_result_url)
    b = base_result_url
    r = requests.get(b)
    soup = BeautifulSoup(r.text, "html.parser")
    # get the different rankings
    div = soup.find("div", id=jersey)
    # print(div)
    if div:
        # print(f"Looking for wearer of {jersey} jersey")
        table = div.find("tbody")
        # print("Found table")
        tablerow = table.find("tr")
        # print(tablerow)
        # for tablerow in tablerows[:1]:
        tds = tablerow.find_all("td")
        if len(tds) == 1:
            return "Nog geen uitslag bekend"
        # print(tds[0].text)
        if int(tds[0].text) == 1:
            try:
                link = tds[1].find('a').get('href').split('=')[1]
                name = tds[1].text.strip()
                # print(f"Found {name} as wearer of {jersey} jersey in cell 1")
            except:
                try:
                    link = tds[2].find('a').get('href').split('=')[1]
                    name = tds[2].text.strip()
                    # print(f"Found {name} as wearer of {jersey} jersey in cell 2")
                except:
                    try:
                        link = tds[3].find('a').get('href').split('=')[1]
                        name = tds[3].text.strip()
                        # print(f"Found {name} as wearer of {jersey} jersey in cell 3")
                    except:
                        link = tds[4].find('a').get('href').split('=')[1]
                        name = tds[4].text.strip()
                        # print(f"Found {name} as wearer of {jersey} jersey in cell 4")
            fc_rider_id = link.split('&')[0]
            # print(f"Found rider_id {fc_rider_id} for {name}")
            rider_id, country = ridername_to_id(name, fc_rider_id)
            return rider_id, name
        else:
            # print(f"Did not find a number 1, in race { race_id } for year { year}")
            return None, None
            """
            Now I want to get the rider_id from CQranking
            by passing in the rider name
            """
    else:
        return None, None


def ridername_to_id(name, fc_rider_id):
    """
    I want to look up/find the CQrider_id 
    
    I have a list of all known active riders from CQRanking.
    The (interesting) fields are:
    - UCICode, which contains both three-letter nationality and year of birth, so that could be interesting to use
    - Full name, with last name(s) first and then first name(s)
    Let's start simple, just loop over the riders until I have a match, which means the
    full name from first cycling equals the full name at CQranking.

    Also retutning the country
    """
    from unidecode import unidecode

    for rider in riders[1:]:
        # print(rider, len(rider))
        if len(rider) > 9:
            if int(fc_rider_id) == int(rider[9]):
                # print(f"Match gevonden {name } op id voor { fc_rider_id }")
                return rider[2], rider[6]

    for rider in riders[1:]:
        if unidecode(rider[4].lower()) == unidecode(name.lower()):
            if len(rider) == 9:
                # print(f"Length of rider is 9, so I'm adding the fc_rider_id to the list")
                # I want to add the firstcycling rider_id to the list of riders
                rider.append(fc_rider_id)
                process_files.write_csv_file('all_riders_cqranking_with_fc_rider_id.csv', riders)
            else:
                print(f"Length of rider is {len(rider)}, so I'm not adding the fc_rider_id to the list")
            return rider[2], rider[6]
    """
    If we get here, the names aren't exactly the same. 
    This means it's a bit harder to find, let's step up our game.
    We have got year_of_birth and country. 
    Country are the first three character in UCICode, year of birth the next 4.
    So, let's try to find a match on that.
    Once we find a match, we see if parts of the name are in the Full name.
    """
    for rider in riders[1:]:
        parts = name.split()
        if unidecode(parts[0].lower()) in unidecode(rider[4].lower()) and unidecode(parts[1].lower()) in unidecode(rider[4].lower()):
            if len(rider) == 9:
                # I want to add the firstcycling rider_id to the list of riders
                rider.append(fc_rider_id)
                process_files.write_csv_file('all_riders_cqranking_with_fc_rider_id.csv', riders)
            else:
                print(f"Length of { rider[4] } is {len(rider)}, so I'm not adding the fc_rider_id to the list")
            return rider[2], rider[6]

"""
Tour de France : 17
Vuelta a Espana: 23 
Giro d'Italia: 13
"""

def racename_to_id(name):
    if name[:4].lower() == 'tour':
        return 17
    elif name[:4].lower() == 'giro':
        return 13
    elif name[:6].lower() == 'vuelta':
        return 23
    else:
        print("Race niet gevonden, kan niet checken op First Cycling")


def stagename_to_number(name):
    stage =  name.split(':')[0].strip().lower()
    if stage[-2].isnumeric():
        stage_number = stage[-2:]
        print(f"Double digit stage: {stage_number}")
    elif stage[-1].isnumeric():
        stage_number = stage[-1:]
        print(f"Single digit stage: {stage_number}")
    else:
        stage_number = 0
    return stage_number

# assert int(stagename_to_number("Giro d'Italia, Stage 21 : Verona - Verona I.T.T.")) == 21
# assert int(stagename_to_number("Stage 20 : Belluno - Marmolada")) == 20
# assert int(stagename_to_number("21 : Verona - Verona I.T.T.")) == 21
# assert int(stagename_to_number("Giro d'Italia, Stage 1 : Budapest - Visegrad")) == 1

points = process_files.read_csv_file("points.csv")
calendar = process_files.read_csv_file('calendar.csv')
race_categories = process_files.read_csv_file('race_categories.csv')


def get_calendar(year=YEAR, months=[1,2,3,4,5,6,7,8,9,10]):
    races = []
    calendar = [['startdate','enddate','race','race_id','category','points','JPP'],]
    for month in months:
        start_url = "https://firstcycling.com/race.php?y="+str(year)+"&t=2&m="+str(month)
        print(f"Getting calendar for {start_url}")
        page = requests.get(start_url)
        soup = BeautifulSoup(page.content, 'html.parser')
        tables = soup.find_all("table", {"class": "sortTabell"})
        tablerows = tables[-1].find_all('tr')
        for row in tablerows[1:]:
            tds = row.find_all('td')
            # print(tds)
            category = tds[1].text.strip()
            if category not in ['1.2', '2.2', '1.2U', '2.2U','2.NC','RCRR','WCU','WCUT','CCUT','CCU','TTT']:
                if category == '2.Pro':
                    category = '2.PS'
                if category == '1.Pro':
                    category = '1.PS'
                date = tds[0].text.strip()
                startdate, enddate = split_dates(date)
                race = tds[2].text.strip()
                content = tds[2].find('a').get('href').split('=')[1]
                race_id = content.split('&')[0]
                if category in ['1.UWT','2.UWT']:
                    for rc in race_categories[1:]:
                        if rc[1] == race_id:
                            category = rc[2]
                category_points = 0
                category_jpp = 0
                for p in points[1:]:
                    if p[0]==category:
                        category_points += float(p[2])
                        category_jpp += int(p[3])
                if race_id not in races:
                    races.append(race_id)
                    # print(startdate, enddate, race,race_id, category, category_points, category_jpp)
                    calendar.append([startdate, enddate, race, race_id, category, category_points, category_jpp])
        process_files.write_csv_file('calendar.csv', calendar)            


def split_dates(string):
    # if the string has a "-" it means two dates, start- and enddate
    # otherwise it is a one day reace, just a startdate
    if "-" in string:
        dates = string.split("-")
        startdate = return_date(dates[0])
        enddate = return_date(dates[1])
    else:
        startdate = return_date(string)
        enddate = ""
    return startdate, enddate


def return_date(date):
    dates =  date.split(".")
    full_date = str(YEAR) + "-" + dates[1] + "-" + dates[0]
    return full_date


def add_points_to_calendar():
    """
    Open calendar
    Loop over races
    Look up the points per category
    Add those points in the last column
    """
    extended_calendar = []
    for c in calendar[1:]:
        category = c[4]
        if category == '2.Pro':
            category = '2.PS'
        if category == '1.Pro':
            category = '1.PS'
        category_points = 0
        category_jpp = 0
        for p in points[1:]:
            if p[0]==category:
                category_points += float(p[2])
                category_jpp += int(p[3])
        c.append(category_points)
        c.append(category_jpp)
        extended_calendar.append(c)
    process_files.write_csv_file("calendar_points.csv", extended_calendar)
    

def print_worldtour_races():
    for c in calendar[1:]:
        if c[4] in ['1.UWT','2.UWT']:
            print(c[2] +","+ c[3]+","+ c[4])

# print_worldtour_races()

"""
Wanneer trigger je de functie om correcties uit te voeren?
Dat is na de laatste etappe, normaal gesproken na etappe 21. 
Het kan ook op datum.
Door de trigger en de uit te voeren functie te scheiden, kun je die functie ook
los van de trigger uitvoeren.
"""
all_riders = process_files.read_csv_file('all_riders_cqranking_with_fc_rider_id.csv')

def lookup_FC_rider_id(cq_rider_id):
    for rider in all_riders[1:]:
        if len(rider) > 9:
            if rider[2] == cq_rider_id:
                return rider[9]


def add_FC_rider_ids():
    new_list = [['renner_id','renner','rider','ploegleider','kosten','team','nationality','age','punten','JPP','FC_rider_id']]
    sold_riders = process_files.read_csv_file('ploegen.csv')
    for sold_rider in sold_riders[1:]:
        # print(sold_rider)
        fc_rider_id = lookup_FC_rider_id(sold_rider[0])
        # print(fc_rider_id)
        sold_rider.append(fc_rider_id)
        new_list.append([sold_rider])
        process_files.write_csv_file('ploegenplus.csv', new_list)

# add_FC_rider_ids()

def fcid_to_cqid(fc_rider_id):
    for rider in riders[1:]:
        if len(rider) > 9:
            if int(rider[9]) == int(fc_rider_id):
                return rider[2], rider[6]
        else:
            return None
            
# print(fcid_to_cqid(45992) )
