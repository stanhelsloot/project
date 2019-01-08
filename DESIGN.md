<!-- Stan Helsloot, 10762388  -->
List of sources:

As stated in the README the following sources will be used:
Data Sources:
KNMI seismic: https://data.knmi.nl/datasets/aardbevingen_catalogus/1?bbox=53.7,7.4,50.6,3.2&dtend=2018-11-24T22:59Z&dtstart=2018-11-17T23:00Z
NAM gas extraction: https://www.nam.nl/feiten-en-cijfers/gaswinning.html#iframe=L2VtYmVkL2NvbXBvbmVudC8/aWQ9Z2Fzd2lubmluZyN0YWItdGFiLWluZm8tOGNkN2RlOGRmMTg4NDU3YTk0NzFhYzVkZGZmMThlMmU=
Wikipedia list of cities/villages in Netherlands: https://nl.wikipedia.org/wiki/Lijst_van_Nederlandse_plaatsen

The list from Wikipedia was scraped using the wikiscraper.py script in the
scripts file. The names of the places were saved to a .csv file in the scripts
folder.

The data from the earthquakes was provided by the KNMI in an ncdf4 format.
The data was extracted using the ncconverter.py script in the scripts folder.
Data was selected based on the type of earthquake and the location. Only induced
earthquakes originating from within the Netherlands were selected. The final
product was an .json file, data.json, which was added to the maps folder.

The data of the gas extraction was provided by NAM. This dataset contained
both the monthly and yearly totals of gas extraction. Two json
files were made using this data with excelconverter.py; one
containing the yearly data of total gas extracted, the other the
monthly total of extracted gas. Both files were added to the maps folder.
