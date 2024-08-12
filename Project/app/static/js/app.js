function do_work() {
  // extract user input
  console.log("do_work()");

  let popularity = d3.select("#popularity_filter").property("value");
  console.log(popularity);

  // We need to make a request to the API
  let url = `/api/v1.0/get_dashboard/${popularity}`;
  d3.json(url).then(function (data) {

    // create the graphs
    make_bar(data.bar_data);
    make_sunburst(data.sunburst_data);
  });
}

// function make_table(filtered_data) {
//   // select table
//   let table = d3.select("#data_table");
//   let table_body = table.select("tbody");
//   table_body.html(""); // destroy any existing rows

//   // create table
//   for (let i = 0; i < filtered_data.length; i++){
//     // get data row
//     let data_row = filtered_data[i];

//     // creates new row in the table
//     let row = table_body.append("tr");
//     row.append("td").text(data_row.name);
//     row.append("td").text(data_row.full_name);
//     row.append("td").text(data_row.region);
//     row.append("td").text(data_row.latitude);
//     row.append("td").text(data_row.longitude);
//     row.append("td").text(data_row.launch_attempts);
//     row.append("td").text(data_row.launch_successes);
//     row.append("td").text(data_row.launch_attempts - data_row.launch_successes);
//   }
// }

function make_sunburst(data) {
  console.log(data);
  let trace = {
    "type": "sunburst",
    "labels": data.sunburst_data.map(x => x.label),
    "parents": data.sunburst_data.map(x => x.parent),
    "values":  data.sunburst_data.map(x => x.num_plays),
    "leaf": {"opacity": 0.4},
    "marker": {"line": {"width": 2}},
    "branchvalues": 'total'
  }

  let traces = [trace];

  let layout = {
    "margin": {"l": 0, "r": 0, "b": 0},
    title: `Showings by Date`,
    colorway: ["#7DBA91", "#277A8C", "#3F908E", "#1B6488", "#5AA590", "#244B7F"]
  }

  Plotly.newPlot("sunburst_chart", traces, layout)
}


function make_bar(filtered_data) {
  // sort values
  //filtered_data.sort((a, b) => (b.Plays - a.Plays));
  // extract the x & y values for our bar chart
  let bar_x = filtered_data.map(x => x.Movie);
  //let bar_text = filtered_data.map(x => x.Movies);
  let bar_y1 = filtered_data.map(x => x.Plays);


  // Trace 1 for the movies popularity
  let trace1 = {
    x: bar_x,
    y: bar_y1,
    type: 'bar',
    marker: {
      color: "turbo"
    },
    // text: bar_x,
    name: "Movies Popularity"
  };

  // Create data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "Movies Popularity",
    xaxis: {title: "Movie Title"},
    yaxis: {title: "Times Played"},
    // Include margins in the layout so the x-tick labels display correctly
    margin: {
      l: 50,
      r: 50,
      b: 200,
      t: 50,
      pad: 4
    }
  };
  console.log(data);
  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar_chart", data, layout);

}
// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);
// on page load, don't wait for the click to make the graph, use default
do_work();
