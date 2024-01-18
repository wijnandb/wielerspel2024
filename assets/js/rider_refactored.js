document.addEventListener("DOMContentLoaded", function () {
    // Function to extract RiderID from the URL
    function getRiderIDFromURL() {
      const urlParts = window.location.href.split("/");
      const riderIDIndex = urlParts.indexOf("renners") + 2;
  
      // Check if RiderID is found in the URL
      if (riderIDIndex >= 0 && riderIDIndex < urlParts.length) {
        return urlParts[riderIDIndex];
      } else {
        return null; // RiderID not found in the URL
      }
    }
  
    // Function to fetch and update rider data
    function updateRiderData(riderID) {
      console.log("Updating rider data with riderID:", riderID);
      // Fetch the cyclist data and display it based on the RiderID
      fetch("/assets/data/renners.json") // Adjust the path as needed
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched cyclist data:", data);
          const jsonData = data.find((item) => item.RiderID === riderID);
  
          if (jsonData) {
            // Calculate birthdate and age
            const { formattedBirthdate, age } = calculateBirthdateAndAge(jsonData.UCICode);
            console.log("Formatted birthdate:", formattedBirthdate);
            console.log("Age:", age);
            // Render data to HTML
            document.getElementById("riderPhoto").src = generateRiderPhotoURL(jsonData.RiderID);
            document.getElementById("flag").src = `/assets/img/flags/${jsonData.Nationality}.png`;
            document.getElementById("flag").alt = jsonData.Nationality;
            document.getElementById("flag").title = jsonData.Nationality;
            document.getElementById("birthdate").textContent = formattedBirthdate;
            document.getElementById("age").textContent = `${age} jaar`;
            document.getElementById("riderName").textContent = jsonData.Name;
            document.getElementById("teamLink").href = `https://cqranking.com/men/asp/gen/team.asp?year=2024&teamcode=${jsonData.Team}`;
            document.getElementById("teamLink").textContent = jsonData.Team;
            document.getElementById("CQLink").href = `https://cqranking.com/men/asp/gen/rider.asp?riderid=${jsonData.RiderID}`;
            document.getElementById("PCSLink").href = `https://www.procyclingstats.com/rider/${jsonData.Team}`;
            document.getElementById("FirstCyclingLink").href = `https://firstcycling.com/rider.php?r=${jsonData.FirstCyclingRider_id}`;
          } else {
            console.error("Rider not found!");
          }
        })
        .catch((error) => {
          console.error("Error fetching cyclist data:", error);
        });
    }
  
    // Function to fetch and update rider results data
    function updateRiderResultsData(riderID) {
      console.log("Updating rider results data with riderID:", riderID);
      // Fetch the rider's results data based on RiderID
      fetch("/assets/data/history_teams_with_earnings.json") // Adjust the path as needed
        .then((response) => response.json())
        .then((resultsData) => {
          console.log("Fetched rider results data:", resultsData);
          // Filter results for the specific RiderID
          const riderResults = resultsData.filter((item) => item.rider_id === riderID);
  
          if (riderResults.length > 0) {
            // Sort the results by edition in descending order
            riderResults.sort((a, b) => b.edition - a.edition);
  
            // Get the rider's full name from the first result (assuming it's the same for all years)
            const riderFullName = riderResults[0].rider;
            console.log("Rider full name:", riderFullName);
  
            // Separate first names and last names based on capitalization
            const nameParts = riderFullName.split(' ');
            let firstNames = [];
            let lastNames = [];
            nameParts.forEach((part) => {
              if (part === part.toUpperCase()) {
                // If the part is in all capitals, it's a last name
                lastNames.push(part);
              } else {
                // If not all capitals, it's a first name
                firstNames.push(part);
              }
            });
  
            // Join the first names and last names
            const formattedRiderName = firstNames.join(' ') + ' ' + lastNames.join(' ');
            console.log("Formatted rider name:", formattedRiderName);
  
            // Display the formatted rider name
            document.getElementById("riderNameResults").textContent = formattedRiderName;
  
            // Render each result in the table
            const resultsTableBody = document.getElementById("resultsTableBody");
            riderResults.forEach((result) => {
              const row = document.createElement("tr");
              row.innerHTML = `
                <td>${result.edition}</td>
                <td>${result.ploegleider}</td>
                <td>${result.kosten}</td>
                <td>${result.punten}</td>
                <td class="${result.punten - result.kosten >= 0 ? 'text-success' : 'text-danger'}">
                  ${(result.punten - result.kosten).toFixed(1)}
                </td>
              `;
              resultsTableBody.appendChild(row);
            });
          } else {
            console.error("No results found for the rider!");
          }
        })
        .catch((error) => {
          console.error("Error fetching rider results:", error);
        });
    }
  
    // Function to handle changes to the riderID in the URL
    function handleRiderIDChange() {
      const newRiderID = getRiderIDFromURL();
      console.log("New RiderID from URL:", newRiderID);
      if (newRiderID) {
        // Update rider data and results data with the new riderID
        updateRiderData(newRiderID);
        updateRiderResultsData(newRiderID);
      }
    }
  
    // Add an event listener for the window.onpopstate event
    window.onpopstate = function(event) {
      // Handle changes to the riderID in the URL
      handleRiderIDChange();
    };
  
    // Initial page load: Handle the riderID in the URL
    const initialRiderID = getRiderIDFromURL();
    console.log("Initial RiderID from URL:", initialRiderID);
    if (initialRiderID) {
      // Update rider data and results data with the initial riderID
      updateRiderData(initialRiderID);
      updateRiderResultsData(initialRiderID);
    }
  });
  