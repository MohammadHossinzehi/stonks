const tableBody = document.getElementById("dataTable");
const fetchButton = document.getElementById("fetchButton");

// CONFIG
const useLocalData = false;
const useS3Data = false;
const useApiData = true;

// ENDPOINTS
//const S3_URL = stonks bucket URL 
const API_URL = "https://22dcfki3yk.execute-api.us-east-1.amazonaws.com/prod";
const LOCAL_FILE = "data/mock_data.json";

async function fetchData() {
  try {
    let data; 

    // Fetch data based on config 
    if (useLocalData) {
      console.log("Fetching local mock data");
      const response = await fetch(LOCAL_FILE);
      if(!response.ok) throw new Error("Failed to fetch local data.");
      data = await response.json();
    }
    else if (useS3Data) {
      console.log("Fetching S3 data");
      if(!response.ok) throw new Error("Failed to fetch S3 data");
      data = await response.json();
    }
    else if (useApiData) {
      console.log("Fetching API data");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch API data");
      const result = await response.json();
      data = result;
    }
    else{
      throw new Error("No data source selected.");
    }

    // Clear existing table rows
    tableBody.innerHTML = "";

    // Handle API format VS local/S3 format
    if (useApiData) {
      data.data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${item[0]}</td>
        <td>${item[1]}</td>
        <td>${item[2]}</td>
        <td>${item[3]}</td>
        <td>${item[4]}</td>
        <td>${item[5]}</td>
        <td>${item[6]}</td>
        <td>${item[7]}</td>
        <td>${item[8]}</td>
        <td>${item[9]}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      data.forEach((stock) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${stock.politician}</td>
        <td>${stock.traded_issuer}</td>
        <td>${stock.published}</td>
        <td>${stock.traded}</td>
        <td>${stock.filed_after}</td>
        <td>${stock.owner}</td>
        <td>${stock.type}</td>
        <td>${stock.size}</td>
        <td>${stock.price}</td>
        `;
        tableBody.appendChild(row);
      });
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Add event listener to the button
fetchButton.addEventListener("click", fetchData);
