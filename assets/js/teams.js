// Function to parse CSV data
function parseCSV(csvData) {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",");
    return lines.slice(1).map(line => {
        const data = line.split(",");
        return headers.reduce((obj, nextKey, index) => {
            obj[nextKey] = data[index];
            return obj;
        }, {});
    });
}

// Function to fetch CSV data, filter by team, and display results
function displayRidersByTeam(teamCode) {
    fetch(`${repo_name}/path/to/your/csvfile.csv`)
        .then(response => response.text())
        .then(csvData => {
            const riders = parseCSV(csvData);
            const teamRiders = riders.filter(rider => rider.Team === teamCode);

            // Clear existing content
            const container = document.getElementById("ridersContainer");
            container.innerHTML = '';

            // Display each rider
            teamRiders.forEach(rider => {
                const riderElement = document.createElement("div");
                riderElement.innerHTML = `
                    <p>Rider: ${rider.Name}</p>
                    <p>Team: ${rider.Team}</p>
                    <p>Nationality: ${rider.Nationality}</p>
                    <p>Age: ${rider.Age}</p>
                    <p>CQ: ${rider.CQ}</p>
                `;
                container.appendChild(riderElement);
            });
        })
        .catch(error => console.error("Error fetching or processing CSV data:", error));
}

// Example usage
displayRidersByTeam("UAD"); // Replace "UAD" with the desired team code
