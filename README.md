# SolarSystem

## Background Overview

Besides coding and technology, I have always had an interest and small fascination with Astronomy as well. 
For me, both the known and unknown of our universe is always something very enlightening to think about. 
For my JavaScript project, I would like to combine these two interests into a fun data visualization showing off the different
details of the eight planets in our Solar System such as there radius, mass, gravity, etc.
My motivation behind this project is to get users to be intrigued about their home planet as well as the 
surrounding planets that make up our Solar System. By displaying this information in a simple but visually stimulating way,
I hope to get more people interested about where their from.

## Functionality & MVPs

SolarSystem users will be able to:

* View relevant planetary information about any of the eight planets in our Solar System
* Select a planet to display to the user all of the relevant data pertaining to that specific planet
* Select a piece of data and up to all 8 planets to compare data between eachother in a pie chart

## Wireframes

This visualization will consist of a selection of the eight planets in our solar system (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Nepturn),
a list of the selected planets data, a piechart used for visual comparison between the other selected planets, 
a dropdown to refine the data being used for comparison, and another list to toggle the planets being compared within the
piechart.

![Wireframe](https://github.com/bryandevelops/SolarSystem/blob/master/src/assets/wireframe.png)

## Architecture and Technologies

SolarSystem will be built with:

* `Vanilla JavaScript` for data retrieval and computation
* `d3.js` + `HTML5` + `SVG` + `CSS3` for interactivity
* `chart.js` for rendering comparison chart visualization
* `Webpack` + `Babel` for bundling js files
* `The Solar System OpenData API` for all planetary data

## Implementation Timeline

* Day 1: Learn how to use and implement an API. Organize the data to be used.
* Day 2: Review `d3.js` documentation. Review `chart.js` documentation.
* Day 3: Lay out code to get all the data represented.
* Day 4: Implement the data visualization.
