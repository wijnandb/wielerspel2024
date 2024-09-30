from decimal import *
import process_files

def get_jackpot():
    """
    Calculate the jackpot by adding up points earned by riders who have not been sold
    """
    print("getting jackpot")
    results = process_files.read_csv_file('results_with_points.csv')
    jackpot_points = 0
    for result in results[1:]:
        if result[9] == '-':
            jackpot_points += Decimal(result[6])
    jackpot = Decimal(str(jackpot_points)) * Decimal(0.25)
    lines =[['hoogte'], [jackpot]]
    process_files.write_csv_file("jackpot.csv", lines)
    return lines[1]