
var earthquakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";



d3.json(earthquakeLink, function(data) {

  createFeatures(data.features);
});

function createFeatures(earthquakeInfo) {


  var earthquakes = L.geoJSON(earthquakeInfo, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h2>Magnitude: " + feature.properties.mag +"</h2><h2>Location: "+ feature.properties.place +
        "</h2><hr><p>");
    },
    
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .6,
        color: "#000",
        stroke: true,
        weight: .8
    })
  }
  });

  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

 
    var chartMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    })

    var baseMaps = {
      "chartMap": chartMap
   
    };


    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };

    // Create our map, giving it the outdoors, earthquakes and tectonic plates layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71],
      zoom: 3.25,
      layers: [chartMap, earthquakes]
    }); 


  
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  //Create a legend on the bottom left
  var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}
   

  //Create color range for the circle diameter 
  function getColor(d){
    return d > 8 ? "#black":
    d  > 6 ? "#red":
    d > 4.7 ? "orange":
    d > 4.7 ? "yellow":
    d > 4? "blue":
    d > 1 ? "green":
    d > .5 ? "white":
             "green";
  }

  //Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle. 
  function getRadius(value){
    return value*2014
  }


  
  
       {
       // Set mouse events to change map styling
       layer.on({
         // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
         mouseover: function(event) {
           layer = event.target;
           layer.setStyle({
             fillOpacity: 0.9
           });
         },
         // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
         mouseout: function(event) {
           layer = event.target;
           layer.setStyle({
             fillOpacity: 0.5
           });
         },
         // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
         click: function(event) {
           map.fitBounds(event.target.getBounds());
         }
       });
       // Giving each feature a pop-up with information pertinent to it
       layer.bindPopup("<h2>" + feature.properties.place + "</h2> <hr> <h2>" + feature.properties.mag + "</h2>");
     }
