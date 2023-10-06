// Load the CSV data
d3.csv('/assets/data/riders_with_points.csv')
  .then(data => {
    createDivergingStackedBarChart(data);
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

// Function to create the Diverging Stacked Bar Chart
function createDivergingStackedBarChart(data) {
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Extract object names from data for x-axis labels
  const objectNames = data.map(d => d.object);

  // Create an ordinal scale for the x-axis
  const xScale = d3
    .scaleBand()
    .domain(objectNames)
    .range([0, width])
    .padding(0.1);

  // Extract 'kosten' and 'punten' values from data for y-axis domain
  const kostenValues = data.map(d => +d.kosten);
  const puntenValues = data.map(d => +d.punten);

  // Calculate the maximum absolute value for y-axis domain
  const maxAbsoluteValue = Math.max(
    Math.abs(d3.max(kostenValues)),
    Math.abs(d3.max(puntenValues))
  );

  // Create a linear scale for the y-axis with the maximum absolute value
  const yScale = d3
    .scaleLinear()
    .domain([-maxAbsoluteValue, maxAbsoluteValue])
    .range([height, 0]);

  // Create an SVG element
  const svg = d3
    .select('#divergingStackedBarChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Define your data processing logic here to transform data if needed
  // For example, you can convert the 'kosten' and 'punten' strings to numbers

  // Create scales, axes, and layout for your chart
  // ...

  // Create D3 selections and data binding to visualize your data
  // ...

  // Add interactivity (e.g., tooltips, hover effects, animations)
  // ...

  // Example: Adding two segments (kosten and punten) to each bar
  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.object))
    .attr('y', d => (d.kosten < 0 ? yScale(d.kosten) : yScale(0)))
    .attr('width', xScale.bandwidth())
    .attr('height', d => (d.kosten < 0 ? Math.abs(yScale(d.kosten) - yScale(0)) : 0))
    .attr('fill', 'red'); // Kosten bars are displayed in red

  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.object))
    .attr('y', d => (d.punten > 0 ? yScale(d.punten) : yScale(0)))
    .attr('width', xScale.bandwidth())
    .attr('height', d => (d.punten > 0 ? Math.abs(yScale(d.punten) - yScale(0)) : 0))
    .attr('fill', 'green'); // Punten bars are displayed in green
}
