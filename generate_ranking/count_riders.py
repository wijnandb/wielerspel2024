import process_files

"""
To calculate and add the proper amount of points for National Championships, we want to know how many riders
per country have been acquired.
More than 9, more than 4 or more than 0

For each amount, a different category is used to calculate points
"""

riders = process_files.read_csv_file("ploegen.csv")

"""
ploegen.csv
0 - renner_id
1 - rider_name
2 - rider_full_name
3 - teamcaptain
4 - price
5 - team
6 - nationality
7 - age
8 - points
9 - JPP
"""

def get_timetrial(country):
    number_sold = count_riders(country)
    if number_sold > 9:
      return 3
    else:
      return 1


def get_roadrace(country):
    number_sold = count_riders(country)
    if number_sold > 9:
      return 10
    elif number_sold > 4:
      return 3
    else:
      return 1


def count_riders(nationality):
  k = 0
  for j in riders[1:]:
    if j[6] == nationality:
      k +=1
  return k


def change_category_NCRR(country):
    """
    Based on the number of sold riders, I want to change the category in the results.
    So in goed results, find the NC and NCT categories and change them to 
    1.WT3 (9 riders or more)
    1.1 (5 riders or more)
    NC4 (at least 1)
    NC5 (no riders)
    """
    number_sold = count_riders(country)
    if number_sold > 9:
        return '1.WT3'
    elif number_sold > 4:
        return '1.1'
    elif number_sold > 0:
        return 'NC4'
    else:
        return 'NC5'

def change_category_NCTT(country):
    """
    Based on the number of sold riders, I want to change the category in the results.
    So in goed results, find the NCT categories and change them to 
    NCT1 (more than 9 riders)
    NCT3 (more than 4 riders)
    NCT4 (more than 0 riders)
    NCT5 (no riders)
    """
    number_sold = count_riders(country)
    if number_sold > 9:
        return 'NCT1'
    elif number_sold > 4:
        return 'NCT3'
    elif number_sold > 0:
        return 'NCT4'
    else:
        return 'NCT5'
