
var cameraPromise = d3.csv("camera csv.csv");
cameraPromise.then(function(cameras)
{
    console.log("camera data",cameras);
    
    var screen = {width:800, height:700};
    
    var margins = {top:15,bottom:40,left:70,right:15};
   

    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }

    var xScale = d3.scaleLinear()
            .domain([0,24])
            .range([0,graph.width])

        var yScale = d3.scaleLinear()
            .domain([0,100])
            .range([graph.height,0])

    var colors = ["gold", "silver", "red"]
    
    
    var series = initGraph("svg",cameras,margins);
    drawStack(cameras,graph,xScale,yScale,series,colors)

    createAxes(screen,margins,graph, "svg",xScale,yScale);
    
    

//var error = function(err)
//{
//   console.log("Error Loading data:",err);
//}
 
});




 var initGraph = function(target,cameras,margins)
{
  
    
    var svg = d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height);
    
    console.log(svg);
    

    var g = d3.select(target)
        .selectAll("g")
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");

    var stack = d3.stack() 
    .keys([ "Megapixels", "4K Video", "Slow Motion" ]);
    
    series = stack(cameras); 
    return series;
}
 
 
 
 
 var drawStack = function(cameras,graph,xScale,yScale,series,colors)
 {
     console.log("series;")
     console.log(series)
    var svg = d3.select("svg")      
    var groups = svg.selectAll("g")    
    .data(series)    
    .enter()    
    .append("g")    
    .style("fill", function(d, i) 
           {        
        return colors[i];   
            });

     //1
     var rects = groups.selectAll("rect")    
     .data(function(d) 
           { 
                return d; 
           })
     .enter()    
     .append("rect")    
     .attr("x", function(d, i) 
           {        
         return xScale(i);    
          })    
     .attr("y", function(d) 
           {       
         console.log("d=",d)
         return graph.height- yScale(d[0]);
           })    
     .attr("height", function(d) 
           {        
         return yScale(d[1]-d[0]);
          })    
     .attr("width", graph.width/24);
};
 
 



var clearScatter = function(target)
{
    d3.select(target)
        .select("svg")
        .selectAll("rect")
        .remove();
}





var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
};



