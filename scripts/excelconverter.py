# Stan Helsloot, 10762388
# program desgined for transforming csv/txt files to JSON files.
import pandas as pd
import json
import xlrd

INPUT = "Gaswinning-totaal-1963-2015-maandelijks.xlsx"

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
    # print(df["jaar"])

    years = {}
    months = {}

    for i in df["jaar"]:
        try:
            if (i.startswith("Jaar")):
                # add a dictionary node with the date/key pair of the year
                spliced = i.split()
                # print(spliced[2])
                years[int(float(spliced[2]))] = (df[0][i])
        except Exception as e:
            key = i.year + i.month/100
            # add a dictionary node with the date/key pair of the monts
            months[key] = (df[0][i])

    with open('data_years.json', 'w') as outfile:
        json.dump(years, outfile)

    with open('data_months.json', 'w') as outfile:
        json.dump(months, outfile)


if __name__ == "__main__":
    read_write_file(INPUT)
