//Referenced: https://www.d3-graph-gallery.com/barplot.html, http://bl.ocks.org/d3noob/7030f35b72de721622b8
//Set Margins
var margin_bar = {top: 20, right: 100, bottom: 100, left: 150},
    width_bar = 1150 - margin.left - margin.right,
    height_bar = 700 - margin.top - margin.bottom;

//SVG Bar Data
var svg_bar = d3.select("#bar_chart")
  .append("svg")
    .attr("width", width_bar + margin.left + margin.right)
    .attr("height", height_bar + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Load Data
d3.csv("electricity_cost_old.csv", function(data) {

//X Axis
var x_bar = d3.scaleBand()
  .range([ 0, width_bar ])
  .domain(data.map(function(d) { return d.State; }))
  .padding(0.1);
svg_bar.append("g")
  .attr("transform", "translate(0," + height_bar + ")")
  .call(d3.axisBottom(x_bar))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

//Add Y Axis
var y_bar = d3.scaleLinear()
  .domain([0, 18])
  .range([ height_bar, 0]);
svg_bar.append("g")
  .call(d3.axisLeft(y_bar));


//Add Y Axis label
svg_bar.append("text")
.attr("class", "y label")
.attr("text-anchor", "middle")
.attr("x", 70- (height_bar/ 2))
.attr("y", -70 )
.attr("transform", "rotate(-90)")
.style("text-decoration", "underline")
.text("Average Cost of Electricity (Cents per KW-Hour)");

// Add SVG Bars
svg_bar.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x_bar(d.State); })
    .attr("y", function(d) { return y_bar(d.Value); })
    .attr("width", x_bar.bandwidth())
    .attr("height", function(d) { return height_bar - y_bar(d.Value); })
    .attr("fill", "#935FB2")
    .on("mouseover", function(d) {
          var x_val_tooltip = x_bar(d.State);
					var y_val_tooltip = y_bar(d.Value);
					//Tooltip
					svg_bar.append("text")
					   .attr("id", "tooltip")
					   .attr("x", x_val_tooltip)
					   .attr("y", y_val_tooltip)
             .attr("dy", -20)
					   .attr("text-anchor", "middle")
					   .attr("font-size", "20px")
					   .attr("fill", "black")
					   .text(d.State + " " + d.Value);
			   })
			   .on("mouseout", function() {
					d3.select("#tooltip").remove();
			   });

//Add Source
svg_bar.append("text")
  .text("Source: Stanford DeepSolar Project")
  .attr("x", width_bar/1.5 - 50)
  .attr("y", height_bar+90 );
})

//Add Title
var bar_pollution = svg_bar.append("text")
  .attr("x",width_pollution / 2)
  .attr("text-anchor", "middle")
  .attr("dy", ".75em")
  .style("font-size", "23px")
  .text("US Cost of Electricity by State (2000)");
