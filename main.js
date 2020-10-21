// sort direction for bars in bar chart
// 0 for ascending, 1 for descending
let sort_type = 0
// data category to group by 
// either 'stores' or 'revenue'
let category = 'stores'

const m = 80
const margin = ({ top: m, right: m, bottom: m, left: m })
const width = 800 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

// CHART INIT ------------------------------
const svg = d3.select('.chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const xScale = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.1)

const yScale = d3.scaleLinear()
    .rangeRound([0, height])

svg.append('g').attr('class', 'axis y-axis')
svg.append('g').attr('class', 'axis x-axis')

yAxisLabel = svg.append('text')
    .attr('x', -70)
    .attr('y', -10)
    .attr('fill', '#876957')
    .text('Number of Stores')


// CHART UPDATE FUNCTION -------------------
function update(data, category) {

    // update data
    category = document.querySelector('#category').value
    data = data.sort(function (a, b) {
        if (sort_type == 0) return a[category] - b[category]
        if (sort_type == 1) return b[category] - a[category]
    })

    // update domains
    xScale.domain(data.map(d => d.company))
    yScale.domain(d3.extent(data, d => d[category]))

    const xAxis = d3.axisBottom().scale(xScale).ticks(5, 's')
    const yAxis = d3.axisLeft().scale(yScale).ticks(5, 's')

    // update axes 
    yAxisLabel.text(function () {
        if (category == 'stores') return 'Number of Stores'
        if (category == 'revenue') return 'Revenue in Billions ($)'
    })

    svg.select('.x-axis')
        .transition()
        .duration(1000)
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

    svg.select('.y-axis')
        .transition()
        .duration(900)
        .call(yAxis)

    svg.selectAll('rect')
        .transition()
        .duration(1000)
        .attr('x', d => xScale(d.company))
        .attr('y', d => height - yScale(d[category]))
        .attr('height', d => yScale(d[category]))
        .attr('width', 50)
}

// CHART UPDATES ---------------------------
d3.csv('coffee-house-chains.csv', d3.autoType).then(data => {
    console.log('data', data)

    data = data.sort(function (a, b) {
        if (sort_type == 0) return a[category] - b[category]
        if (sort_type == 1) return b[category] - a[category]
    })

    xScale.domain(data.map(d => d.company))
    yScale.domain(d3.extent(data, d => d[category]))

    svg.select('.x-axis')
        .transition()
        .duration(0)
        .attr('transform', `translate(0, ${height})`)

    svg.selectAll('rect')
        .remove()
        .exit()
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'rect')
        .attr('fill', '#876957')
        .attr('x', d => xScale(d.company))
        .attr('y', d => height - yScale(d[category]))
        .attr('height', d => yScale(d[category]))
        .attr('width', 50)

    update(data, category)

    // EVENT LISTENERS
    document.querySelector('#category').addEventListener('change', () => {
        update(data, category)
    })
    document.querySelector('#sort').addEventListener('click', () => {
        sort_type == 0 ? sort_type = 1 : sort_type = 0
        update(data, category)
    })

})