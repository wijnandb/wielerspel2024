import process_files, change_category
races = process_files.read_csv_file("all_results.csv")

for race in races:
    # race[1] is category,
    # race[2] is racename
    race[1] = change_category.new_category(race[2],race[1])

process_files.write_csv_file('all_results.csv', races)
