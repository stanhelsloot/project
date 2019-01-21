# Scripts
This folder contains all python scripts required for processing the data.
All raw data is saved in data/data_raw and all processed data can be found
in the data/data_refined folder.
- wikiscraper.py is used for scraping a Wikipedia page containing the names
  of all cities in the Netherlands, the output of which is then used in both
  ncconverter.py and stacked_converter.py
- stacked_converter.py is used to convert raw .nc data into amounts of
  earthquakes with a certain magnitude. This data is used for building the
  stacked bar chart.
- ncconverter.py is used for converting the raw .nc data to a dictionary style
  .json file containing data on the location (including coordinates), time
  and magnitude of the earthquakes. This data is used for making the map.
- excelconverter.py is used for converting the extraction data of NAM
  to .json files, one for the monthly total extraction and one for the yearly
  total extraction.
