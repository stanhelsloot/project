# Stan Helsloot, 10762388
# script desgined for transforming csv/txt files to JSON files.
import pandas as pd
import json

INPUT = "../data/data_raw/Gaswinning-totaal-1963-2015-maandelijks.xlsx"
OUTPUT_MONTH = "../data/data_refined/data_months.json"
OUTPUT_YEAR = "../data/data_refined/data_years.json"
OUTPUT_TOT = "../data/data_refined/data_tot.json"


def read_write_file(filename):
    """Method for reading input file"""
    # converting excel file to csv file
    df_xls = pd.read_excel(filename)

    # switch the rows and columns
    df = df_xls.transpose()

    # extract the year from the index and make it into a column
    df["jaar"] = df.index

    # remove rows which are not numbers or are unnamed (these all have a value
    # of 0)
    df = df.loc[df[0].notna()]
    df = df.loc[df[0] != 0]

    # making 2 json files, one contains only yearly data and the other only
    # monthly data
    years = {}
    months = {}
    month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
                 "Oct", "Nov", "Dec"]
    tot = {}
    for i in month:
        tot[i] = 0

    # select, convert and correct data and add them to the dictionaries
    for i in df["jaar"]:
        try:
            if (i.startswith("Jaar")):
                # add a dictionary node with the date/key pair of the year
                spliced = i.split()

                # two mistakes were found in dataset; 1987 is in reality 1978
                # and the first 1999 is 1989 in reality
                if spliced[2] == "1987":
                    spliced[2] = "1978"
                if spliced[2] == "1999":
                    spliced[2] = "1989"

                years[int(float(spliced[2]))] = (df[0][i])

        except Exception:
            # saving the key as year.mo, with mo from 0 to 11/12
            key = i.year + (i.month/120*10 - 1/12)

            # collect the totals of each month
            tot[month[i.month - 1]] += (df[0][i])

            # add a dictionary node with the date/key pair of the monts
            months[key] = (df[0][i])

    with open(OUTPUT_TOT, "w") as outfile:
        json.dump(tot, outfile)

    # writing yearly data in json file
    with open(OUTPUT_YEAR, 'w') as outfile:
        json.dump(years, outfile)

    # writing monthly data in json file
    with open(OUTPUT_MONTH, 'w') as outfile:
        json.dump(months, outfile)


if __name__ == "__main__":
    read_write_file(INPUT)
