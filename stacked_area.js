//Referenced: https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7,
//Textbook: Interactive Data Visualization for the Web by Scott Murray
//https://www.d3-graph-gallery.com/graph/stackedarea_template.html,
//https://github.com/d3/d3-scale-chromatic

//Set Margins
var margin = {top: 20, right: 100, bottom: 100, left: 150},
    width = 1150 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

//Define SVG
var svg = d3.select("#stacked_area_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Title
var title = svg.append("text")
  .attr("x",width / 2)
  .attr("text-anchor", "middle")
  .attr("dy", ".75em")
  .style("font-size", "23px")
  .text("Total US Coal-based Energy Production by Sector");

//Read Data
d3.csv("eia_total_coal_electricity_output.csv", function(data) {

var format_year = d3.timeParse("%Y");

data.forEach(function(d) {
d.Year = format_year(d.Year);
});

//Get Keys from Data
var csv_keys = data.columns.slice(1)

//Set Color Scheme
var chart_color_set = d3.scaleOrdinal()
  .domain(csv_keys)
  .range(d3.schemeSet1);

//Stacked Data of Keys
var stackedData = d3.stack()
  .keys(csv_keys)
  (data)

// Add X Variable
var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.Year; }))
  .range([ 0, width ]);

// Add X Axis
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(15));


// Add X Axis Label
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2)
    .attr("y", height+40 )
    .style("text-decoration", "underline")
    .text("Year");

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 5000000])
  .range([ height, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y).ticks(5))

// Add Y Axis label
svg.append("text")
.attr("class", "y label")
.attr("text-anchor", "middle")
.attr("x", 70- (height/ 2))
.attr("y", -70 )
.attr("transform", "rotate(-90)")
.style("text-decoration", "underline")
.text("US Coal-based Energy Production (Gigawatts)");

//Add Source
svg.append("text")
  .text("Source: US Energy Information Administration")
  .attr("x", width/1.5 - 50)
  .attr("y", height+70 )
;

// Clipping of Data for Filtering
var clipping = svg.append("defs").append("svg:clipPath")
    .attr("id", "clipping")
    .append("svg:rect")
    .attr("width", width )
    .attr("height", height )
    .attr("x", 0)
    .attr("y", 0);

// Selecting Brush Range -- then Call Update Function
var brush = d3.brushX()
    .extent( [ [0,0], [width,height] ] )
    .on("end", update)

//Stacked Area Chart Clipping of SVG
var stacked_area_chart = svg.append('g')
  .attr("clip-path", "url(#clipping)")

//Area Variable
var area = d3.area()
  .x(function(d) { return x(d.data.Year); })
  .y0(function(d) { return y(d[0]); })
  .y1(function(d) { return y(d[1]); })

//Build Stacked Area Chart
stacked_area_chart
  .selectAll("mylayers")
  .data(stackedData)
  .enter()
  .append("path")
    .attr("class", function(d) { return "myArea " + d.key })
    .style("fill", function(d) { return chart_color_set(d.key); })
    .attr("d", area)


stacked_area_chart
  .append("g")
    .attr("class", "brush")
    .call(brush);


  // Define the div for the tooltip
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var timeout
function idling() { timeout = null; }

function update() {
  extent = d3.event.selection
  if(!extent){
    if (!timeout) return timeout = setTimeout(idling, 400);
    x.domain(d3.extent(data, function(d) { return d.Year; }))
  }else{
    x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
    stacked_area_chart.select(".brush").call(brush.move, null)
  }

  xAxis.transition().duration(800).call(d3.axisBottom(x).ticks(8))
  stacked_area_chart
    .selectAll("path")
    .transition().duration(800)
    .attr("d", area)
  }

  //Legend rectangles and text
  svg.append("rect")
     .attr("y", 50)
     .attr("x", 10)
     .attr("width", 20)
     .attr("height", 20)
     .attr("fill","#777");

  svg.append("text")
     .attr("y", 65)
     .attr("x", 40)
     .style("font-size", "12px")
     .text("Heat and Power (Commercial)");

  svg.append("rect")
    .attr("y", 50)
    .attr("x", 200)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill","#5287BB");

  svg.append("text")
    .attr("y", 65)
    .attr("x", 230)
    .style("font-size", "12px")
    .text("Heat and Power (Electric)");

    svg.append("rect")
      .attr("y", 50)
      .attr("x", 380)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill","#70B660");

  svg.append("text")
    .attr("y", 65)
    .attr("x", 410)
    .style("font-size", "12px")
    .text("Heat and Power (Industrial)");

    svg.append("rect")
      .attr("y", 50)
      .attr("x", 560)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill","#985CA8");

    svg.append("text")
      .attr("y", 65)
      .attr("x", 590)
      .style("font-size", "12px")
      .text("Electric Generators (Utilities)")

    svg.append("rect")
      .attr("y", 50)
      .attr("x", 740)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill","orange");

    svg.append("text")
      .attr("y", 65)
      .attr("x", 770)
      .style("font-size", "12px")
      .text("Electric Generators (Independent Producers)");

})
