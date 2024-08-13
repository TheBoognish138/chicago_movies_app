let maxValue = 0 // initialize maxValue for use in doWork
// Color function used in choropleth
function getColor(d) {
  return d > .75*maxValue ? '#009c1a' :
         d > .5*maxValue  ? '#26cc00' :
         d > .25*maxValue  ? '#7be382' :
         d > 0 ? '#d2f2d4' :
                   '#ffffff' ;
}
function createMap(data, geo_data) {
  // STEP 1: Init the Base Layers
  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })
  // Step 2: Create the Overlay layers
  let markers = L.markerClusterGroup();
  for (let i = 0; i < data.length; i++){
    let row = data[i];
    let latitude = row.latitude;
    let longitude = row.longitude;
    // extract coord
    let point = [latitude, longitude];
    // make marker
    let marker = L.marker(point);
    let popup = `<h1>${row.title}</h1><hr><h2>${row.park}</h2><hr><h3>${row.date}</h3><hr><h3>${row.rating}</h3><hr><h4>Closed Captioning: ${row.cc}</h4>`;
    marker.bindPopup(popup);
    markers.addLayer(marker);
  }
  // Step 3: BUILD the Layer Controls
  // Only one base layer can be shown at a time.
  let overlayLayers = {
    Markers: markers
  }
  // Choropleth Layer
  // Create a new choropleth layer.
  function style(feature) {
    return {
        fillColor: getColor(feature.properties.family_friendly_counts),
        weight: 1.8,
        opacity: 1,
        color: 'white',
        dashArray: '2',
        fillOpacity: 0.7
    };
}
  // chicago neighborhood boundaries
  let geo_layer = L.geoJSON(geo_data,{style: style});
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
  
  // Step 5: Legend
  
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
  
      let legendInfo = "<h4>Occurence of Family Friendly Films</h4>"
      legendInfo += "<i style='background: #ffffff'></i>None<br/>";
      legendInfo += "<i style='background: #d2f2d4'></i>Rare<br/>";
      legendInfo += "<i style='background: #7be382'></i>Periodic<br/>";
      legendInfo += "<i style='background: #26cc00'></i>Regular<br/>";
      legendInfo += "<i style='background: #009c1a'></i>Frequent<br/>";
  
      div.innerHTML = legendInfo;
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
  
}
// Initialize variables for year filter
let year_min = 2014
let year_max = 2019
function do_work() {
  year_min = d3.select("#year_min").property("value");
  year_max = d3.select("#year_max").property("value")
  // We need to make a request to the API
  let url = `/api/v1.0/get_map/${year_min}/${year_max}`; //2014 and 2019 will eventually need to be user inputs
  let url2 = "https://raw.githubusercontent.com/henrywht21/chicago_boundaries/main/chicago-community-areas.geojson";
  // make TWO requests
  d3.json(url).then(function (data) {
    d3.json(url2).then(function (geo_data){
      
      // Code created with Xpent assistance
      // Create an object to store the counts for each community
      let communityCounts = {};
      // Loop through the data to count the number of rows for each community with rating "G"
      data.forEach(film => {
        if ((film.rating === "G" || film.rating === "PG")) {
          const community = film.community;
          communityCounts[community] = (communityCounts[community] || 0) + 1;
        }
      });
      // Loop through the features in the geo_data and add the "family friendly counts" property
      geo_data.features.forEach(feature => {
        const communityName = feature.properties.community;
        if (communityCounts[communityName]) {
          feature.properties["family_friendly_counts"] = communityCounts[communityName];
        } else {
          feature.properties["family_friendly_counts"] = 0; // Set count to 0 if no films with "G" or "PG" rating in that community
        }
      });
      let values = Object.values(communityCounts);
      
      maxValue = 0
      values.forEach((value) => {
        maxValue = Math.max(maxValue, value);
      });
      createMap(data, geo_data);
    })
    
  });
}
// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);
do_work();