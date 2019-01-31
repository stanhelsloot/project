# Intro
The website I have made here was build with the intention of informing
users on gas extraction and induced earthquakes in the Netherlands.
![](https://github.com/stanhelsloot/project/blob/master/doc/screenshots/map.png)

The purpose of each chapter is to tell a part of the story. The text of each
paragraph adds to the information in the visualizations, which are interactive
with one another.

# Functionalities and Implementation
The first two visualizations represent data from the same
source; one on the yearly totals of gas extraction and one on the monthly totals.
They are interactive by clicking on the bars of the yearly chart. When clicking
on one of the bars, the monthly chart is updated by selecting a different year.
This is done by the respective update function, which, when a year is given,
selects the required data from a global variable. Then it changes the data
of the bars, calculating a new "height" and "y" for the bars. It also updates
the title of the graph, displaying the chosen year and updates the scaling of
the yAxis.
Besides the update function, both histograms are very similar. They both have
a data processing element at the start, calculating the maximum values for use
in the scaling, as well as organizing the data in a easy-to-read format for
the production of the bars. They also both employ the same way of appending
the axii and the same tooltip.
The monthly chart also employs a slider, which is made using the d3-simple slider
plugin. It functions similar to the update function.

Next up are the visualizations of the earthquakes, which are again interactive
by clicking on the bars in the right chart. These two plots differ more extensively,
foremost by being a totally different type of visualization.
The stacked bar chart has several important components, such as the axis, the bars
and the legend.
The bars are made by inputting data into a group based on their magnitude,
followed by the making of the rectangles per magnitude. This results in several
groups embedded in one another which might be confusing at first, but they employ
the same way of being made throughout the process. Every layer of data (each
  magnitude) was given the accumulative amount of data from its predecessors
  (always starting at 0 for the first layer, then the amount of the first layer,
    then the amount of the first and second layer and so on).
Due to some design difficulties (I will elaborate later) every bar had the same
on-click function, namely that it would be the selector for the year in the map chart.
The legend was made by making colored squares with different values, so you could
click on them to update the map to show earthquakes within a certain range.
The axii were made the same way as in the histograms.

The map was made by using the d3 geoMercator functionality, allow to plot a
map using coordinates (in this case the Netherlands). By centering the map it allowed for
easy enlargement. The provinces of the Netherlands are then drawn.
The circles on the map are drawn after this. Every circles radius depends
on the magnitude and the epicenter uses the same system as drawing the maps
(coordinate system).
The map contains two functions which both use the same update function for the
circles. One works by inputting the year, after which it selects the correct data
and removes the old circles with a transition, followed by a wait time (otherwise
  the new circles would also be removed). After waiting the circles are drawn
  anew but with new radii and centers.
The second function requires both the years and the magnitude range, the former
is a globally saved variable, the latter being inputted by the click. The difference
between the previous function is that the processing of the data is slightly different.

After this we have two more histograms, displaying the monthly data in the
entire measuring period. They differ only in the data used and both consist
of a function drawing the bars, similar to the previously made histograms, and
a function for a secondary tooltip banner. The mouseover functions of all bars
have an extra set of functions; one for spanning the banner in the other
svg file and one for removing it. The extra banners are made with a rectangle,
a polygon (triangle) and text. Every line of text requires its own separate
block, otherwise they will be added on one line.

Last up is the line graph and it is by far the longest document. It starts out
by making preprocessing the data, followed by the creation of scales and
appending of x and two y axis. After this it calculates the formulae for
drawing the paths, which are then drawn for two of the six possible lines.
It also contains a rectangle which is placed over the graph. It is responsible for all the tooltip functionalities. The tooltip works by choosing the nearest point
from the actual tooltip converted to a value, to a value in the actual dataset.
Furthermore, it appends a tipbox to the right of the figure which height is depending on the amount of data it requires to display.
After the tooltip come the checkboxes, which are vital for updating this visualization. Every checkbox has to be made separately (I tried making them in loops but that did not work).
Unfortunately, this results in a lot of extra code in the document. The
checkboxes are made by adding a foreignObject, allowing us to directly import
html objects into the svg (such as checkboxes). After making the checkboxes,
a function is made for each box to check whether it is checked or not. The bools
are required for easy checking of the status of the boxes. Thereafter a legend
is made in the same way as with the stacked bar chart, but this time without
the on-click functionality.
The update function for the line graph is rather straight forward; when a box
is checked, a new line is drawn.
The function for displaying information in the tooltip is much less straightforward. When hovering over the plot, the nearest data point is chosen. Circles are appended
depending on the bools of their respective checkboxes and their values. Text is then
positioned depending on the amount of text that precedes it.

Some notes on the preprocessing of the data:
The data was processed differently for the different types of charts.
Also, the NC-file of the KNMI contained many earthquakes originating
in Germany and Belgium. Therefore, a list of places was scraped form Wikipedia
to select only domestically originating induced earthquakes.

# Challenges & Design Choices

Understanding the code. I had a hard time using Javascript and understanding
D3 before I started this course. Many of my entries into the PROCESS were
related to not understanding the code.

A mayor change of the design was done in week 2. During this week I decided
on the actual look I wanted my page to have, choosing a route where I used
more text instead of just the visualizations to present my data. By doing so
some of the interactions had to be skipped because they would not be as
visible as first thought.

During week 2 I added the stacked bar chart. My first plan was to select the
magnitude ranges depending on the part of the bar which was selected. This
did not feel right because I felt in doing so, it would reduce the flexibility
of showing the data of an entire year. In hindsight, I should have still done
so after the slider underneath the map was added.

Another challenge was properly figuring out how to display more data after finalizing the
fist four visualizations, with which I was done on the Monday of week 3.

In week 3 I felt the need for more visualizations and had the idea of using
a dual tooltip because it seemed like a really challenging thing to do
This forced me to dive deeper into the D3-tooltip code and
showing me that an actual mouse needed to be present for that. To circumvent
this problem I made a very close replica, which was challenging by itself.
It did however give me a lot of insight into Javascript and D3.

Extra problems showed itself when working on the line plot. I wanted to
have an identical layout throughout the entire webpage, however, using fake
tooltips for this visualization caused severe overlap of the boxes, resulting in
limited readability. To import on this, I decided to make an extra box outside
of the plot for easily displaying the data. The checkboxes for the line plot
were also rather difficult because I wanted to do it in Javascript/d3 instead
of HTML. Unfortunately, the code for adding checkboxes did not allow looping,
resulting in large pieces of very similar code.

In my first sketch I was planning on making the map one of the most prominent
aspects of my page. Whilst designing I felt that it did not add enough value
to the story, and therefore it was sized down to match the other figures.
My initial plan deviates from the actual product mainly in the amount of interactions and the location of the plots.

# Defending my design choices

The first plan was to make a very intricate system of interactions but my main
problem with this approach was a severe lack of readability of the page, meaning
that you had to scroll to see the changes made by the interaction. This was mostly
a problem with the mouseover functionalities. To make it even more readable I
added some text to go with each visualization for a more cohesive story and
webpage in general. In my opinion, this gives much more value to the page. It
does not feel like the visualizations are a secondary element of the page, in fact,
I believe it makes them more clear and their design more justified.
