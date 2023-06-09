// Add title out of SVG area
let title = d3.select("body")
                .append("div")
                .attr("id","title")
                .text("Doping in Professional Bicycle Racing")

let width = 1000
let height = 600
let padding = 40

// Set the SVG area
let svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)

// manipulative and very long coding for a legend but look pretty neat :-D
let legend = svg.append("rect")
                .attr("id","legend")
                .attr("x", width - 200)
                .attr("y", height - 440)
                .attr("width",12)
                .attr("height",12)
                .style("fill","green")
let explain = svg.append("text")
                .attr("x",width - 175)
                .attr("y",height - 430)
                .text("No Doping Allegations")

let legend2 = svg.append("rect")
                .attr("x", width - 200)
                .attr("y", height - 420)
                .attr("width",12)
                .attr("height",12)
                .style("fill","red")

let explain2 = svg.append("text")
                    .attr("x",width - 175)
                    .attr("y",height - 410)
                    .text("Doping Allegations")

//shorter legend better coding but does not look pretty neat :-|
//let legend = d3.select("body")
//                .append("div")
//                .attr("id", "legend")
//                .text("Red: Doping ; Green: No Doping")

let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

let req = new XMLHttpRequest()

let values = []

let xScale
let yScale

let generateScale = () => {

    xScale = d3.scaleLinear()
                .range([padding, width-padding])
                .domain([d3.min(values, (item)=>item['Year']-1),
                        d3.max(values, (item)=>item['Year']+1)
                ])

    yScale = d3.scaleTime()
                .range([padding, height-padding])
                .domain([d3.min(values,(item)=> new Date(item['Seconds']*1000)),
                         d3.max(values,(item)=> new Date(item['Seconds']*1000))
                ])

}

let drawPoints = () => {

    let tooltip = d3.select("body")
                .append("div")
                .attr("id","tooltip")
                .style("opacity", 0)

    svg.selectAll("circle")
        .data(values)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("r","6")
        .attr("data-xvalue", (item) => item['Year'])
        .attr("data-yvalue", (item) => new Date(item['Seconds']*1000))
        .attr("cx",(item) => xScale(item['Year']))
        .attr("cy",(item) => yScale(new Date(item['Seconds']*1000)))
        .attr("fill", (item) => item['Doping']=="" ?"green":"red")
        .on("mouseover", (event, item) => {
            tooltip.attr("data-year",item['Year'])
                    .transition()
                    .duration(200)
                    .style("opacity", .9)

            if (item['Doping'] == ""){
                    tooltip.text(item['Name'] + ' : ' + item['Nationality'] + ' ' + item['Year'] + ' - ' + 'No Doping Allegations')
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
            } else{
                tooltip.text(item['Name'] + ' : ' + item['Nationality'] + ' ' + item['Year'] + ' - ' + item['Doping'])
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
            }
        })
        .on("mouseout",(event, item) =>{
            tooltip.transition()
                .duration(500)
                .style("opacity",0)
        })

}

let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))

    let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat('%M:%S'))

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, "+(height-padding)+")")

    svg.append("g")
        .call(yAxis)
        .attr("id","y-axis")
        .attr("transform","translate("+padding+")",0)

}

req.open('GET', url, true)
req.send()
req.onload = () =>{
    values = JSON.parse(req.responseText)
    generateScale()
    drawPoints()
    generateAxes()
}
