const tableBody = document.getElementById("dataTable");
const fetchButton = document.getElementById("fetchButton");

// Replace this with your actual API Gateway URL
const API_URL = "https://22dcfki3yk.execute-api.us-east-1.amazonaws.com/prod";

async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    console.log(result);

    // Clear existing table rows (optional)
    tableBody.innerHTML = "";

    // Assuming result.data is a list of arrays: [[name, value], [name, value]]
    result.data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${item[0]}</td><td>${item[1]}</td>`;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Attach click event to button
fetchButton.addEventListener("click", fetchData);
