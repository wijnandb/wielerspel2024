"""
Processing consists of several steps:

- add points to results

- add up points per rider

- add up points per teamcaptain

- sort teamcaptains by points and JPP
"""
import operator
from decimal import *
import process_files
import process_points, jackpot, earnings
import add_teamcaptains
# from datetime import datetime
"""
results.csv
0 - rank
1 - category
2 - racename
3 - race_id
4 - rider_name
5 - rider_rider_id
6 - points
7 - JPP
"""

"""
points.csv:
0 - racecategory
1 - ranking
2 - points
3 - jpp
"""

teamcaptains = process_files.read_csv_file("teamcaptains.csv")

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

def add_up_points_per_rider():
    riders = process_files.read_csv_file("ploegen.csv")
    results = process_files.read_csv_file("results_with_points.csv")

    for rider in riders[1:]:
        points = 0
        JPP = 0
        for result in results[1:]:
            if rider[0] == result[5]:
                points += Decimal(result[6])
                JPP += int(result[7])
        rider[8] = Decimal(points)
        rider[9] = int(JPP)
    
    # store the riders with points in a CSV
    # or progress to the next step, adding up points per teamcaptain
    process_files.write_csv_file("riders_with_points.csv", riders)
    # also store the file in the dynamic folder so Javascript can access it
    process_files.write_csv_file("riders_with_points.csv", riders,"dynamic/")
    add_up_points_per_teamcaptain(riders)


def add_up_points_per_teamcaptain(riders):
    # riders = read_csv_file("ploegen.csv")
    ranking = []
    #teamcaptains = get_teamcaptains(riders)
    for teamcaptain in teamcaptains[1:]:
        # put the header row in each teamcaptain's csv file
        team = [riders[0]]
        points = 0
        JPP = 0
        # print(teamcaptain)
        for rider in riders:
            if rider[3] == teamcaptain[0]:
                # add to teamcaptain.csv
                team.append([int(rider[0]),rider[1],rider[2],rider[3],int(rider[4]),rider[5],rider[6],rider[7],Decimal(rider[8]),int(rider[9])])
                # print(team)
                points += Decimal(rider[8])
                JPP += int(rider[9])
        process_files.write_csv_file("ploegleiders/"+teamcaptain[0].lower()+".csv", team)
        ranking.append([teamcaptain[0],teamcaptain[1], Decimal(points),int(JPP)])

    ranking = sorted(ranking, key=operator.itemgetter(2, 3), reverse=True)
    # append headers, 
    # add rank, with i for len(ranking)
    ranking_with_rank = [['positie','short','ploegleider','punten','JPP','bonus','totaal','verdiend']]
    for i in range(len(ranking)):
        ranking_with_rank.append([i+1, ranking[i][0], ranking[i][1], ranking[i][2],ranking[i][3],0,0,0])

    jackpot = process_files.read_csv_file("jackpot.csv")
    ranking_with_rank[1:] = process_points.calculate_jpp(ranking_with_rank[1:], jackpot[1])

    process_files.write_csv_file("ranking.csv", ranking_with_rank)
    # add bonus based on JPP won
    # process_points.calculate_jpp()
    earnings.win_or_lose()
    


points = process_files.read_csv_file('points.csv')
results = process_files.read_csv_file('all_results.csv')
new_results = process_files.read_csv_file('latest_results.csv')
# process_points.add_points_to_results("all_results.csv", "results_with_points.csv")
# process_points.add_points_to_results("latest_results.csv", "latest_results_with_points.csv")

if process_points.add_points_to_results("all_results.csv", "results_with_points.csv"):
    if process_points.add_points_to_results("latest_results.csv", "latest_results_with_points.csv"):
        # print("Added points and JPP to results")
        # here is the place where we should add the teamcaptain to the results
        # print("Adding teamcaptains to results")
        add_teamcaptains.add_teamcaptain("results_with_points.csv")
        add_teamcaptains.add_teamcaptain("latest_results_with_points.csv")
        # Now I can reward the JPP points
        jackpot = jackpot.get_jackpot()
        add_up_points_per_rider()
