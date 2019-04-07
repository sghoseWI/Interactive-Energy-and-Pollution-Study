//referenced: http://bl.ocks.org/jfreels/6816504

//Set Margins
  var margin_line = {top: 20, right: 100, bottom: 100, left: 150},
      w_line = 1400 - margin.left - margin.right,
      h_line = 700 - margin.top - margin.bottom;

  var padding_line = 110;

//Data from EPA
  var dataset_line =[[40,16.65,'CT','Above Average'],
[38,15.41,'MA','Above Average'],
[33,15.32,'NY','Above Average'],
[40,15.08,'NH','Below Average'],
[32,15.02,'RI','Below Average'],
[46,14.72,'CA','Above Average'],
[33,14.45,'VT','Below Average'],
[40,13.69,'NJ','Above Average'],
[36,12.39,'ME','Below Average'],
[39,11.88,'MD','Above Average'],
[40,11.1,'DE','Below Average'],
[37,11,'MI','Above Average'],
[40,10.55,'WI','Below Average'],
[37,10.35,'FL','Above Average'],
[39,10.26,'PA','Above Average'],
[47,10.15,'AZ','Above Average'],
[35,9.97,'KS','Below Average'],
[37,9.82,'CO','Above Average'],
[36,9.66,'GA','Above Average'],
[37,9.57,'OH','Above Average'],
[35,9.48,'SC','Above Average'],
[37,9.46,'MN','Below Average'],
[32,9.29,'NM','Above Average'],
[38,9.27,'AL','Below Average'],
[37,9.27,'TN','Below Average'],
[36,9.26,'NC','Above Average'],
[36,9.24,'MO','Above Average'],
[34,9.14,'SD','Below Average'],
[37,9.12,'NV','Above Average'],
[30,9.12,'VA','Above Average'],
[39,9.1,'MS','Below Average'],
[29,8.98,'NE','Below Average'],
[37,8.97,'IL','Above Average'],
[35,8.86,'IN','Below Average'],
[35,8.66,'TX','Above Average'],
[27,8.63,'MT','Below Average'],
[26,8.58,'OR','Above Average'],
[39,8.43,'ND','Below Average'],
[45,8.32,'UT','Above Average'],
[38,8.17,'IA','Below Average'],
[31,8.16,'WV','Below Average'],
[38,7.95,'AR','Below Average'],
[38,7.93,'KY','Below Average'],
[37,7.86,'OK','Below Average'],
[39,7.73,'WY','Below Average'],
[22,7.72,'ID','Below Average'],
[35,7.63,'LA','Above Average'],
[22,7.25,'WA','Above Average'],];

  var xScale_line = d3.scaleLinear()
             .domain([21, d3.max(dataset_line, function(d) { return d[0]; })])
             .range([padding_line, w_line - padding_line * 2]);
  var yScale_line = d3.scaleLinear()
             .domain([6, d3.max(dataset_line, function(d) { return d[1]; })])
             .range([h_line - padding_line, padding_line]);

  var axisScale_line = d3.scaleSqrt()
            .domain([0, d3.max(dataset_line, function(d) { return d[1]; })])
            .range([0, 10]);

  //X axis
  var xAxis_line = d3.axisBottom()
            .scale(xScale_line)
            .ticks(5);
  //Y axis
  var yAxis_line = d3.axisLeft()
            .scale(yScale_line)
            .ticks(5);

  // SVG element
  var svg_line = d3.select("#line_chart")
        .append("svg")
        .attr("width", w_line)
        .attr("height", h_line);

  //Title
  var title_line = svg_line.append("text")
    .attr("x",w_line / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("dy", ".75em")
    .style("font-size", "23px")
    .text("Average Cost of Electricity by State vs. Average Air Quality Index (2017)");


  // Circles for scatterplot
  svg_line.selectAll("circle")
     .data(dataset_line)
     .attr("class", "circle")
     .enter()
     .append("circle")
     .style('fill',"none")
     .style('stroke',"black")
     .on('mouseover', function (d) {
       d3.select(this)
         .transition()
         .duration(10)
         .attr('r',10)
         .attr('stroke-width',1)
         .style('fill', function(d) {
            if ((d[3] =="Below Average")) {
              return "#FC8D62"}
            else {
              return '#8DA0CB'}
          })
      // })
      // .on('mouseout', function (d) {
      //   d3.select(this)
      //     .transition()
      //     .duration(500)
      //     .attr('r',10)
      //     .attr('stroke-width',1)
      //     .style('fill', function(d) {
      //        if ((d[3] =="Below Average")) {
      //          return "#FC8D62"}
      //        else {
      //          return '#935FB2'}
      //      })
      })
     .attr("cx", function(d) {
        return xScale_line(d[0]);
     })
     .attr("cy", function(d) {
        return yScale_line(d[1]);
     })
     .attr("r", function(d) {
        return axisScale_line(20);
     });

  // Data labels
  var labels_line = svg_line.selectAll("text")
     .data(dataset_line)
     .attr("class", "labels")
     .enter()
     .append("text")
     .text(function(d) {
        return d[2];
     })
     .attr("x", function(d) {
        return xScale_line(d[0]);
     })
     .attr("y", function(d) {
        return yScale_line(d[1]);
     })
     .attr("font-family", "rockwell")
     .attr("font-size", "15px")
     .attr("fill", "black")
     .attr("dy","1em")
     .attr("dx","1em");

  // X axis
  svg_line.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h_line - padding_line) + ")")
    .call(xAxis_line);

  // add x axis label
  svg_line.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", (w_line/2))
      .attr("y", (h_line-50))
      .style("text-decoration", "underline")
      .text("Average Air Quality Index");

  // Y axis
  svg_line.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding_line + ",0)")
    .call(yAxis_line);

  //Add y axis label
  svg_line.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x",0 - (h_line / 2))
    .attr("dy", "4em")
    .attr("transform", "rotate(-90)")
    .style("text-decoration", "underline")
    .text("Average Cost of Electricity (Cents per KW-Hour)");

  //Legend rectangles and text
  svg_line.append("rect")
     .attr("y", 230)
     .attr("x", 150)
     .attr("width", 20)
     .attr("height", 20)
     .attr("fill","#FC8D62");

  svg_line.append("text")
     .attr("y", 245)
     .attr("x", 180)
     .style("font-size", "14px")
     .text("Below US Average: Total Solar Panels");

  svg_line.append("rect")
    .attr("y", 200)
    .attr("x", 150)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill","#8DA0CB");

  svg_line.append("text")
    .attr("y", 215)
    .attr("x", 180)
    .style("font-size", "14px")
    .text("Above US Average: Total Solar Panels");

    //Add Source
    svg_line.append("text")
      .text("Source: US Environmental Protection Agency + Stanford DeepSolar Project + The Open PV Project")
      .attr("x", w_line-800)
      .attr("y", (h_line-20));
