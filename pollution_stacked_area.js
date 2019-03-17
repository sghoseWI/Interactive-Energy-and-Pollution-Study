//Referenced: https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7,
//https://www.d3-graph-gallery.com/graph/stackedarea_template.html,
//https://github.com/d3/d3-scale-chromatic

//Set Margins
var margin1 = {top: 20, right: 100, bottom: 100, left: 150},
    width1 = 1200 - margin.left - margin.right,
    height1 = 700 - margin.top - margin.bottom;

//Define svg1
var svg1 = d3.select("#pollution_stacked_area")
  .append("svg")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin1.left + "," + margin1.top + ")");

//title1
var title1 = svg1.append("text")
  .attr("x",width1 / 2)
  .attr("text-anchor", "middle")
  .attr("dy", ".75em")
  .style("font-size", "23px")
  .text("US Air Pollution by Year");

//Read Data
d3.csv("air_pollution_data.csv", function(data) {

//Get Keys from Data
var csv_keys1 = data.columns.slice(1)

//Set Color Scheme
var chart_color_set1 = d3.scaleOrdinal()
  .domain(csv_keys1)
  .range(d3.schemeSet1);

//Stacked Data of Keys
var stackedData1 = d3.stack()
  .keys(csv_keys1)
  (data)

// Add X Variable
var x1 = d3.scaleLinear()
  .domain(d3.extent(data, function(d) { return d.Year; }))
  .range([ 0, width1 ]);

// var ticks = scale.domain().filter(function(d,i){ return !(i%10); } );

// Add X Axis
var xAxis1 = svg1.append("g")
  .attr("transform", "translate(0," + height1 + ")")
  .call(d3.axisBottom(x1).ticks(15));

// Add X Axis Label
svg1.append("text")
    .attr("text-anchor", "end")
    .attr("x", width1/2)
    .attr("y", height1+40 )
    .style("text-decoration", "underline")
    .text("Year");

// Add Y axis
var y1 = d3.scaleLinear()
  .domain([0, 180])
  .range([ height1, 0 ]);
svg1.append("g")
  .call(d3.axisLeft(y1).ticks(5))

// Add Y Axis label
svg1.append("text")
.attr("class", "y label")
.attr("text-anchor", "middle")
.attr("x", 70- (height1/ 2))
.attr("y", -70 )
.attr("transform", "rotate(-90)")
.style("text-decoration", "underline")
.text("US Air Pollution Output (PPM)");

//Add Source
svg1.append("text")
  .text("Source: US Environmental Protection Agency")
  .attr("x", width1/1.5 - 50)
  .attr("y", height1+70 )
;

// Clipping of Data for Filtering
var clipping1 = svg1.append("defs").append("svg:clipPath")
    .attr("id", "clipping")
    .append("svg:rect")
    .attr("width", width1 )
    .attr("height", height1 )
    .attr("x", 0)
    .attr("y", 0);

// Selecting Brush Range -- then Call Update Function
var brush1 = d3.brushX()
    .extent( [ [0,0], [width1,height1] ] )
    .on("end", update1)

//Stacked Area Chart Clipping of svg1
var stacked_area_chart1 = svg1.append('g')
  .attr("clip-path", "url(#clipping)")

//Area Variable
var area1 = d3.area()
  .x1(function(d) { return x1(d.data.Year); })
  .y0(function(d) { return y1(d[0]); })
  .y1(function(d) { return y1(d[1]); })

//Build Stacked Area Chart
stacked_area_chart1
  .selectAll("mylayers")
  .data(stackedData1)
  .enter()
  .append("path")
    .attr("class", function(d) { return "myArea " + d.key })
    .style("fill", function(d) { return chart_color_set1(d.key); })
    .attr("d", area1)

stacked_area_chart1
  .append("g")
    .attr("class", "brush")
    .call(brush1);

var timeout1
function idling() { timeout = null; }

function update1() {
  extent1 = d3.event.selection
  if(!extent1){
    if (!timeout1) return timeout1 = setTimeout(idling, 400);
    x1.domain(d3.extent(data, function(d) { return d.Year; }))
  }else{
    x1.domain([ x1.invert(extent1[0]), x1.invert(extent1[1]) ])
    stacked_area_chart1.select(".brush").call(brush1.move, null)
  }

  xAxis1.transition().duration(800).call(d3.axisBottom(x1).ticks(8))
  stacked_area_chart1
    .selectAll("path")
    .transition().duration(800)
    .attr("d", area1)
  }

  //Legend rectangles and text
  svg1.append("rect")
     .attr("y", 50)
     .attr("x", 10)
     .attr("width", 20)
     .attr("height", 20)
     .attr("fill","red");

  svg1.append("text")
     .attr("y", 65)
     .attr("x", 40)
     .style("font-size", "12px")
     .text("Carbon Monoxide (CO)");

  svg1.append("rect")
    .attr("y", 50)
    .attr("x", 200)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill","blue");

  svg1.append("text")
    .attr("y", 65)
    .attr("x", 230)
    .style("font-size", "12px")
    .text("Nitrogen Oxide (NOx)");

    svg1.append("rect")
      .attr("y", 50)
      .attr("x", 380)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill","green");

  svg1.append("text")
    .attr("y", 65)
    .attr("x", 410)
    .style("font-size", "12px")
    .text("Sulfur Dioxide (SO2)");

})
