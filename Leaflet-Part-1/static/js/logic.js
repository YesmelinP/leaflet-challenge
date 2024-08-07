// Creating the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the USGS earthquake data for the last 7 days (I chose all Earthquakes)
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// markers should reflect the depth of the earthquake by color,
// with greater depth should appear darker in color.
let legend = [
    {
        value: "#a4f600",
        range: { lower_bound: Number.MIN_SAFE_INTEGER, upper_bound: 10 }
    },
    {
        value: "#ddf402",
        range: { lower_bound: 10, upper_bound: 30 }
    },
    {
        value: "#f7db11",
        range: { lower_bound: 30, upper_bound: 50 }
    },
    {
        value: "#feb72a",
        range: { lower_bound: 50, upper_bound: 70 }
    },
    {
        value: "#fca35e",
        range: { lower_bound: 70, upper_bound: 90 }
    },
    {
        value: "#ff5f65",
        range: { lower_bound: 90, upper_bound: Number.MAX_SAFE_INTEGER }
    }

]
// creating functiont o choose color using depth 
function chooseColor(depth) {
    let result = legend.find((element) => (depth > element.range.lower_bound && depth <= element.range.upper_bound))
    return result.value
}

// Setting up the legend
let mapLegend = L.control({ position: 'bottomright' });
// configuring the map legend
mapLegend.onAdd = function (map) {
    // creating the legend container 
    let div = L.DomUtil.create('div', 'info legend')

    // loop through our setup legends to get the values as per leaflet documentation
    legend.forEach(element => {
        let lower_bound = element.range.lower_bound == Number.MIN_SAFE_INTEGER ? "∞" : element.range.lower_bound;
        let upper_bound = element.range.upper_bound == Number.MAX_SAFE_INTEGER ? "∞" : element.range.upper_bound;
        div.innerHTML += `<i style="background: ${chooseColor(element.range.upper_bound)}"></i>`;
        div.innerHTML += `${lower_bound} &ndash; ${upper_bound}`;
        div.innerHTML += "<br>"
    });
    return div;
};
// adding map legend to my map.
mapLegend.addTo(myMap);

// Getting our GeoJSON data
d3.json(url).then(function (data) {
    // Printing my data in the console 
    console.log(data)
    //Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {

        // this function call an action per each feature of our GeoJson
        onEachFeature: function (feature, layer) {
            // and on each feature let's add the bindPopup
            layer.bindPopup("<h2> Place: " + feature.properties.place + "</h2> <hr> <h2>  Magnitude: " + feature.properties.mag + " Depth: " + feature.geometry.coordinates[2] + "</h2>");
        },
        // Now let's style the map
        pointToLayer: function (feature, latlng) {
            let geojsonMarkerOptions = {
                radius: feature.properties.mag * 3,
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 20,
                fillOpacity: 1
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }

        // Add it to the map
    }).addTo(myMap);
});
