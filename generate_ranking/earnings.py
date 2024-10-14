import process_files


def win_or_lose():
    ranking = process_files.read_csv_file('ranking.csv')
    # the columns [0] and [4] are integers, [1] and [2] are strings, the others are floats
    # they are all stored as strings, convert the integers and floats
    for row in ranking[1:]:
        row[0] = int(row[0])
        row[4] = int(row[4])
        row[3] = float(row[3])
        row[5] = float(row[5])
        row[6] = float(row[6])

    total_points = sum([row[6] for row in ranking[1:]])
    average = total_points / 14
    print("The average score is", average)
    for row in ranking[1:]:
        row[7] = float(round((float(row[6]) - average) / 2, 2))

    # order the ranking by the last column
    ranking[1:].sort(key=lambda x: x[6], reverse=True)
    process_files.write_csv_file('ranking.csv', ranking)

