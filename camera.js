
var cameraPromise = d3.csv("camera csv.csv");
cameraPromise.then(function(cameras)
{
    console.log("camera data",cameras);
    
    var screen = {width:1000, height:500};
    
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
            .domain([0,250])
            .range([graph.height,0])

    var colors = ["gold", "silver", "red"]
    
    
    var series = initGraph("svg",cameras,margins,screen);
    drawStack(cameras,graph,xScale,yScale,series,colors)
    drawToolTip(drawStack)
    createAxes(screen,margins,graph,target,xScale,yScale)
    createLegend(cameras,screen,margins,graph,target,colors)
    
    

//var error = function(err)
//{
//   console.log("Error Loading data:",err);
//}
 
});




 var initGraph = function(target,cameras,margins,screen)
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
    .keys([ "Megapixels", "4K Video FPS", "Slow Motion FPS" ]);
    
    series = stack(cameras); 
    return series;
    
};

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
         return yScale(d[1]);
           })    
     .attr("height", function(d) 
           {        
         return yScale(d[0])-yScale(d[1]);
          }) 
     .on("mouseover",drawToolTip)
     .on("mouseout",function() 
            {
        d3.select("#tooltip")
       .classed("hidden",true);
            })
     .attr("width", graph.width/24);
     
 }
 

var drawToolTip = function(drawStack)
{
    console.log("drawing");
    
    d3.select("#tooltip div")
        .remove();
    
    
    var xPosition = d3.event.pageX;
    var yPosition = d3.event.pageY;

    
    var base = d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPosition+"px")
        .style("left",xPosition+"px")
        .append("div")
        .text(drawStack[1])
          
};

var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select("graph")
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
}




var createLegend = function(cameras,screen,margins,graph,
                             target,colors)
{
    
    var legend = d3.select(target)
        .append("g")
        .classed("legend",true)
        .attr("transform","translate("+
              (margins.left+ 10) +","+
             (margins.top+(graph.height/1.5))+")");
    
    var entries = legend.selectAll("g")
        .data(["Megapixels","4K Video FPS","Slow Motion FPS"])
        .enter()
        .append("g")
        .classed("legendEntry",true)
        .attr("fill",function(d,i)
             {
                return colors[i];
             })
        .attr("transform",function(d,i)
              {
                return "translate(0,"+i*20+")";
              })
              
        entries.append("rect")
                .attr("width",10)
                .attr("height",10)
    
        entries.append("text")
                .text(function(cameras){return cameras;})
                .attr("x",15)
                .attr("y",10)
}