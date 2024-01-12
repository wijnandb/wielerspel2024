import csv
from decimal import *


def read_csv_file(filename,directory="_data/"):
    """
    Function to read CSV files, being called from (by) other functions
    WIP: Directory is hardcoded in function!!
    """
    file = str(directory)+str(filename)
    with open(file, newline='') as f:
        readresults = csv.reader(f)
        csvlist = list(readresults)
    return csvlist


def write_csv_file(filename, results,directory="_data/"):
    """
    Function to write CSV files, being called from (by) other functions
    WIP: Directory is hardcoded in function!!
    """
    file = str(directory)+str(filename)
    with open(file, 'w', newline='') as f:
        write = csv.writer(f)
        write.writerows(results)


def write_row_in_HTML_table(row):
    start = "<tr>"
    for value in row:
        start.append("<td>"+str(value)+"</td>")
    start.append("</tr>")
    return start



