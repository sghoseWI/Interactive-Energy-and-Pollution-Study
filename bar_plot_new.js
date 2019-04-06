//Referenced: https://www.d3-graph-gallery.com/barplot.html, http://bl.ocks.org/d3noob/7030f35b72de721622b8
//Set Margins
var margin_bar_new = {top: 20, right: 100, bottom: 100, left: 150},
    width_bar_new = 1150 - margin.left - margin.right,
    height_bar_new = 700 - margin.top - margin.bottom;

//SVG Bar Data
var svg_bar_new = d3.select("#bar_chart_new")
  .append("svg")
    .attr("width", width_bar_new + margin.left + margin.right)
    .attr("height", height_bar_new + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Load Data
d3.csv("electricity_cost.csv", function(data) {
//X Axis
var x_bar_new = d3.scaleBand()
  .range([ 0, width_bar_new ])
  .domain(data.map(function(d) { return d.State; }))
  .padding(0.1);
svg_bar_new.append("g")
  .attr("transform", "translate(0," + height_bar_new + ")")
  .call(d3.axisBottom(x_bar_new))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

//Add Y Axis
var y_bar_new = d3.scaleLinear()
  .domain([0, 18])
  .range([ height_bar_new, 0]);
svg_bar_new.append("g")
  .call(d3.axisLeft(y_bar_new));


//Add Y Axis label
svg_bar_new.append("text")
.attr("class", "y label")
.attr("text-anchor", "middle")
.attr("x", 70- (height_bar_new/ 2))
.attr("y", -70 )
.attr("transform", "rotate(-90)")
.style("text-decoration", "underline")
.text("Average Cost of Electricity (Cents per KW-Hour)");

// Add SVG Bars
svg_bar_new.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x_bar_new(d.State); })
    .attr("y", function(d) { return y_bar_new(d.Value); })
    .attr("width", x_bar_new.bandwidth())
    .attr("height", function(d) { return height_bar_new - y_bar_new(d.Value); })
    .attr("fill", "#FC8D62")
    .on("mouseover", function(d) {
          var x_val_tooltip_new = x_bar_new(d.State);
					var y_val_tooltip_new = y_bar_new(d.Value);
					//Tooltip
					svg_bar_new.append("text")
					   .attr("id", "tooltip")
					   .attr("x", x_val_tooltip_new)
					   .attr("y", y_val_tooltip_new)
             .attr("dy", -20)
					   .attr("text-anchor", "middle")
					   .attr("font-size", "25px")
					   .attr("fill", "black")
					   .text(d.State + " " + d.Value);
			   })
			   .on("mouseout", function() {
					d3.select("#tooltip").remove();
			   });

//Add Source
svg_bar_new.append("text")
  .text("Source: US Energy Information Administration")
  .attr("x", width_bar_new/1.5 - 50)
  .attr("y", height_bar_new+90 );
})

//Add Title
var bar_pollution_new = svg_bar_new.append("text")
  .attr("x",width_pollution_new / 2)
  .attr("text-anchor", "middle")
  .attr("dy", ".75em")
  .style("font-size", "23px")
  .text("US Cost of Electricity by State (2017)");
