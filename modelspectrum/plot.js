function addViolin(svg, results, height, width, domain, imposeMax, violinColor){


        var data = d3.layout.histogram()
                        .bins(resolution)
                        .frequency(0)
                        (results);

        var y = d3.scale.linear()
                    .range([width/2, 0])
                    .domain([0, Math.max(imposeMax, d3.max(data, function(d) { return d.y; }))]);

        var x = d3.scale.linear()
                    .range([height, 0])
                    .domain(domain)
                    .nice();


        var area = d3.svg.area()
            .interpolate(interpolation)
            .x(function(d) {
                   if(interpolation=="step-before")
                        return x(d.x+d.dx/2)
                   return x(d.x);
                })
            .y0(width/2)
            .y1(function(d) { return y(d.y); });

        var line=d3.svg.line()
            .interpolate(interpolation)
            .x(function(d) {
                   if(interpolation=="step-before")
                        return x(d.x+d.dx/2)
                   return x(d.x);
                })
            .y(function(d) { return y(d.y); });

        var gPlus=svg.append("g")
        var gMinus=svg.append("g")

        gPlus.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          .style("fill", violinColor);

        gPlus.append("path")
          .datum(data)
          .attr("class", "violin")
          .attr("d", line)
          .style("stroke", violinColor);


        gMinus.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          .style("fill", violinColor);

        gMinus.append("path")
          .datum(data)
          .attr("class", "violin")
          .attr("d", line)
          .style("stroke", violinColor);

        var x=width;

        gPlus.attr("transform", "rotate(90,0,0)  translate(0,-"+width+")");//translate(0,-200)");
        gMinus.attr("transform", "rotate(90,0,0) scale(1,-1)");


}
function addBoxPlot(svg, results, height, width, domain, boxPlotWidth, boxColor, boxInsideColor){
        var y = d3.scale.linear()
                    .range([height, 0])
                    .domain(domain);

        var x = d3.scale.linear()
                    .range([0, width])

        var left=0.5-boxPlotWidth/2;
        var right=0.5+boxPlotWidth/2;

        var probs=[0.05,0.25,0.5,0.75,0.95];
        for(var i=0; i<probs.length; i++){
            probs[i]=y(d3.quantile(results, probs[i]));
        }

// Color by standard deviation
        if(d3.deviation(results)>4){
        boxColor="#FF0000";
        }else if(d3.deviation(results)>2){
                      boxColor="#FFAF00";
                      }else if(d3.deviation(results)>0){
                                             boxColor="#9ADC00";
                                             }

        svg.append("rect")
            //.attr("class", "boxplot fill")
            .attr("x", x(left))
            .attr("width", x(right)-x(left))
            .attr("y", probs[3])
            .attr("height", -probs[3]+probs[1])
//            .attr("stroke", "black")
//                        .attr("stroke-width", 2)
            .style("fill", boxColor)
            .style("fill-opacity", 0.5);

        var iS=[0,2,4];
        var iSclass=["","median",""];
        var iSColor=[boxColor, boxInsideColor, boxColor]
        for(var i=0; i<iS.length; i++){
            svg.append("line")
                .attr("class", "boxplot "+iSclass[i])
                .attr("x1", x(left))
                .attr("x2", x(right))
                .attr("y1", probs[iS[i]])
                .attr("y2", probs[iS[i]])
                .style("fill", iSColor[i])
                .style("stroke", iSColor[i]);
        }

        var iS=[[0,1],[3,4]];
        for(var i=0; i<iS.length; i++){
            svg.append("line")
                .attr("class", "boxplot")
                .attr("x1", x(0.5))
                .attr("x2", x(0.5))
                .attr("y1", probs[iS[i][0]])
                .attr("y2", probs[iS[i][1]])
                .style("stroke", boxColor);
        }

        svg.append("rect")
            .attr("class", "boxplot")
            .attr("x", x(left))
            .attr("width", x(right)-x(left))
            .attr("y", probs[3])
            .attr("height", -probs[3]+probs[1])
            .style("stroke", boxColor);

        svg.append("circle")
            .attr("class", "boxplot mean")
            .attr("cx", x(0.5))
            .attr("cy", y(d3.mean(results)))
            .attr("r", x(boxPlotWidth/5))
            .style("fill", boxInsideColor)
            .style("stroke", 'None');

        svg.append("circle")
            .attr("class", "boxplot mean")
            .attr("cx", x(0.5))
            .attr("cy", y(d3.mean(results)))
            .attr("r", x(boxPlotWidth/10))
            .style("fill", boxColor)
            .style("stroke", 'None');

             svg.append("circle")
                        //.attr("class", "boxplot mean")
                        .attr("cx", x(1))
                        .attr("cy", y(d3.mean(results)))
                        .attr("r", 4)
                        .style("fill", 'yellow')
                        .style("stroke", 'red')
                        .style("stroke-width", '2');


}
var margin={top:10, bottom:10, left:30, right:10};

var width=900;
var height=200;
var boxWidth=100;
var boxSpacing=1;
var domain=[-20,20];

var resolution=20;
var d3ObjId="svgElement1";
var interpolation='step-before';

var y = d3.scale.linear()
            .range([height-margin.bottom - margin.top, margin.top])
            .domain(domain);

var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(5)
                .orient("left")
                .tickSize(5,0,5);


var x = d3.time.scale()
    .domain([new Date(), d3.time.day.offset(new Date(), 8)])
    .rangeRound([0, width - margin.left - margin.right]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(d3.time.days, 1)
        .tickFormat(d3.time.format('%a %d'));
        //.tickSize(0)
        //.tickPadding(8);


var svg = d3.select("#"+d3ObjId)
            .append("svg")
                .attr("width", width)
                .attr("height", height);

//svg.append("line")
//    .attr("class", "boxplot")
//    .attr("x1", margin.left)
//    .attr("x2", width-margin.right)
//    .attr("y1", y(0))
//    .attr("y2", y(0));

for(var i=0; i<results.length; i++){
    results[i]=results[i].sort(d3.ascending)
    var g=svg.append("g").attr("transform", "translate("+(i*(boxWidth+boxSpacing)+margin.left)+",0)");
   // addViolin(g, results[i], height, boxWidth, domain, 0.25, "#cccccc");
    addBoxPlot(g, results[i], height, boxWidth, domain, .15, "black", "rgb(116,116,116)");

}

svg.append("g")
    .attr('class', 'axis')
    .attr("transform", "translate("+margin.left+",0)")
    .call(yAxis);

console.log("translate(" + margin.left + "," + (height - margin.bottom)+")");
    svg.append("g")
        .attr('class', 'axis')
        .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom - margin.top)+")")
        .call(xAxis);

var d3ObjId="svgElement2";
var interpolation='basis';

var svg = d3.select("#"+d3ObjId)
            .append("svg")
                .attr("width", width)
                .attr("height", height);

//svg.append("line")
//    .attr("class", "boxplot")
//    .attr("x1", margin.left)
//    .attr("x2", width-margin.right)
//    .attr("y1", y(0))
//    .attr("y2", y(0));

//for(var i=0; i<results.length; i++){
//    results[i]=results[i].sort(d3.ascending)
//    var g=svg.append("g").attr("transform", "translate("+(i*(boxWidth+boxSpacing)+margin.left)+",0)");
//    //addViolin(g, results[i], height, boxWidth, domain, 0.25, "#cccccc");//"#cccccc");
//    addBoxPlot(g, results[i], height, boxWidth, domain, .15, "purple", "rgb(116,116,116)");
//
//}
//
//svg.append("g")
//    .attr('class', 'axis')
//    .attr("transform", "translate("+margin.left+",0)")
//    .call(yAxis);
