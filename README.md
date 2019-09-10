# [SolarSystem](https://bryandevelops.github.io/SolarSystem/)

SolarSystem is a personal project comprised of several technologies surrounding the JavaScript language.

## Background Overview

Aside from coding and technology, I have always had an affinity and small fascination with Astronomy as well. 
For me, both the known and unknown of our universe has always been very enlightening to think about. 
Due to this other interest, I took an initiative and created a fun data visualization showing off the different
details of the primary eight celestial objects that make up our Solar System. Some of these details include their radius, tilt, gravity, etc.
My motivation behind this project was to get users interested in learning more about our home planet as well as the 
surrounding planets that make up the Solar System. By displaying this information in a simple but visually stimulating way,
I hope to garner more people's interest in my favorite natural science.

## Functionality & MVPs

SolarSystem users are able to:

* View relevant planetary information about any of the eight planets by hovering over them
* Thanks to calls from a public OpenData API, users can click on a planet to display all of the relevant data pertaining to that specific planet. Here's a snippet of how I make this possible:

```
let elements = Array.from(document.querySelectorAll('.planet'));

elements.forEach(function (el) {
  el.addEventListener("click", () => {
    let list = document.getElementById("more-info");

    while (list.childNodes.length) {
      list.childNodes.forEach(node => {
        list.removeChild(node);
      })
    }

    fetch(`https://api.le-systeme-solaire.net/rest/bodies/${el.__data__.id}?data=englishName,aphelion,perihelion,semimajorAxis,eccentricity,density,gravity,inclination,flattening`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let h1;
        let text;

        Object.entries(data).forEach(d => {
          switch (d[0]) {
          
            ...
          
        })
      });
  })
})          
        
```

* Click on one of eight slices representing a category of comparison
* Alternatively a user may use keys 1 though 8 on their keypad to also cycle through categories of comparison
* Manipulate the Chart and Legend in an engaging way by clicking them and making them change 

![Solar System Demo](https://github.com/bryandevelops/SolarSystem/blob/master/src/assets/demo.gif)

Click the link below to interact with it live!

[SolarSystem](https://bryandevelops.github.io/SolarSystem/)

## Wireframes

When the idea was first being nurtured and planned out, my vision for the visualization was to have it consist of a selection of the eight planets in our solar system (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Nepturn),
a list of the planets data displayed on click, a piechart used for visual comparison between the other planets, 
a dropdown to refine the data being used for comparison, and lastly a legend to help differentiate any information displayed on the chart.

You can see the direction I wanted to take during the planning stages below by taking a glimpse at the original wireframe I created for myself:

![Wireframe](https://github.com/bryandevelops/SolarSystem/blob/master/src/assets/wireframe.png)

Overall, I was pretty intent with following this vision as closely as I could since I was very confident in the layout for all the elements that would tie in togethter. Changes were made, such as the dropdown never having been incorporated, but these changes were made in order to make the experience more engaging for the user. I thought it would be more creative to have the chart itself handle the selection on top of just displaying the information. The end result came out to look extremely similar and even better then I imagined initially.







## Architecture and Technologies

SolarSystem is built with:

* `Vanilla JavaScript` for data retrieval and computation
* `d3.js` + `HTML5` + `SVG` + `CSS3` for visualization and interactivity
* `Webpack` + `Babel` for bundling js files
* `The Solar System OpenData API` for all planetary data



###### Note 

~Use fullscreen while using! It is meant to be a fullscreen experience.

##### Enjoy!
