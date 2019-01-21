# Stan Helsloot, 10762388
# script for converting NC data of magnitudes to JSON data
import pandas as pd
import netCDF4
import re
import csv
import json

NCFILE = "../data/data_raw/data.nc"
CITIES = "../data/data_raw/cities.csv"
OUTPUT_JSON = "../data/data_refined/data.json"


def converter(filename):
    """Function designed for the conversion of .nc files to csv/json files
    Extracts vital data and stores it in a pandas dataframe.
    filename = string"""

    df = netCDF4.Dataset(filename, format="NETCDF4")

    # select the data from the nc file
    event_type = (df.variables["event_type"][:])
    time = (df.variables["time"][:])
    lat = (df.variables["lat"][:])
    lon = (df.variables["lon"][:])
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
    time_date = []
    for i in range(len(time)):
        # correct the time to fit from 1900-01-01 instead of 1970-01-01
        seconds_corrected = (time[i] - 2208988800)

        # convert the seconds to an actual datatime timestamp
        time_raw = str((pd.to_datetime(seconds_corrected, unit="s")))
        split_raw = time_raw.split()

        # select all digitst from the raw datetime format
        time_digits = (re.findall(r"\d", time_raw))

        # select the year (first 4 digits)
        time_str = "".join(time_digits[0: 4])

        # append the cleaned data to the corresponding arrays
        year.append(time_str)
        time_date.append(split_raw[0])

    # put all data into a dataframe for easy cleaning and selection
    dataset = pd.DataFrame({"year": year, "location": location, "lon": lon,
                            "lat": lat, "magnitude": magnitude, "event_type":
                            event_type, "time_data": time_date})

    # select data on induced earthquakes and drop the row afterwards
    dataset = dataset.loc[dataset['event_type'] == 1]
    dataset = dataset.drop(columns=["event_type"])

    # select (only dutch) cities
    dataset = dataset.loc[dataset["location"].isin(location_netherlands)]

    # select all events with a magnitude north of 1.5 on the Richter scale
    dataset = dataset.loc[dataset["magnitude"] > 1.5]

    # convert dataset to dictionary to be able to remove the index
    dict = dataset.to_dict(orient="split")
    # removing index
    dict.pop("index")
    # write json file
    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(dict, outfile)


if __name__ == '__main__':
    converter(NCFILE)
