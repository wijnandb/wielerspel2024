// Initialize the chart
let ridersChart;

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

    if (!groupedData[result.rider_name]) {
      groupedData[result.rider_name] = 0;
    }

    groupedData[result.rider_name] += result.points;
  });

  // Sort riders by points and take the top 20
  const sortedRiders = Object.keys(groupedData).sort((a, b) => groupedData[b] - groupedData[a]).slice(0, 20);

  // Prepare data for the chart
  const chartData = {
    labels: sortedRiders,
    datasets: [{
      label: 'Punten',
      data: sortedRiders.map(rider => groupedData[rider]),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  updateChart(chartData);
}

function updateChart(data) {
  const ctx = document.getElementById('ridersChart').getContext('2d');

  if (ridersChart) {
    ridersChart.destroy();
  }

  ridersChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
