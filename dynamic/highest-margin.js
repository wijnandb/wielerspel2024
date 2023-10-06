// Initialize the chart
let ridersChart;

// Fetch and parse the CSV file from a given URL
fetch('/assets/data/riders_with_points.csv')
  .then(response => response.text())
  .then(csvString => {
    Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
      complete: function(parsedResults) {
        const results = parsedResults.data;
        calculateAndDisplayMargins(results);
      }
    });
  });

function calculateAndDisplayMargins(results) {
  const groupedData = {};

  results.forEach(result => {
    if (!result.rider || result.rider === "undefined") return;

    if (!groupedData[result.rider]) {
      groupedData[result.rider] = { points: 0, kosten: 0 };
    }

    groupedData[result.rider].points += result.punten;
    groupedData[result.rider].kosten += result.kosten;
  });

  // Calculate margins and sort riders
  const sortedRiders = Object.keys(groupedData).map(rider => {
    const margin = groupedData[rider].points - groupedData[rider].kosten;
    return { rider, margin, points: groupedData[rider].points, kosten: groupedData[rider].kosten };
  }).sort((a, b) => b.margin - a.margin).slice(0, 20);

  // Prepare data for the chart
  const chartData = {
    labels: sortedRiders.map(r => r.rider),
    datasets: [
      {
        label: 'Kosten',
        data: sortedRiders.map(r => r.kosten),
        stack: 'Stack 0',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Profit',
        data: sortedRiders.map(r => r.margin),
        stack: 'Stack 0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Points',
        data: sortedRiders.map(r => r.points),
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }
    ]
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
          beginAtZero: true,
          stacked: true  // Enable stacking
        }
      }
    }
  });
}
