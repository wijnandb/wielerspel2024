# open the file "_data/results_with_points.csv" and filter out all races with category NCT* and NC*
# then create a new file "_data/national_champions.csv" with the results of the national champions

import csv, process_files

results = process_files.read_csv_file("results_with_points.csv")
results = sorted(results, key=lambda x: x[6], reverse=True)
teamcaptains = process_files.read_csv_file("teamcaptains.csv")
riders = process_files.read_csv_file("ploegen.csv")

def get_all_NC_results():
    for r in results:
        if (r[1].startswith("NCT") or r[1].startswith("NC")) and r[9] != "-":
            yield r

for result in get_all_NC_results():
    print(result)
