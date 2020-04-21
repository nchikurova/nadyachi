d3.csv("../data_project2/1979.csv", d3.autoType).then(data => {
    // from http://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
    const slices = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {
                    Age: d.Age,
                    measurement: +d[id]

                };
            })
        };
    });

    // console.log("Column headers", data.columns);
    // console.log("Column headers without age", data.columns.slice(1));
    // // returns the sliced dataset
    // console.log("Slices", slices);
    // // returns the first slice
    // console.log("First slice", slices[0]);
    // // returns the array in the first slice
    // console.log("A array", slices[0].values);
    // // returns the date of the first row in the first slice
    // console.log("Age element", slices[0].values[0].Age);
    // // returns the array's length
    // console.log("Array length", (slices[0].values).length);
    // console.log(data);

    /** CONSTANTS */
    // constants help us reference the same values throughout our code
    const width1 = 400,
        height1 = 250,

        margin1 = { top: 5, bottom: 40, left: 40, right: 0 };

    axisTicksX = { qty: 20 };
    axisTicksY = { qty: 10 };
    /** SCALES */
    // reference for d3.scales: https://github.com/d3/d3-scale
    const xScale1 = d3
        .scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d.Age
        }))
        .range([margin1.left, width1 - margin1.right]);
    //console.log(xScale1)

    const yScale1 = d3
        .scaleLinear()
        //.domain(d3.extent(data, d => d.b1))
        .domain([0, 0.16])
        .range([height1 - margin1.bottom, margin1.top]);

    console.log(yScale1)

    const xAxis1 = d3.axisBottom(xScale1).ticks(axisTicksX.qty);

    const yAxis1 = d3.axisLeft(yScale1)
        .ticks((slices[0].values).length).ticks(axisTicksY.qty);
    console.log(yAxis1)
    // colorScale = d3.scaleLinear().range(["beighe", "red"]).domain(d3.map(data, d => d.b))

    /** MAIN CODE */
    const svg1 = d3
        .select("#d3-container1")
        .append("svg")
        .attr("width", width1)
        .attr("height", height1);

    // append dots and lines
    const lineFunc1 = d3.line()
        .x(function (d) { return xScale1(d.Age); })
        .y(function (d) { return yScale1(d.measurement); });

    let id = 0;
    const ids = function () {
        return "line-" + id++;
    }
    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale1)
            .ticks(10)
    }
    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale1)
            .ticks(8)
    }

    const lines1 = svg1
        .selectAll("lines")
        .data(slices)
        .enter()
        .append("g")

    lines1.append("path")
        .attr("class", ids)
        .attr("d", function (d) { return lineFunc1(d.values); });

    svg1
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height1 - margin1.bottom})`)
        .call(xAxis1)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Age");
    svg1
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin1.left},0)`)
        .call(yAxis1)

    //adding title   
    svg1
        .append("text")
        .attr("x", width1 / 2)
        .attr("y", 25)
        // .attr("class", "title")
        .style("font-color", "black")
        .style("font-size", "22px")
        .text("1979");

    // add the X gridlines
    svg1.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height1 - margin1.bottom})`)
        .call(make_x_gridlines()
            .tickSize(-height1)
            .tickFormat("")
        )
    // add the Y gridlines
    svg1.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin1.left},0)`)
        // .attr("transform", `translate(40,0)`)
        .call(make_y_gridlines()
            .tickSize(- width1)
            .tickFormat("")
        )
});
