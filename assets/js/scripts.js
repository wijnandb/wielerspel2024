/* Step 1, getting the data and loading it in a variable */
let allData = [];

async function loadAllData() {
    const filename = '/assets/data/history_riders_with_points.json';
    const response = await fetch(filename);
    allData = await response.json();
    // Sort allData based on "kosten" in descending order
    allData.sort((a, b) => b.kosten - a.kosten);
}

/* Step 2: Get variables from the hash and filter the data */
function getUrlParameters(url) {
    const urlObj = new URL(url);
    const hashParts = urlObj.hash.replace('#', '').split('/').filter(el => el);
    
    return {
        year: hashParts[0] || null,
        teamCaptain: hashParts[1] || null
    };
}

function filterDataByParams(params) {
    let filteredData = allData;
    if (params.year) {
        filteredData = filteredData.filter(item => String(item.edition) === params.year);
        document.getElementById("yearSelect").value = params.year;
        document.getElementById("teamYear").innerHTML = params.year;
    }
    if (params.teamCaptain) {
        filteredData = filteredData.filter(item => item.ploegleider.toLowerCase() === params.teamCaptain.toLowerCase());
        document.getElementById("ploegleiderSelect").value = params.teamCaptain;
        document.getElementById("teamCaptain").innerHTML = params.teamCaptain;
    }
    return filteredData;
}


/* Step 3, Display the filtered data in the table */
function displayDataInTable(data) {
    const tableBody = document.getElementById("ploegTableBody");
    tableBody.innerHTML = ""; // clear previous rows

    // Render each result in the table
    data.forEach((result) => {
        const row = document.createElement("tr");
        if (result.joker) {
            jokercell = `<img src="/assets/img/joker.png" title="${result.joker}" width="30px;">`;
        } else {
            jokercell = '';
        }
        row.innerHTML = `
        <td><a href="/stand/#/${result.edition}">${result.edition}</a></td>
        <td><img src="/assets/img/flags/${result.nationality}.png" title="${result.nationality}" width="30px;"></td>
        <td><a href="/renners/#/${result.rider_id}">${result.rider}</td>
        <td>${result.kosten}</td>
        <td>${result.punten}</td>
        <td>${result.JPP}</td>
        <td class="${result.punten - result.kosten >= 0 ? 'text-success' : 'text-danger'}">
            ${(result.punten - result.kosten).toFixed(1)}
        </td>
        <td>${jokercell}</td>
        `;
        tableBody.appendChild(row);
    });
}



/* Handling popstate */
window.onpopstate = function(event) {
    const params = getUrlParameters(window.location.href);
    const filteredData = filterDataByParams(params);
    displayDataInTable(filteredData);
};


/* Initialization */
async function initializePage() {
    await loadAllData();
    const params = getUrlParameters(window.location.href);
    const filteredData = filterDataByParams(params);
    displayDataInTable(filteredData);
}

initializePage();




/* Helper functions */

function navigateToNewUrl() {
    let selectedYear = document.getElementById("yearSelect").value;
    const selectedPloegleider = document.getElementById("ploegleiderSelect").value;

    // Set selectedYear to 2023 if selectedPloegleider is not empty
    if (selectedPloegleider && !selectedYear) {
        selectedYear = "2022";
    }

    // Construct the new hash based on the selected values
    const newHash = `/${selectedYear}/${selectedPloegleider}/`;

    // Update the hash without causing a page reload
    location.hash = newHash;
}
