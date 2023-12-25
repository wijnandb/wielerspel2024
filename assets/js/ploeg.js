var repo_name = "/"; // wielerspel2024/";

document.addEventListener("DOMContentLoaded", function () {
  // Function to extract RiderID from the URL
  function getTeamCaptainFromURL() {
    const urlParts = window.location.href.split("/");
    const teamCaptainIndex = urlParts.indexOf("ploegen") + 3;
    const editionIndex = urlParts.indexOf("ploegen") + 2;

    // Check if teamcaptain is found in the URL
    if (teamCaptainIndex >= 0 && teamCaptainIndex < urlParts.length && urlParts[teamCaptainIndex] !== "") {
      console.log(urlParts[teamCaptainIndex]);
      return urlParts[teamCaptainIndex];
    } else {
        return "Jan";  // teamCaptainIndex not found in the URL
      }

    // Check if editionIndex is found in the URL
    if (editionIndex >= 0 && editionIndex < urlParts.length && urlParts[editionIndex] !== "") {
        console.log(urlParts[editionIndex]);
        return urlParts[editionIndex];
      } else {
          return 2022;  // EditionID not found in URL
        }


  // Extract RiderID from the URL
  const teamCaptainString = getTeamCaptainFromURL();



// Function to fetch and update rider results data
function updateRiderResultsData(riderID) {
  console.log("Updating rider results data with riderID:", riderID);
  // Fetch the rider's results data based on RiderID
  fetch(`${repo_name}assets/data/history_teams_with_earnings.json`)
    .then((response) => response.json())
    .then((resultsData) => {
      console.log("Fetched rider results data:", resultsData);
      // Filter results for the specific RiderID
      const riderResults = resultsData.filter((item) => parseInt(item.rider_id, 10) === parseInt(riderID, 10));

      // Clear the table body before appending new rows
      const resultsTableBody = document.getElementById("resultsTableBody");
      resultsTableBody.innerHTML = '';

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
        riderResults.forEach((result) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${result.edition}</td>
            <td><a href="/renners/#/${result.edition}/${result.ploegleider}${result.ploegleider}</td>
            <td>${result.kosten}</td>
            <td>${result.punten}</td>
            <td class="${result.punten - result.kosten >= 0 ? 'text-success' : 'text-danger'}">
              ${(result.punten - result.kosten).toFixed(1)}
            </td>
          `;
          resultsTableBody.appendChild(row);
        });
      } else {
        // No results found, empty the table body and display the desired text
        resultsTableBody.innerHTML = '';
        document.getElementById("riderNameResults").textContent = ''; // Empty the name heading
        document.getElementById("resultsTableBody").textContent = "Niet verkocht in voorgaande jaren"; // Display the desired text
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
