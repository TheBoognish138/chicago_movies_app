// GOAL 1
// Can I render a basic base map? - Set up Leaflet correctly
// Can we fetch the data that we need to plot?


function createMap(data, geo_data) {
  // STEP 1: Init the Base Layers

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Step 2: Create the Overlay layers
  let markers = L.markerClusterGroup();
  let heatArray = [];

  for (let i = 0; i < data.length; i++){
    let row = data[i];
    let latitude = row.latitude;
    let longitude = row.longitude;

    // extract coord
    let point = [latitude, longitude];

    // make marker
    let marker = L.marker(point);
    let popup = `<h1>${row.full_name}</h1><hr><h2>${row.region}</h2><hr><h3>${row.launch_attempts} | ${row.launch_successes}</h3>`;
    marker.bindPopup(popup);
    markers.addLayer(marker);

    // add to heatmap
    heatArray.push(point);
  }

  // create layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 25,
    blur: 20
  });

  // chicago neighborhood boundaries
  let geo_layer = L.geoJSON(geo_data);

  // Step 3: BUILD the Layer Controls

  // Only one base layer can be shown at a time.

  let overlayLayers = {
    Markers: markers,
    Heatmap: heatLayer
  }

  // Step 4: INIT the Map

  // Destroy the old map
  d3.select("#map-container").html("");

  // rebuild the map
  d3.select("#map-container").html("<div id='map'></div>");

  let myMap = L.map("map", {
    center: [41.8781, -87.6298],
    zoom: 10,
    layers: [street, markers, geo_layer]
  });


  // Step 5: Add the Layer Control filter + legends as needed
  L.control.layers(overlayLayers).addTo(myMap);

}

function do_work() {
 
  // We need to make a request to the API
  let url = `/api/v1.0/get_map/2014/2019`; //2014 and 2019 will eventually need to be user inputs
  let url2 = "https://raw.githubusercontent.com/henrywht21/chicago_boundaries/main/chicago-community-areas.geojson";

  // make TWO requests
  d3.json(url).then(function (data) {
    d3.json(url2).then(function (geo_data){
      
      createMap(data, geo_data);
      console.log(geo_data)
    })
    
  });
}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

do_work();

function do_work() {
  // extract user input
  let year_min = d3.select("#year_min").property("value");
  year_min = parseInt(year_min);
  let year_max = d3.select("#year_max").property("value");
  year_max = parseInt(year_max);

  // We need to make a request to the API
  let url = `/api/v1.0/get_map/${year_min}/${year_max}`;

  // make TWO requests
  d3.json(url).then(function (data) {
    createMap(data);
  });
}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

do_work();
