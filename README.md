research proposal by Stan Helsloot, student number 10762388

From 1911 the KNMI collects seismic data throughout the Netherlands.
Whilst the Netherlands is not located near any tectonic plates, earthquakes,
however small, are still a common occurrence. These earthquakes mainly occur
in the province Groningen where one of the worlds largest gas reserves
was discovered in 1959. Since 1963 this natural gas is being extracted.
Many citizens in Groningen have since been affected by the earthquakes,
which have resulted in structural damage throughout the province.

The earthquakes and its effects are a recurring theme in many news
outlets and debates and many reports claim that there has been an increase
in both seismic power and frequency due to natural gas extraction.
These claims often only address changes in comparison to last year.
The goal of this project is to show the relation (or lack of) between fracking
and seismic activity for people who want evidence for the claims made by
media outlets.

Several notes: before 2015 only earthquakes with a magnitude higher of
1.5 were measurable.

Summary:
Provide a tool to see the relation between the extraction of natural gas
in Dutch gas fields and induced seismic activity in throughout the country.

Main features:
(See picture in the doc folder for sketches)
1)
- A map of the Netherlands on which earthquakes are represented using circles.
  Magnitude determines circle area.
  Slider to change year
- Stacked histogram to clearly show different ranges of magnitudes.
- Histogram of amount of gas extraction. If clicked on certain year,
  show earthquakes of that year in map.
- Information of the seismic data, gas extraction and relation to other years
  in multiple donuts, such as relative strength of average earthquake,
  percentage of total amount of gas won per year, frequency.

2)
- For the map: hovering over the circles to see the date/strength/radius
- Hover over histogram to highlight information in donuts

Data Sources:
KNMI seismic: https://data.knmi.nl/datasets/aardbevingen_catalogus/1?bbox=53.7,7.4,50.6,3.2&dtend=2018-11-24T22:59Z&dtstart=2018-11-17T23:00Z
NAM gas extraction: https://www.nam.nl/feiten-en-cijfers/gaswinning.html#iframe=L2VtYmVkL2NvbXBvbmVudC8/aWQ9Z2Fzd2lubmluZyN0YWItdGFiLWluZm8tOGNkN2RlOGRmMTg4NDU3YTk0NzFhYzVkZGZmMThlMmU=
Wikipedia list of cities/vilages in Netherlands: https://nl.wikipedia.org/wiki/Lijst_van_Nederlandse_plaatsen

external sources: I am not sure on which functionalities I'll require, expect slider, tooltip, pandas.
hardest parts: making animations when clicking on nice.
