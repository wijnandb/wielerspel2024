function getRepoNameFromUrl() {
  // Extract the pathname and remove any leading or trailing slashes
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  
  // Check if path matches any of the specified values
  const specialValues = ["renners", "stand", "ploegen", "graphs"];
  
  if (specialValues.includes(path)) {
      return "";
  }
  
  // Return the path prefixed with a slash
  return `/${path}`;
}

// const repo_name = getRepoNameFromUrl();
//  console.log(repo_name);  // This will display the repo_name extracted from the URL
const repo_name = "/wielerspel2024";
console.log(repo_name);

document.addEventListener("DOMContentLoaded", function () {
  // Function to extract RiderID from the URL
  function getRiderIDFromURL() {
    const urlParts = window.location.href.split("/");
    const riderIDIndex = urlParts.indexOf("renners") + 2;

    // Check if RiderID is found in the URL
    if (riderIDIndex >= 0 && riderIDIndex < urlParts.length && urlParts[riderIDIndex] !== "") {
      console.log(urlParts[riderIDIndex]);
      return urlParts[riderIDIndex];
    } else {
      // Try to extract the number after /#/
      const hashParts = window.location.hash.split("/");
      if (hashParts.length > 1 && !isNaN(hashParts[1]) && hashParts[1] !== "") {
        console.log(hashParts[1]);
        return hashParts[1];
      } else {
        return 5;  // RiderID not found in the URL
      }
    }
  }

  function calculateBirthdateAndAge(ucicode) {
    const year = ucicode.substring(3, 7);
    const month = ucicode.substring(7, 9);
    const day = ucicode.substring(9, 11);

    const birthdate = new Date(year, month - 1, day); // Subtract 1 from month to match JavaScript's month indexing (0-11).
    const today = new Date();

    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    const formattedBirthdate = `${day}-${month}-${year}`;

    return { formattedBirthdate, age };
  }

  // Function to generate the rider photo URL
  function generateRiderPhotoURL(riderID) {
    const paddedRiderID = String(riderID).padStart(6, "0");
    return `https://cqranking.com/men/images/Riders/2023/CQM2023${paddedRiderID}.jpg`;
  }

  // Extract RiderID from the URL
  const riderIDString = getRiderIDFromURL();
  // Convert the string to an integer
  const riderID = parseInt(riderIDString, 10); // Base 10 for decimal numbers

    // Function to fetch and update rider data
    function updateRiderData(riderID) {
      console.log("Updating rider data with riderID:", riderID);
      // Fetch the cyclist data and display it based on the RiderID
      fetch(`${repo_name}/assets/data/renners.json`)
        .then((response) => response.json())
        .then((data) => {
          // console.log("Fetched cyclist data:", data);
          const jsonData = data.find((item) => parseInt(item.RiderID, 10) === parseInt(riderID, 10));

  
          if (jsonData) {
            // Calculate birthdate and age
            const { formattedBirthdate, age } = calculateBirthdateAndAge(jsonData.UCICode);
            console.log("Formatted birthdate:", formattedBirthdate);
            console.log("Age:", age);
            // Render data to HTML
            document.getElementById("riderPhoto").src = generateRiderPhotoURL(jsonData.RiderID);
            document.getElementById("flag").src = `${repo_name}/assets/img/flags/${jsonData.Nationality}.png`;
            document.getElementById("flag").alt = jsonData.Nationality;
            document.getElementById("flag").title = jsonData.Nationality;
            document.getElementById("birthdate").textContent = formattedBirthdate;
            document.getElementById("age").textContent = `${age} jaar`;
            document.getElementById("riderName").textContent = jsonData.Name;
            document.getElementById("teamLink").href = `https://cqranking.com/men/asp/gen/team.asp?year=2023&teamcode=${jsonData.Team}`;
            document.getElementById("teamLink").textContent = jsonData.Team;
            document.getElementById("CQLink").href = `https://cqranking.com/men/asp/gen/rider.asp?riderid=${jsonData.RiderID}`;
            //document.getElementById("PCSLink").href = `https://www.procyclingstats.com/rider/${jsonData.Team}`;
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
  fetch(`${repo_name}/assets/data/history_teams_with_earnings.json`)
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
