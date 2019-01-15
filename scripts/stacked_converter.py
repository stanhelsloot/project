# Stan Helsloot, 10762388
import pandas as pd
import netCDF4
import re
import csv
import json

NCFILE = "data.nc"
CITIES = "cities.csv"
OUTPUT_JSON = "stacked_data.json"

def converter(filename):
    """Function designed for the conversion of .nc files to csv/json files
    Extracts vital data and stores it in a pandas dataframe.
    filename = string"""
    df = netCDF4.Dataset(filename, format="NETCDF4")

    # event type gives insight on the type of earthquake (1 = induced)
    event_type = (df.variables["event_type"][:])
    # id = (df.variables["id"][:])
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
    dataset = pd.DataFrame({"time": time_date, "location": location, "lon": lon, "lat": lat, "magnitude": magnitude, "event_type": event_type})
    # select data on induced earthquakes
    dataset = dataset.loc[dataset['event_type'] == 1]
    # select (only dutch) cities
    dataset = dataset.loc[dataset["location"].isin(location_groningen)]
    # select all events with a magnitude north of 1.5 on the Richter scale
    dataset = dataset.loc[dataset["magnitude"] > 1.5]
    # drop event_type column
    dataset = dataset.drop(columns=["event_type"])

    # create dict to which to add: keys as years, amount of earthquakes per mag.
    data = {}
    for year in range(1986, 2019):
        dataset_year = dataset.loc[dataset["time"] == str(year)]
        dataset_year_15 = dataset_year.loc[dataset["magnitude"] < 2.0]
        dataset_year_20 = dataset_year.loc[(dataset["magnitude"] > 2.0) & (dataset["magnitude"] < 2.5)]
        dataset_year_25 = dataset_year.loc[(dataset["magnitude"] > 2.5) & (dataset["magnitude"] < 3.0)]
        dataset_year_30 = dataset_year.loc[dataset["magnitude"] > 3.0]
        data[year] = {"1.5": dataset_year_15.shape[0], "2.0": dataset_year_20.shape[0] , "2.5": dataset_year_25.shape[0] , "3.0":dataset_year_30.shape[0] }

    # print(data[2011])

    # ready = json.dumps(data, )

    # # convert dataset to dictionary to be able to remove the index
    # dict = dataset.to_dict(orient="split")
    # # removing index
    # dict.pop("index")
    # # write json file
    with open(OUTPUT_JSON, 'w') as outfile:
        json.dump(data, outfile)


if __name__ == '__main__':
    converter(NCFILE)
