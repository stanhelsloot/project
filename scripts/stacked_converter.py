# Stan Helsloot, 10762388
# script for converting NC data to data for use in stacked bar chart
import pandas as pd
import netCDF4
import re
import csv
import json

NCFILE = "../data/data_raw/data.nc"
CITIES = "../data/data_raw/cities.csv"
OUTPUT_JSON = "../data/data_refined/stacked_data.json"
UNIX_BASE = 2208988800
YEAR_INITIAL = 1986
YEAR_FINAL = 2019


def converter(filename):
    """Function designed for the conversion of .nc files to csv/json files
    Extracts vital data and stores it in a pandas dataframe and finaly converts
    this data to a set of arrays ready for use in JSON format.
    filename = string"""

    df = netCDF4.Dataset(filename, format="NETCDF4")

    # select the data from the nc file
    event_type = (df.variables["event_type"][:])
    time = (df.variables["time"][:])
    magnitude = (df.variables["magnitude"][:])
    location = (df.variables["location"][:])

    # open csv file made by wikiscraper.py
    with open(CITIES, 'r') as cities:
        location_netherlands = []
        reader = csv.reader(cities)
        # gather data and append it to array for easy use for conversion
        for row in reader:
            if row in location:
                location_netherlands.append(row[0])

    # convert the time from unix time to year-mo-day and to year only
    year = []
    for i in range(len(time)):
        # correct the time to fit from 1900-01-01 instead of 1970-01-01
        seconds_corrected = (time[i] - UNIX_BASE)

        # convert the seconds to an actual datatime timestamp
        time_raw = str((pd.to_datetime(seconds_corrected, unit="s")))

        # select all digitst from the raw datetime format
        time_digits = (re.findall(r"\d", time_raw))

        # select the year (first 4 digits)
        time_str = "".join(time_digits[0: 4])

        # append the cleaned data to the corresponding arrays
        year.append(time_str)

    # put all data into a dataframe for easy cleaning and selection
    dataset = pd.DataFrame({"year": year, "location": location,
                            "magnitude": magnitude, "event_type":
                            event_type})

    # select data on induced earthquakes and drop the row afterwards
    dataset = dataset.loc[dataset['event_type'] == 1]
    dataset = dataset.drop(columns=["event_type"])

    # select (only dutch) cities
    dataset = dataset.loc[dataset["location"].isin(location_netherlands)]

    # select all events with a magnitude north of 1.5 on the Richter scale
    dataset = dataset.loc[dataset["magnitude"] > 1.5]

    # create dict to which to add: keys as years, amount of earthquakes per mag
    data = []
    for year in range(YEAR_INITIAL, YEAR_FINAL):
        # select all years
        dataset_year = dataset.loc[dataset["year"] == str(year)]

        # select data based on magnitude range with steps of 0.5
        d15 = dataset_year.loc[dataset["magnitude"] < 2.0]
        d20 = dataset_year.loc[(dataset["magnitude"] > 2.0) &
                               (dataset["magnitude"] < 2.5)]
        d25 = dataset_year.loc[(dataset["magnitude"] > 2.5) &
                               (dataset["magnitude"] < 3.0)]
        d30 = dataset_year.loc[dataset["magnitude"] > 3.0]

        # for each year, set data as [year, amount of earthquakes in mag.range,
        # total amount of earthquakes in its own category + all preceding]
        data.append([[year, d15.shape[0], "1.5", d15.shape[0]],
                     [year, d20.shape[0], "2.0", d20.shape[0] + d15.shape[0]],
                     [year, d25.shape[0], "2.5", d25.shape[0] + d15.shape[0] +
                     d20.shape[0]], [year, d30.shape[0], "3.0", d30.shape[0] +
                     d15.shape[0] + d20.shape[0] + d25.shape[0]]])

    # write json file
    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(data, outfile)


if __name__ == '__main__':
    converter(NCFILE)
