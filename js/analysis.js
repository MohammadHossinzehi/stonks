function updateSummary(data) {
  const totalTrades = data.length;

  let totalPrice = 0;
  let priceCount = 0;
  const typeCounts = { buy: 0, sell: 0 };
  const tickerCounts = {};

  data.forEach((item) => {
    // Count buys/sells
    const type = item.type.toLowerCase();
    if (type === "buy" || type === "sell") {
      typeCounts[type] += 1;
    }

    // Track price
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    if (!isNaN(price)) {
      totalPrice += price;
      priceCount += 1;
    }

    // Track most traded tickers
    const ticker = item.traded_issuer;
    tickerCounts[ticker] = (tickerCounts[ticker] || 0) + 1;
  });

  const averagePrice =
    priceCount > 0 ? (totalPrice / priceCount).toFixed(2) : "N/A";

  // Find most traded ticker
  let mostTradedTicker = "";
  let maxTrades = 0;
  for (const ticker in tickerCounts) {
    if (tickerCounts[ticker] > maxTrades) {
      maxTrades = tickerCounts[ticker];
      mostTradedTicker = ticker;
    }
  }

  // Update summary display
  document.getElementById(
    "totalTrades"
  ).textContent = `Total Trades: ${totalTrades}`;
  document.getElementById(
    "averagePrice"
  ).textContent = `Average Price: $${averagePrice}`;
  document.getElementById(
    "keyPatterns"
  ).textContent = `Most traded stock: ${mostTradedTicker} (${maxTrades} trades), Buys: ${typeCounts.buy}, Sells: ${typeCounts.sell}`;
}

function updateTopPoliticians(data) {
  const politicianCounts = {};
  const politicianStocks = {};

  // Count trades by politicians
  data.forEach((item) => {
    const name = item.politician;
    const stock = item.traded_issuer;

    // Count total trades/politician
    politicianCounts[name] = (politicianCounts[name] || 0) + 1;

    // Track stock/politician
    if (!politicianStocks[name]) {
      politicianStocks[name] = {};
    }
    politicianStocks[name][stock] = (politicianStocks[name][stock] || 0) + 1;
  });

  // Sort politicians by number of trades
  const sortedPoliticians = Object.entries(politicianCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count descending
    .slice(0, 5); // Get top 5

  const list = document.getElementById("topPoliticiansList");
  list.innerHTML = "";

  sortedPoliticians.forEach(([name, count]) => {
    const stockCounts = politicianStocks[name];
    const stockSummary = Object.entries(stockCounts)
      .map(([stock, count]) => `${stock} (${count})`)
      .join(", ");

    const li = document.createElement("li");
    li.textContent = `${name}: ${count} trades → ${stockSummary}`;
    list.appendChild(li);
  });
}

function updateHighVolumeTrades(data) {
  const highVolumeThresholds = [
    "$50K-$100K",
    "$100K-$250K",
    "$250K-$500K",
    "$500K-$1M",
    "$1M-$2.5M",
    "$2.5M-$5M",
    "$5M-$10M",
    "$10M+",
  ];

  const highVolumeTrades = data.filter((item) =>
    highVolumeThresholds.includes(item.size)
  );

  const list = document.getElementById("highVolumeList");
  list.innerHTML = "";

  // If no high-volume trades found, display message
  if (highVolumeTrades.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No high-volume trades found.";
    list.appendChild(li);
    return;
  }

  highVolumeTrades.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.politician} traded ${item.traded_issuer} (${item.size}, ${item.type}) on ${item.traded}`;
    list.appendChild(li);
  });
}

async function loadAnalysisData() {
  try {
    const response = await fetch("../data/stock_data.json");
    const data = await response.json();

    updateSummary(data);
    updateTopPoliticians(data);
    updateHighVolumeTrades(data);
    // updatePriceTrends(data);
  } catch (error) {
    console.error("Error Loading analysis data", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAnalysisData);

async function fetchDataAndUpdateTable() {
  try {
    const response = await fetch(
      "https://22dcfki3yk.execute-api.us-east-1.amazonaws.com/prod/"
    );
    const data = await response.json();

    const tableBody = document.getElementById("dataTable");
    tableBody.innerHTML = "";

    data.data.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
window.onload = fetchDataAndUpdateTable;
