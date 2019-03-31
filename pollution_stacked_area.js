//Referenced: https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7,
//Textbook: Interactive Data Visualization for the Web by Scott Murray
//https://www.d3-graph-gallery.com/graph/stackedarea_template.html,
//https://github.com/d3/d3-scale-chromatic

//Set Margins
var margin_pollution = {top: 20, right: 100, bottom: 100, left: 150},
    width_pollution = 1150 - margin.left - margin.right,
    height_pollution = 700 - margin.top - margin.bottom;

//Define SVG
var svg_pollution = d3.select("#pollution_stacked_area")
  .append("svg")
    .attr("width", width_pollution + margin.left + margin.right)
    .attr("height", height_pollution + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Title
var title_pollution = svg_pollution.append("text")
  .attr("x",width_pollution / 2)
  .attr("text-anchor", "middle")
  .attr("dy", ".75em")
  .style("font-size", "23px")
  .text("US Air Pollution by Year (Parts per Million)");

//Read Data
d3.csv("air_pollution_data.csv", function(data) {

//Format Year to Remove Commas
var format_year_pollution = d3.timeParse("%Y");

data.forEach(function(d) {
d.Year = format_year_pollution(d.Year);
});

//Get Keys from Data
var csv_keys_pollution = data.columns.slice(1)

//Set Color Scheme
var chart_color_set_pollution = d3.scaleOrdinal()
  .domain(csv_keys_pollution)
  .range(d3.schemeSet2);

//Stacked Data of Keys
var stackedData_pollution = d3.stack()
  .keys(csv_keys_pollution)
  (data)

// Add X Variable
var x_pollution = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.Year; }))
  .range([ 0, width_pollution ]);

// Add X Axis
var xAxis_pollution = svg_pollution.append("g")
  .attr("transform", "translate(0," + height_pollution + ")")
  .call(d3.axisBottom(x_pollution).ticks(15));


// Add X Axis Label
svg_pollution.append("text")
    .attr("text-anchor", "end")
    .attr("x", width_pollution/2)
    .attr("y", height_pollution+40 )
    .style("text-decoration", "underline")
    .text("Year");

// Add Y axis
var y_pollution = d3.scaleLinear()
  .domain([2.8, 180])
  .range([ height_pollution, 0 ]);
svg_pollution.append("g")
  .call(d3.axisLeft(y_pollution).ticks(5))

// Add Y Axis label
svg_pollution.append("text")
.attr("class", "y label")
.attr("text-anchor", "middle")
.attr("x", 70- (height_pollution/ 2))
.attr("y", -70 )
.attr("transform", "rotate(-90)")
.style("text-decoration", "underline")
.text("US Coal-based Energy Production (Gigawatts)");

//Add Source
svg_pollution.append("text")
  .text("Source: US Energy Information Administration")
  .attr("x", width_pollution/1.5 - 50)
  .attr("y", height_pollution+70 )
;

// Clipping of Data for Filtering
var clipping_pollution = svg_pollution.append("defs").append("svg:clipPath")
    .attr("id", "clipping")
    .append("svg:rect")
    .attr("width", width_pollution )
    .attr("height", height_pollution )
    .attr("x", 0)
    .attr("y", 0);

// Selecting Brush Range -- then Call Update Function
var brush_pollution = d3.brushX()
    .extent( [ [0,0], [width_pollution,height_pollution] ] )
    .on("end", update_pollution)

//Stacked Area Chart Clipping of SVG
var pollution_stacked_area = svg_pollution.append('g')
  .attr("clip-path", "url(#clipping)")

//Area Variable
var area_pollution = d3.area()
  .x(function(d) { return x_pollution(d.data.Year); })
  .y0(function(d) { return y_pollution(d[0]); })
  .y1(function(d) { return y_pollution(d[1]); })

//Build Stacked Area Chart
pollution_stacked_area
  .selectAll("mylayers")
  .data(stackedData_pollution)
  .enter()
  .append("path")
    .attr("class", function(d) { return "myArea " + d.key })
    .style("fill", function(d) { return chart_color_set_pollution(d.key); })
    .attr("d", area_pollution)


pollution_stacked_area
  .append("g")
    .attr("class", "brush")
    .call(brush_pollution);


  // Define the div for the tooltip
  var div_pollution = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var timeout_pollution
function idling() { timeout_pollution = null; }

function update_pollution() {
  extent_pollution = d3.event.selection
  if(!extent_pollution){
    if (!timeout_pollution) return timeout_pollution = setTimeout(idling, 400);
    x_pollution.domain(d3.extent(data, function(d) { return d.Year; }))
  }else{
    x_pollution.domain([ x_pollution.invert(extent_pollution[0]), x_pollution.invert(extent_pollution[1]) ])
    pollution_stacked_area.select(".brush").call(brush_pollution.move, null)
  }

  xAxis_pollution.transition().duration(800).call(d3.axisBottom(x_pollution).ticks(8))
  pollution_stacked_area
    .selectAll("path")
    .transition().duration(800)
    .attr("d", area_pollution)
  }

  //Legend rectangles and text
  svg_pollution.append("rect")
     .attr("y", 50)
     .attr("x", 10)
     .attr("width", 20)
     .attr("height", 20)
     .attr("fill","#777");

  svg_pollution.append("text")
     .attr("y", 65)
     .attr("x", 40)
     .style("font-size", "12px")
     .text("Heat and Power (Commercial)");

  svg_pollution.append("rect")
    .attr("y", 50)
    .attr("x", 200)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill","#5287BB");

  svg_pollution.append("text")
    .attr("y", 65)
    .attr("x", 230)
    .style("font-size", "12px")
    .text("Heat and Power (Electric)");

    svg_pollution.append("rect")
      .attr("y", 50)
      .attr("x", 380)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill","#70B660");

  svg_pollution.append("text")
    .attr("y", 65)
    .attr("x", 410)
    .style("font-size", "12px")
    .text("Heat and Power (Industrial)");

    svg_pollution.append("rect")
      .attr("y", 50)
      .attr("x", 560)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill","#985CA8");

    svg_pollution.append("text")
      .attr("y", 65)
      .attr("x", 590)
      .style("font-size", "12px")
      .text("Electric Generators (Utilities)")

    svg_pollution.append("rect")
      .attr("y", 50)
      .attr("x", 740)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill","orange");

    svg_pollution.append("text")
      .attr("y", 65)
      .attr("x", 770)
      .style("font-size", "12px")
      .text("Electric Generators (Independent Producers)");

})
