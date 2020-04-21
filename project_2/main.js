//constant and globals
// const width = window.innerWidth * 0.7,
//     height = window.innerHeight * 0.7,
const margin = { top: 20, bottom: 50, left: 60, right: 40 },
    width = 600 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom,
    radius = 3;
default_selection = [];
//axisTicks = { qty: 9 };
//let
let svg;
let xScale;
let yScale;

//application state
let state = {
    data: [],
    selection: []
};
//load data
d3.csv("data_project2/Fertility_tables.csv",
    d3.autoType)
    .then(data => data.map(d => ({
        Year: d.Year,
        Age: d.Age,

        b1: d.b1,
        b2: d.b2,
        b3: d.b3,
        b4: d.b4,
        b5p: d.b5p,
    })))
    .then(raw_data => {
        console.log("raw_data", raw_data);
        state.data = raw_data;
        init();

    });

//initializion function
function init() {

    b = ["b1", "b2", "b3", "b4", "b5p"]
    xScale = d3
        .scaleLinear()
        .domain(d3.extent(state.data, d => d.Age))
        .range([margin.left, width - margin.right]);

    //console.log(xScale.domain())
    yScale = d3
        .scaleLinear()
        .domain(d3.extent(state.data, d => d.b1))
        .range([height - margin.bottom, margin.top]);
    console.log(yScale.domain())
    // axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const buttons = d3.selectAll("input");
    buttons.on("change", function (d) {
        state.selection = this.value;
        draw();
    });
    // buttons
    //     .selectAll("option")
    //     .data([
    //         "1979", "1989", "2002", "2010"
    //     ])
    //     .join("option")
    //     .attr("value", d => d)
    //     .text(d => d);

    buttons.property("value", default_selection)
    //create svg element

    svg = d3
        .select("#d3-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // add axis

    svg
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)

    svg
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .append("text")
        .attr("class", "axis-label")


    // div = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0)
    draw();
};
// draw function calls every time data updates

function draw() {

    let filteredData = state.data;
    console.log(filteredData)
    if (state.selection !== ["All"]) {
        filteredData = state.data.filter(d => d.Year === state.selection);
    }
    console.log(state.selection)
    // console.log(filteredData)


    const lineFunc = d3
        .line()
        .x(d => xScale(d.Age))
        .y(d => yScale(d.b1))

    const dot = svg
        .selectAll(".dot")
        .data(filteredData, d => d.Year)

        .join(
            enter =>
                enter
                    .append("circle")
                    .attr("class", "dot")
                    .attr("fill", "brown")
                    .attr("r", radius)
                    .attr("cy", d => yScale(d.b))
                    .attr("cx", d => xScale(d.Age)),
            update => update,
            exit => exit.call(exit =>
                // exit selections -- all the `.dot` element that no longer match to HTML elements
                exit
                    .transition()
                    .delay(1000)
                    .duration(500)
                    .attr("cy", height - margin.bottom)
                    .remove()
            ).remove()
        )
        .call(
            selection =>
                selection
                    .transition() // initialize transition
                    .duration(1000) // duration 1000ms / 1s
                    .attr("cx", d => xScale(d.Age)) // started from the bottom, now we're here
        );

    const line = svg
        .selectAll("path.trend")
        .data(filteredData, d => d.Year)
        .join(
            enter =>
                enter
                    .append("path")
                    .attr("class", "trend")
                    .attr("opacity", 0),
            update => update,
            exit => exit.remove()
        )
        .call(selection_dots =>
            selection_dots
                .transition()
                .duration(1000)
                // .delay(1000)
                // .remove()
                .attr("opacity", 0.8)
                .attr("fill", "brown")
                .attr("d", d => lineFunc(d.b1)) // 1 is position of d after passing d3.groups
        );

    // const lineFunc1 = d3
    //     .line()
    //     .x(d => xScale(d.Date))
    //     .y(d => y1Scale(d.Total_cases))

    //.y(d => yScale(d.Total_cases))
    //.y0(yScale(0));
    //console.log(filteredData);
    // const dot1 = svg
    //     .selectAll(".dot1")
    //     .data(filteredData, d => d.Total_cases)
    //     .join(
    //         enter =>
    //             enter
    //                 .append("circle")
    //                 .attr("class", "dot1")
    //                 .attr("fill", " none")
    //                 .attr("stroke", " black")
    //                 // lines 230 and 231 make circles empty
    //                 .attr("r", radius)
    //                 .attr("cy", d => y1Scale(d.Total_cases))
    //                 .attr("cx", d => xScale(d.Date))
    //                 .on("mouseover", function (d) {
    //                     div.transition()
    //                         .duration(200)
    //                         .style("opacity", 1)
    //                     div.html()
    //                         .style("left", (d3.event.pageX) + "px")
    //                         .style("top", (d3.event.pageY - 28) + "px")

    //                 })
    //                 .on("mouseout", function (d) {
    //                     div.transition()
    //                         .duration(200)
    //                         .style("opacity", 0)
    //                 }),
    //         update => update,
    //         exit => exit.call(exit =>
    //             // exit selections -- all the `.dot` element that no longer match to HTML elements
    //             exit
    //                 .transition()
    //                 // .delay(d => d.Date)
    //                 .delay(1000)
    //                 .duration(500)
    //                 .attr("cy", height - margin.bottom)
    //                 .remove()
    //         ).remove()
    //     )
    //     .call(
    //         selection =>
    //             selection
    //                 .transition() // initialize transition
    //                 .duration(1000) // duration 1000ms / 1s
    //                 .attr("cx", d => xScale(d.Date)) // started from the bottom, now we're here
    //     );

    // const line1 = svg
    //     .selectAll("path.trend")
    //     .data(d3.groups(filteredData, d => d.Country))
    //     .join(
    //         enter =>
    //             enter
    //                 .append("path")
    //                 .attr("class", "trend")
    //                 .attr("opacity", 1)
    //                 .attr("fill", "black")
    //                 .attr("stroke", 3),
    //         update => update,
    //         exit => exit.remove()
    //     )
    //     .call(selection_dots =>
    //         selection_dots
    //             .transition()
    //             .duration(1000)
    //             // .delay(1000)
    //             // .remove()
    //             .attr("opacity", 0.8)
    //             .attr("fill", "black")
    //             .attr("stroke", 3)
    //             .attr("d", d => lineFunc1(d[1]))
    //     );

}