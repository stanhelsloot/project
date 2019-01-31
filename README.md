# Visualization of induced earthquakes in the Netherlands.
Minor programming UVA

# Problem Statement
In the pas decades the amount of earthquakes as a result of gas extraction
in Dutch gas fields has increased significantly, resulting in an increase
in the damages to properties located around the gas fields. Various news
outlets have indicated a severe increase of earthquakes, often without
showing actual numbers.

# Solution
To provide more insight on the matter, I have made a website containing
several visualizations which show the amount of gas that has been extracted,
the location and frequency of earthquakes and the relation between the two.
https://stanhelsloot.github.io/project/web/html/index.html

# Contents of the page
Home:
This page shows some general information of myself and has a nice picture
on display.

![](https://github.com/stanhelsloot/project/blob/master/doc/screenshots/home.png)

Visualization:
This part of the page contains the visualizations and the story. There are 4 main
parts of the page. The first part (Extraction) contains 2 visualizations about the gas extraction,
which are interactive by a click on the right chart or using the slider bar.
The second part contains the processed data on the earthquakes (Earthquakes)
and is also interactive by clicking on the bars and using the slider.
The third part (Investigating Relations) contains information on the direct relation
between gas extraction and the occurrence of earthquakes. The two plots are
interactive by spanning two tooltip banners.
The final part (Conclusion) describes total accumulative earthquakes/gas extraction
and can be altered by clicking on the checkboxes.
Furthermore, all visualizations contain an "info" button which shows additional
info on the usage.

![](https://github.com/stanhelsloot/project/blob/master/doc/screenshots/map.png)

About:
The final page contains all links to plugins, APIs and the data plus some additonal
info on my contact information.

![](https://github.com/stanhelsloot/project/blob/master/doc/screenshots/about.png)

# Data
- Data on earthquakes was taken from the KNMI: https://data.knmi.nl/datasets/aardbevingen_catalogus/1?bbox=53.7,7.4,50.6,3.2&dtend=2018-11-24T22:59Z&dtstart=2018-11-17T23:00Z
- Data on gas extraction was taken from NAM: https://www.nam.nl/feiten-en-cijfers/gaswinning.html#iframe=L2VtYmVkL2NvbXBvbmVudC8/aWQ9Z2Fzd2lubmluZyN0YWItdGFiLWluZm8tOGNkN2RlOGRmMTg4NDU3YTk0NzFhYzVkZGZmMThlMmU=
- Data on Dutch place names was taken from Wikipedia: https://nl.wikipedia.org/wiki/Lijst_van_Nederlandse_plaatsen

# External sources
- D3: library License: BSD 3-Clause "New" or "Revised" License, Source: https://github.com/d3/d3
- Pandas: License: BSD 3-Clause "New" or "Revised" License, Source: https://github.com/pandas-dev/pandas
- jQuery: License: MIT License, Source: https://github.com/jquery/jquery
- Bootstrap: License: MIT license, Source: https://getbootstrap.com
- Popper: License: MIT license, Code and documentation copyright 2016 Federico Zivolo, Source: https://popper.js.org/
- D3 slider: BSD 3-Clause "New" or "Revised", Copyright 2017-2018 John Walley Source: https://github.com/johnwalley/d3-simple-slider
- Font Awesome: License: MIT license, Source: https://origin.fontawesome.com/
- D3 tooltip: License: MIT license, Copyright (c) 2013 Justin Palmer, Source: https://github.com/Caged/d3-tip

# Image source
https://dutchreview.com/wp-content/uploads/GasGroningen-1.jpg

# Link to demo
https://www.youtube.com/watch?v=ieikPk1lP2o&feature=youtu.be

# Author
Made by Stan Helsloot
Student number 10762388
https://github.com/stanhelsloot

# License
Copyright © 2019, Stan Helsloot. Released under the MIT License.
