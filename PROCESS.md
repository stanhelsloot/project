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
# Thursday week 2
- Tooltip for mag.histo show amount of earthquakes in that year + the year itself.
- And when clicked on, show the year with amount of earthquakes of "that"
  magnitude.
- Started with designing the page layout + adding text. Noticed that the amount
  of graphs were difficult to relate without text so a change was made:
  the onclick of gas.histo.year was removed and added to the stacked. The
  original onclick of the stacked was removed and replaced, tried to implement
  the functionality into a mouseover.
# Friday week 2
- Last part of Thursday week 2 seemed harder than expected, therefore changed
  it to being able to select the magnitude by clicking on the correlating
  legend block.
- Started adding text to the other html pages and choosing color schemes etc.
- Made some headway with the layout and the text of the pages but not yet
  satisfied so will continue on that coming Monday.
- Also cleaning up code and data structure coming Monday.
- Question for Monday: d3 titles of charts centering/multiple lines.  
# Monday week 3
- Fixed the data structure
- Finalized the code of the scripts + added readme file.
- Fixed titles and placement
- Made Github pages page!
- Fixed tooltip
- Cleaned up all .js code
# Tuesday week 3
- More was added to the story as a start for extra visualizations.
- Decided to make some extra plots. These plots will be an attempt to show
  whether there is a direct relation between gas extraction and earthquakes.
# Wednesday week 3
- Two extra bar charts regarding the relation between earthquakes and extraction
  were added. These do not yet have any interactions, so an attempt on
  using a dual tooltip will be made (hovering over one of the bars will also
    highlight this bar in the other bar chart)
- A line plot with the accumulative gas extraction and total amount of earth
  quakes was made. To improve on this chart, the tooltip will be mirrored so
  it can be read throughouth the entire plot. Also, the tooltips converge
  on the top right corner so this will be adjusted so they do not overlap
  any longer.
# TD
- Smooth transitions of axis bar_gas_month
- Dual tooltip @ "investigating relations"
- Replace tooltip dynamically in line plot
- set axis titles properly
- Color scheme for all svgs
- set tick thing on bottom axis line plot
- add references bottom map.html page
- make width of svgs column dependable
- code of linegraph, total barcharts
- If any more time left, make checkbox to view all magnitude ranges of quakes
