// Initialize the chart
let monthlyRidersChart;

// Fetch and parse the CSV file from a given URL
fetch('/assets/data/results_with_points.csv')
  .then(response => response.text())
  .then(csvString => {
    Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
      complete: function(parsedResults) {
        const results = parsedResults.data;
        calculateAndDisplayPoints(results);
      }
    });
  });

function calculateAndDisplayPoints(results) {
  const groupedData = {};

  results.forEach(result => {
    if (result.rider_name === "undefined" || typeof result.rider_name === "undefined") return;

    const date = new Date(result.date);
    const month = date.getMonth() + 1;

    if (!groupedData[result.rider_name]) {
      groupedData[result.rider_name] = Array(10).fill(0);
    }

    if (month <= 10) {
      groupedData[result.rider_name][month - 1] += result.points;
    }
  });

  // Sort riders by total points and take the top 15
  const sortedRiders = Object.keys(groupedData).sort((a, b) => {
    const totalPointsA = groupedData[a].reduce((acc, val) => acc + val, 0);
    const totalPointsB = groupedData[b].reduce((acc, val) => acc + val, 0);
    return totalPointsB - totalPointsA;
  }).slice(0, 15);

  // Prepare data for the chart
  const chartData = {
    labels: [],
    datasets: []
  };

  sortedRiders.forEach((rider) => {
    const color = getRandomColor();
    const dataset = {
      label: rider,
      data: groupedData[rider],
      borderColor: color,
      backgroundColor: color,
      fill: false
    };
    chartData.datasets.push(dataset);
  });

  updateChart(chartData);
}

function updateChart(data) {
  const ctx = document.getElementById('monthlyRidersChart').getContext('2d');

  if (monthlyRidersChart) {
    monthlyRidersChart.destroy();
  }

  monthlyRidersChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      scales: {
        x: {
          type: 'category',
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October']
        }
      }
    }
  });
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
