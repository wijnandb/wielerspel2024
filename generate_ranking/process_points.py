from decimal import *
import process_files, count_riders, jackpot

def add_points_to_results(input, output):
    """
    Add points to results, both for all_results as well as for new_results.
    If you change order or number of columns, only have to adjust it here
    """
    points = process_files.read_csv_file('points.csv')
    results = process_files.read_csv_file(input)

    for result in results[1:]: # skip the header row
        for point in points[1:]:
            if (int(result[0]) == int(point[1])) and (result[1] == point[0]):
                result[6] = Decimal(point[2])
                result[7] = int(point[3])
        #print(result)
    """
    Instead of writing the results to a file, I can also return the list with results to further process
    """
    process_files.write_csv_file(output, results)
    return True


def calculate_jpp(ranking, jackpot):
    """
    Look up the JPP for all team_captains.
    Determine who has the most points, second most points, etc.
    Grant the number of points to the team captain.
    Add them to the ranking
    """
    print(ranking, jackpot, jackpot[0])
    # open the jackpot distribution from jpp.csv
    jpp_bonus = process_files.read_csv_file('jpp.csv')
    # order ranking by JPP descending
    ranking.sort(key=lambda x: int(x[4]), reverse=True)
    for i in range (len(ranking)):
        ranking[i][5] = Decimal(jpp_bonus[i][1]) * Decimal(jackpot[0])
        ranking[i][6] = Decimal(ranking[i][3]) + Decimal(ranking[i][5])

    # ranking = redistribute_jpp_equals(ranking, jackpot)
    ranking.sort(key=lambda x: x[3], reverse=True)
    ranking[-1][-2] += Decimal(0.03) * Decimal(jackpot[0])
    ranking.sort(key=lambda x: x[3], reverse=True)
    ranking = redistribute_jpp_equals(ranking, jackpot[0])
    for i in range(len(ranking)):
        ranking[i][5] = round(ranking[i][5], 2)
        ranking[i][6] = round(ranking[i][6], 2)
    return ranking


def redistribute_jpp_equals(data, jackpot):
    jpp_values = [int(row[4]) for row in data[:]]  # Extract JPP values as integers
    jpp_counts = {value: jpp_values.count(value) for value in jpp_values if jpp_values.count(value) > 1}  # Count occurrences of each JPP value

    bonus_map = {}

    for row in data:
        jpp = int(row[4])
        if jpp in jpp_counts:
            if jpp not in bonus_map:
                jpp_bonus_sum = sum([Decimal(r[5]) for r in data if int(r[4]) == jpp])
                jpp_bonus_avg = jpp_bonus_sum / jpp_counts[jpp]
                bonus_map[jpp] = round(jpp_bonus_avg, 2)
            row[5] = str(bonus_map[jpp])
            row[6] = str(Decimal(row[3]) + Decimal(row[5]))

    total_bonus = round(sum([Decimal(row[5]) for row in data]),3)
    bonus_correct = total_bonus == round(Decimal(jackpot),3)

    if bonus_correct:
        print(f"Total bonus is still { jackpot }!")
    else:
        print(bonus_correct, "Bonus is now:", total_bonus, "Should be ", jackpot)

    return data

# print(get_jackpot())