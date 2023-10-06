let results = [];
const csvUrl = 'results_with_points.csv';

// Fetch and parse the CSV file from a given URL
fetch(csvUrl)
  .then(response => response.text())
  .then(csvString => {
    Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
      complete: function(parsedResults) {
        results = parsedResults.data;
        populateMonthOptions();
        calculateAndDisplayPoints();
      }
    });
  });

function populateMonthOptions() {
  const monthSelect = document.getElementById('month');
  const months = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober'
  ];
  months.forEach((month, index) => {
    const option = document.createElement('option');
    option.value = index + 1;
    option.text = month;
    monthSelect.appendChild(option);
  });
}


function updateMonthName(selectedMonthIndex) {
    const monthNames = [
      'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober'
    ];
    
    const selectedMonthName = monthNames[selectedMonthIndex - 1];
    
    // List of all span IDs where you want to display the month name
    const monthSpanIds = ['monthName0','monthName1', 'monthName2']; // Add more IDs as needed
    
    monthSpanIds.forEach(id => {
      const monthSpan = document.getElementById(id);
      monthSpan.textContent = selectedMonthName;
    });
  }

function calculateAndDisplayPoints() {
    const selectedMonth = document.getElementById('month').value;
  
    // Update the clickable months
    updateClickableMonths(parseInt(selectedMonth));

    // Update the month name in all required locations
    updateMonthName(selectedMonth);

    const groupedData = {};

    results.forEach(result => {
        if (result.ploegleider === "-" || result.ploegleider === "undefined") return;

        const date = new Date(result.date);
        if (!groupedData[result.ploegleider]) {
        groupedData[result.ploegleider] = { totalPoints: 0, totalJpp: 0, monthlyPoints: 0, monthlyJpp: 0 };
        }

        if (selectedMonth && (date.getMonth() + 1) === parseInt(selectedMonth)) {
        groupedData[result.ploegleider].monthlyPoints += result.points;
        groupedData[result.ploegleider].monthlyJpp += result.jpp;
        }

        if (!selectedMonth || (date.getMonth() + 1) <= parseInt(selectedMonth)) {
        groupedData[result.ploegleider].totalPoints += result.points;
        groupedData[result.ploegleider].totalJpp += result.jpp;
        }
  });

  const sortedData = Object.entries(groupedData)
    .map(([ploegleider, { totalPoints, totalJpp, monthlyPoints, monthlyJpp }]) => ({ ploegleider, totalPoints, totalJpp, monthlyPoints, monthlyJpp }))
    .sort((a, b) => b.totalPoints - a.totalPoints || b.totalJpp - a.totalJpp);

  const tbody = document.getElementById('result').querySelector('tbody');
  tbody.innerHTML = '';

  sortedData.forEach((entry, index) => {
    if (entry.ploegleider === "undefined" || isNaN(entry.totalPoints) || isNaN(entry.totalJpp)) return;

    const rank = index + 1;
    const row = tbody.insertRow();
  
    const cell1 = row.insertCell(0);
    cell1.textContent = rank;
    //cell1.classList.add("text-center"); // Add class here
  
    const cell2 = row.insertCell(1);
    cell2.textContent = entry.ploegleider;
    //cell2.classList.add("text-center"); // Add class here
  
    const cell3 = row.insertCell(2);
    cell3.textContent = entry.totalPoints.toFixed(1);
    cell3.classList.add("text-center"); // Add class here
  
    const cell4 = row.insertCell(3);
    cell4.textContent = entry.totalJpp;
    cell4.classList.add("text-center"); // Add class here
  
    const cell5 = row.insertCell(4);
    cell5.textContent = entry.monthlyPoints.toFixed(1);
    cell5.classList.add("text-center"); // Add class here
  
    const cell6 = row.insertCell(5);
    cell6.textContent = entry.monthlyJpp;
    cell6.classList.add("text-center"); // Add class here
  });
  
    // Reapply the sorting
    if (lastSortedColumn !== null) {
        sortTable(lastSortedColumn, false);
    }
}


let sortOrder = 1; // 1 for ascending, -1 for descending
let lastSortedColumn = null;

function sortTable(columnIndex, toggleOrder = true) {
    if (toggleOrder) {
        sortOrder = -sortOrder;
      }
  
  // Remove sort arrow from the last sorted column
  if (lastSortedColumn !== null) {
    document.getElementById(`sort-arrow-${lastSortedColumn}`).classList.remove('sort-up', 'sort-down');
  }

  // Add sort arrow to the newly sorted column
  const sortArrow = document.getElementById(`sort-arrow-${columnIndex}`);
  if (sortOrder === 1) {
    sortArrow.classList.add('sort-up');
  } else {
    sortArrow.classList.add('sort-down');
  }

  // Update last sorted column
  lastSortedColumn = columnIndex;

  const table = document.getElementById('result');
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent;
    const cellB = b.cells[columnIndex].textContent;

    if (!isNaN(cellA) && !isNaN(cellB)) {
      return sortOrder * (parseFloat(cellA) - parseFloat(cellB));
    }
    return sortOrder * cellA.localeCompare(cellB);
  });

  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}

// Initialize the chart
let pointsChart;

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


function updateClickableMonths(selectedMonthIndex) {
    const monthNames = [
      'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober'
    ];
    
    const prevMonthElement = document.getElementById('prevMonth');
    const nextMonthElement = document.getElementById('nextMonth');

    // Clear previous and next month elements
    prevMonthElement.textContent = '';
    nextMonthElement.textContent = '';
    
    // Set previous month if selected month is not January
    if (selectedMonthIndex !== 1) {
        const prevMonthIndex = selectedMonthIndex - 1;
        prevMonthElement.textContent = "<<< " + monthNames[prevMonthIndex - 1];
    }
    
    // Set next month if selected month is not October
    if (selectedMonthIndex !== 10) {
        const nextMonthIndex = selectedMonthIndex + 1;
        nextMonthElement.textContent = monthNames[nextMonthIndex - 1] + " >>>";
    }
  }


  function changeMonth(offset) {
    const monthSelect = document.getElementById('month');
    let newMonth = parseInt(monthSelect.value) + offset;
    
    if (newMonth < 1) newMonth = 10;
    if (newMonth > 10) newMonth = 1;
    
    monthSelect.value = newMonth;
    
    // Update the display
    calculateAndDisplayPoints();
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prevMonth').addEventListener('click', function() {
      changeMonth(-1);
    });
  
    document.getElementById('nextMonth').addEventListener('click', function() {
      changeMonth(1);
    });
  });