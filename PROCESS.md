# Wednesday week 1
- Decided to use both monthly and yearly barcharts for better interaction
  between the different visualizations.
- Finished preprocessing and included some extra parts in the json files.
# Thursday week 1
- Changed layout of website to include more pages (3 in total) to separate
  part of the text and the visualizations (things like personal info, locations
    data etc.)
- Started combining .js files in the map.html file. Was an enourmous challange due
  to limited knowledge of javascript. and started working on
  the first interaction.
# Friday week 1
- Worked on making functions and variables more global so they could be used in
  various functions; was more of an obstacle then expected.
- Worked on interaction between bar graphs
- Ran into problems with using the yScale functions resulting in the barchart not
  properly updating
# Monday week 2
- Fixed interaction between bar_year and bar_month! Can now click on a year to display
  the monthly gas extraction.
- Started working on adding epicenters into the mix.
- And it works! clicking on a year in the year bar chart displays the bar stuff
  and the map stuff. A wait time was implemented to make sure all circles were
  removed (which also uses transitions (looks better)) but this looks a tad
  too slow.
# Tuesday week 2
- Discovered the stacked bar chart requires the data in a different format,
  so a new file (stacked_data.json) was made using the stacked_converter.py
  script. Stacked data was made. Having doubts on doing monthly earthquake data
  due to limited amount of sample (maybe for a select time window??)
# Wednesday week 2
- For the tooltips (which all have to be made still):
  - Hovering over a certain magnitude part in the mag.histogram should high-
    light all earthquakes with that magnitude.
  - Hovering over bars in gas.histo should display numeric values (year, ###).
  - Hovering over earthquakes should display magnitude, location, date.
  - When clicking on a year in gas.histo, if no earthquakes, should tell.
- Lo and behold the tooltips (exept for mag.histogram, cause it be done with
  a click in the legend/dropdown menu).
- Started on legends for all the figures
- Dropped the monthly stacked histogram idea because it does not feel like
  it adds any value to the current visualizations.
