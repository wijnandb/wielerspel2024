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
        calculateAndDisplayData(results);
      }
    });
  });

function calculateAndDisplayData(results) {
  const groupedData = {};

  results.forEach(result => {
    if (!result.rider || result.rider === "undefined") return;

    if (!groupedData[result.rider]) {
      groupedData[result.rider] = { points: 0, kosten: 0 };
    }

    groupedData[result.rider].points += result.punten;
    groupedData[result.rider].kosten = result.kosten; // Set kosten once per rider
  });

  // Calculate profit and profit percentage, then sort riders
  const sortedRiders = Object.keys(groupedData).map(rider => {
    const points = groupedData[rider].points;
    let kosten = groupedData[rider].kosten;

    // Handle cases where kosten is 0
    if (kosten === 0) {
      kosten = 1; // Set kosten to 1
    }

    const profit = points - kosten;
    const profitPercentage = ((profit / kosten) * 100).toFixed(2); // Calculate profit percentage and round to 2 decimal places
    return { rider, profit, profitPercentage, points, kosten };
  }).sort((a, b) => b.profit - a.profit).slice(0, 20);

  // Prepare data for the chart
  const chartData = {
    labels: sortedRiders.map(r => r.rider), // Label with rider names
    datasets: [
      {
        label: 'Marge',
        data: sortedRiders.map(r => r.profit), // Bar height represents profit
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverLabel: sortedRiders.map(r => [
          `Rendement: ${r.profitPercentage}%`,
          `Punten: ${r.points}`,
          `Kosten: ${r.kosten}`,
          `Winst: ${r.profit.toFixed(1)}`
        ])
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
        x: {
          beginAtZero: true,
          stacked: false,
          title: {
            display: true,
            text: 'Rider Name' // X-axis label
          }
        },
        y: {
          beginAtZero: true,
          stacked: false // Disable stacking for better visibility
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              // Return an array of strings for multi-line tooltip
              return context.dataset.hoverLabel[context.dataIndex];
            }
          }
        }
      }
    }
  });
}
