let center = [37.09, -95.71];
let mapZoomLevel = 5;

// Adding the tile layer
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

// var queryUrl1 = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

let queryUrl="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Create the createMap function.

// Perform a GET request to the query URL/

d3.json(queryUrl).then(function (data) {
// Once we get a response, send the data.features object to the createFeatures function.
console.log(data.features)
createMap(data.features);
});
  
  function createMap(earthquakes) {
    let quakeMarkers = [];
  
    // Loop through locations, and create the city and state markers.
    // LAYERS/SITES POP UP COLOUR CIRCLE MARKERS
    
    function getColor(data) { //should this ingest data
        const depth = earthquakes[i].geometry.coordinates[2]
        // console.log(depth)
        if ( depth < 10 ) {
            return  'green';
        } else if (depth < 30) {
            return 'chartreuse';
        } else if (depth < 50) {
            return 'yellow';
        } else if (depth < 70) {
            return 'gold';
        } else if (depth < 90) {
            return 'orange';
        } else  {
            return 'red';
        }
    }

    // }

    // <!-- LAYERS/SITES ADD LAYER->
    // L.geoJson(sites, {
    //     pointToLayer: function (feature, latlng) {
    //     return new L.CircleMarker(latlng, {radius: 8, 
    //                                         fillOpacity: 1, 
    //                                         color: 'black', 
    //                                         fillColor: getColor(feature.properties.stype), 
    //                                         weight: 1,});
    //     },
    //     onEachFeature: siteslabels
    // }).addTo(map);

    for (var i = 0; i < earthquakes.length; i++) {
      // Set the marker radius for the state by passing the population to the markerSize() function.
      quakeMarkers.push(
        L.circle([earthquakes[i].geometry.coordinates[1], earthquakes[i].geometry.coordinates[0]], {
          stroke: true,
          fillOpacity: 0.75,
          color: "gray",
          fillColor: getColor(earthquakes[i].geometry.coordinates[2]), 
        //   fillColor: "white",
          radius: earthquakes[i].properties.mag * 20000 //(earthquakes[i].state.population)
        }).bindPopup(`<h2>${earthquakes[i].properties.place}: ${earthquakes[i].properties.mag} depth: ${earthquakes[i].geometry.coordinates[2]} </h2>`)
      );
    }
    // console.log(quakeMarkers);
  
    let quakeLayer = L.layerGroup(quakeMarkers);
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Creat an overlays object.
  
    var overlayMaps = {
      quakes: quakeLayer,
    };
    // Create a new map.
    // Edit the code to add the earthquake data to the layers.
    var myMap = L.map("map", {
      center: center,
      zoom: mapZoomLevel,
      layers: [street, quakeLayer]
    });
  
    // Create a layer control that contains our baseMaps.
    // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
    // collapsed false makes the control box in hte top right not be minimized
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
   //Createing a Legend
    let infolegend = L.control({
        position: "bottomright",
      });
  
      // When the layer control is added, insert a div with the class of "legend".
      infolegend.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
      
      let labels = []
      let limits = ["<10","<30","<50","<70","<90","+90",]
  
      let colors = ["#008000","#bbff00de","#ffff00de","#ffd700","#ffa500","#ff0000"]

        console.log(labels)

      div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
      <div class="max">' + limits[limits.length - 1] + '</div></div>';

      limits.forEach(function(limits, index) {
        labels.push(`<li style = "background-color: ${colors[index]}"> ${limits} </li>`)
         });

      div.innerHTML += '<ul>' + labels.join('') + '</ul>'
      return div;
    };
    infolegend.addTo(myMap);
   // Add the info legend to the map.   
  




    //   document.querySelector(".legend").innerHTML = [
    //     "<p class='less10'>  <10" + "</p>",
    //     "<p class='less30'> <30" +  "</p>",
    //     "<p class='less50'> <50" +  "</p>",
    //     "<p class='less70'> <70" +  "</p>",
    //     "<p class='less90'> <90" +  "</p>",
    // //     "<p class='great90'> +90" + "</p>",

    //   ].join("");

  }
  