// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
});
  
// Define streetmap  layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    }).addTo(myMap);

// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Color marker function
function fillScale(mag) {
    if (mag > 5) {
        return '#FF3333'
    } else if (mag > 4) {
        return '#FF6633'
    } else if (mag > 3) {
        return '#FF9933'
    } else if (mag > 2) {
        return '#FFCC33'
    } else if (mag > 1) {
        return '#FFFF33'
    } else {
        return '#CCFF33'
    }
};

//data request
d3.json(url, data => {
    console.log(data.features);
    data.features.forEach(d => {
        L.circleMarker([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
            fillOpacity: 0.9,
            color: 'black',
            weight: 1,
            fillColor: fillScale(d.properties.mag),
            radius: d.properties.mag * 7
        }).bindPopup("Magnitude: " + d.properties.mag
                        + "<br>Location: " + d.properties.place).addTo(myMap);
    });
    
    //legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + fillScale(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
    };
    legend.addTo(myMap);
});

