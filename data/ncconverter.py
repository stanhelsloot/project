import pandas as pd
import netCDF4
import re
import csv
import json

NCFILE = "data.nc"
CITIES = "cities.csv"
OUTPUT_JSON = "data.json"

def converter(filename):
    """Function designed for the conversion of .nc files to csv/json files
    Extracts vital data and stores it in a pandas dataframe.
    filename = string"""
    df = netCDF4.Dataset(filename, format="NETCDF4")

    # event type gives insight on the type of earthquake (1 = induced)
    event_type = (df.variables["event_type"][:])
    id = (df.variables["id"][:])
    time = (df.variables["time"][:])
    lat = (df.variables["lat"][:])
    lon = (df.variables["lon"][:])
    magnitude = (df.variables["magnitude"][:])
    location = (df.variables["location"][:])

    # open csv file
    with open(CITIES, 'r') as cities:
        location_groningen = []
        reader = csv.reader(cities)
        for row in reader:
            if row in location:
                location_groningen.append(row[0])

    time_date = []
    for i in range(len(time)):
        g = (time[i] - 2208988800)
        # g = (time[i])
        t = str((pd.to_datetime(g, unit="s")))
        t_digits = (re.findall(r"\d", t))
        t_str = "".join(t_digits[0 : 4])
        time_date.append(t_str)

    # print(time_date)
    dataset = pd.DataFrame({"id": id, "time": time_date, "location": location, "lat": lat, "lon": lon, "magnitude": magnitude, "event_type": event_type})
    # select data on induced earthquakes
    dataset = dataset.loc[dataset['event_type'] == 1]
    # select (only dutch) cities
    dataset = dataset.loc[dataset["location"].isin(location_groningen)]
    # drop event_type column
    dataset = dataset.drop(columns=["event_type"])

    # convert dataset to dictionary to be able to remove the index
    dict = dataset.to_dict(orient="split")
    # removing index
    dict.pop("index")
    # write json file
    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(dict, outfile)


if __name__ == '__main__':
    converter(NCFILE)
