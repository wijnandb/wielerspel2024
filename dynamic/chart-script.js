// Initialize the chart
let pointsChart;

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

  function calculateAndDisplayPoints(results, year=2023) {
    const groupedData = {};
  
    results.forEach(result => {
      if (result.ploegleider === "-" || result.ploegleider === "undefined" || typeof result.ploegleider === "undefined") return;
  
      const date = new Date(result.date);
      const month = date.getMonth() + 1;
  
      if (!groupedData[result.ploegleider]) {
        groupedData[result.ploegleider] = Array(10).fill(0);
      }
  
      if (month <= 10) {
        groupedData[result.ploegleider][month - 1] += result.points;
      }
    });
  
    // Prepare data for the chart
    const chartData = {
      labels: [],
      datasets: []
    };
  
    // Sort team captains alphabetically
    const sortedTeamCaptains = Object.keys(groupedData).sort();
  
    sortedTeamCaptains.forEach((ploegleider) => {
      const color = getRandomColor();
      const dataset = {
        label: ploegleider,
        data: groupedData[ploegleider],
        borderColor: color,
        backgroundColor: color,
        fill: false
      };
      chartData.datasets.push(dataset);
    });
  
    updateChart(chartData);
  }

function updateChart(data) {
  const ctx = document.getElementById('pointsChart').getContext('2d');

  if (pointsChart) {
    pointsChart.destroy();
  }

  pointsChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      scales: {
        x: {
          type: 'category',
          labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober']
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
