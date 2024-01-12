import process_files

teamcaptains = process_files.read_csv_file("teamcaptains.csv")
riders = process_files.read_csv_file("ploegen.csv")

def add_full_name(shortcode):
    """
    We want to display the full names of teamcaptains instead of the shortname.
    We need the short name though, because it acts as a key to the riders (teams).
    Because we need the key in the Liquid files (HTML), we can't replace them but need to add them.
    Since we also want to add the name of a temacaptain to a result, we can add the teamcaptain 
    to the last position of each line. We can only do this if the shortname has already been
    added.
    """
    # read ploegleiders_volledige_naam.csv
    # input is shortcode, output is full_name
    for tc in teamcaptains:
        if tc[0] == shortcode:
            return tc[1]


def add_teamcaptain(infile, outfile=None):
    """
    This looks up a rider from a result, then looks up the corresponding teamcaptain
    and adds the teamcaptain to the result.
    This will be the shortname of the teamcaptain, which functions as the key.

    Changed function so infile gets read, processed and re-written.
    Can also have a different infile and outfile
    """
    results = process_files.read_csv_file(infile)
    # add new column to results
    if results[0][-1] != "ploegleider":
        results[0].append("ploegleider")

    for result in results[1:]:
        result.append("-")
        for rider in riders[1:]:
        # look up the rider in the results
            if int(result[5]) == int(rider[0]):
                # add the shortcode of the teamcaptain
                result[-1]=(rider[3])
                break

    process_files.write_csv_file(infile, results)
    # also store the file in the dynamic folder so Javascript can access it
    process_files.write_csv_file(infile, results, "dynamic/")


def add_teamcaptain_to_startlist(rider_id):
    """
    Look up a rider_id from the "all_riders_cqranking_with_fc_rided_id.csv" file"
    """
    for rider in riders[1:]:
        if rider_id == rider[0]:
            return add_full_name(rider[3]), rider[3], rider[4]
        
    return '-', '-', '-'
