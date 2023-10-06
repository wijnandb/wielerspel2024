// Initialize the chart
let teamCaptainChart;
let allData;

// Fetch and parse the CSV file
async function fetchDataAndPopulate() {
    try {
      const response = await fetch('/assets/data/results_with_points.csv');
      const csvString = await response.text();
      Papa.parse(csvString, {
        header: true,
        dynamicTyping: true,
        complete: function(parsedResults) {
          allData = parsedResults.data;
          populateTeamCaptains(allData);
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

function populateTeamCaptains(data) {
    const teamCaptainSelect = document.getElementById('teamCaptainSelect');
    const uniqueTeamCaptains = [...new Set(data.map(item => item.ploegleider))].sort();

    // Get teamcaptain from URL if available
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const urlTeamCaptain = params.get('teamcaptain');

    uniqueTeamCaptains.forEach(tc => {
        if (tc && tc !== 'undefined') {
        const option = document.createElement('option');
        option.value = tc;
        option.text = tc;
        teamCaptainSelect.appendChild(option);
        }
    });

    // Pre-select team captain from URL if available
    if (urlTeamCaptain && uniqueTeamCaptains.includes(urlTeamCaptain)) {
        teamCaptainSelect.value = urlTeamCaptain;
        displayData(urlTeamCaptain);
    } else {
        // Initialize with the first team captain
        displayData(uniqueTeamCaptains[0]);
    }

    // Populate month select box
    const monthSelect = document.getElementById('monthSelect');
    const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober'];
    const currentMonth = new Date().getMonth() + 1; // 1-based month index
  
    months.forEach((month, index) => {
      if (index + 1 <= currentMonth) { // Only include up to the current month
        const option = document.createElement('option');
        option.value = index + 1; // 1-based month index
        option.text = month;
        monthSelect.appendChild(option);
      }
    });
  
    // Set the current month as the default selected month
    monthSelect.value = currentMonth;

  // Add event listener for team captain selection
    teamCaptainSelect.addEventListener('change', function() {
        displayData(this.value);
    });

  // Add event listener for month selection
  monthSelect.addEventListener('change', function() {
    displayData(teamCaptainSelect.value, parseInt(this.value));
  });

  // Initialize with the first team captain and current month
//   const currentMonth = new Date().getMonth() + 1; // 1-based month index
//   console.log(currentMonth);
   displayData(uniqueTeamCaptains[0], currentMonth);
}


// Display data for the selected team captain and month
function displayData(selectedTeamCaptain, selectedMonth = getCurrentMonth()) {
    const filteredData = allData.filter(item => item.ploegleider === selectedTeamCaptain);
    const monthlyPoints = calculateMonthlyPoints(filteredData);
    updateChart(monthlyPoints);
    displayLatestResults(filteredData, selectedMonth, selectedTeamCaptain);
  }
  
// Calculate monthly points
function calculateMonthlyPoints(data) {
    const monthlyPoints = Array(10).fill(0);
    data.forEach(item => {
        const date = new Date(item.date);
        const month = date.getMonth();
        monthlyPoints[month] += item.points;
    });
    return monthlyPoints;
    }
  

function updateChart(data) {
  const ctx = document.getElementById('teamCaptainChart').getContext('2d');

  if (teamCaptainChart) {
    teamCaptainChart.destroy();
  }

  teamCaptainChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober'],
      datasets: [{
        label: 'Punten per maand',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    }
  });
}

function displayLatestResults(data, selectedMonth, selectedTeamCaptain) {
    // Update the span with the selected team captain
    const ploegleiderSpan = document.getElementById('ploegleider');

    if (selectedTeamCaptain === "-") {
      ploegleiderSpan.textContent = "Niet verkochte renners";
  } else {
      ploegleiderSpan.textContent = selectedTeamCaptain;
  }
  
    // Get the name of the selected month
    const monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober'];
    const selectedMonthName = monthNames[selectedMonth - 1];
  
    const latestResultsDiv = document.getElementById('latestResults');
    latestResultsDiv.innerHTML = `<h2>Uitslagen  ${selectedMonthName}</h2>`;
  
    // Create a table element and add class
    const table = document.createElement('table');
    table.className = 'table table-striped';
  
    // Create header row and append to table
    const headerRow = document.createElement('tr');
    ['datum', '#', 'renner', 'race', 'categorie', 'ploegleider', 'pnt.', 'jpp'].forEach(text => {
      const headerCell = document.createElement('th');
      headerCell.textContent = text;
      headerRow.appendChild(headerCell);
    });
    table.appendChild(headerRow);
  
    // Filter data by the selected month
    const filteredData = data.filter(item => {
      const date = new Date(item.date);
      return date.getMonth() + 1 === selectedMonth;
    });
  
    // Sort data by date
    const sortedData = filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    sortedData.forEach(result => {
        const row = document.createElement('tr');
      
        // Transform the date to dd-mm format
        const date = new Date(result.date);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}`;
      
        // Change any negative rank to 1
        const rank = Math.max(1, result.rank);
      
        // Create cells for each field and append to the row
        [formattedDate, rank, result.rider_name, result.racename, result.category, result.ploegleider, result.points, result.jpp].forEach(text => {
          const cell = document.createElement('td');
          cell.textContent = text;
          row.appendChild(cell);
        });
      
        // Append the row to the table
        table.appendChild(row);
      });
  
    // Append the table to the latestResultsDiv
    latestResultsDiv.appendChild(table);
  }

// Get the current month
function getCurrentMonth() {
    return new Date().getMonth() + 1;
  }  

  // Fetch the data and populate the team captains when the page loads
fetchDataAndPopulate();
