# Name: Stan Helsloot
# Student number: 10762388
# script for scraping wikipedia page
"""Most of the code of this script was taken from my "moviescraper.py". Part
of this code was provided as part of the assignment of week 1.
This script makes a new csv file (cities.csv), containing the names of
all cities in the Netherlands"""

import csv
import re
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://nl.wikipedia.org/wiki/Lijst_van_Nederlandse_plaatsen"
BACKUP_HTML = '../data/data_raw/cities.html'
OUTPUT_CSV = '../data/data_raw/cities.csv'


def extract_movies(dom):
    """
    Extracts a list of cities and villages in Groningen
    dom = dom representation
    return = list
    """
    # select all links of the page and append their names to a list
    name_list = []
    for link in dom.find_all("a"):
        name = link.get_text()
        name_list.append(name)

    # make list of fronting and trailing useless link names, using a flag
    temp_list = []
    flag = True

    for i in name_list:
        # turn of flag if usefull information is reached
        if i == "Aadorp":
            flag = False

        # set flag to remove trailing information
        if i == "Zwolle (Gelderland)":
            flag = True

        # append useless information
        if flag:
            temp_list.append(i)

    # remove all useless information
    for i in temp_list:
        name_list.remove(i)

    while "bewerken" in name_list:
        name_list.remove("bewerken")

    # create new list for storing final refinded product
    name_list_refined = []

    # remove everything between brackets using regex
    for i in name_list:
        i = re.sub("[\(].*?[\)]", "", i)
        name_list_refined.append(i)

    return(name_list_refined)


def save_csv(outfile, cities):
    """
    Output a CSV file containing the names of the cities.
    outfile = .csv file
    cities = list
    """
    writer = csv.writer(outfile)
    writer.writerow(['Name'])
    for row in cities:
        writer.writerow([row])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    url = string
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request \
              to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Checks if the response is good
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    cities = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, cities)
