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

function updatePriceTrends(data) {
  const tickerPrices = {};

  data.forEach((item) => {
    const ticker = item.traded_issuer;
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    
    // Only consider valid prices
    if (!isNaN(price)) {
      if (!tickerPrices[ticker]) {
        tickerPrices[ticker] = { total: 0, count: 0 };
      }
      tickerPrices[ticker].total += price;
      tickerPrices[ticker].count += 1;
    }
  });

  const trendsList = document.getElementById("priceTrendsList");
  trendsList.innerHTML = "";

  // Build display list
  Object.entries(tickerPrices).forEach(([ticker, { total, count }]) => {
    const avgPrice = (total / count).toFixed(2);
    const li = document.createElement("li");
    li.textContent = `${ticker}: Average Price: $${avgPrice} over ${count} trades`;
    trendsList.appendChild(li);
  });
}

function updateOwnershipPatterns(data) {
  const ownershipStats = {};

  data.forEach((item) => {
    const owner = item.owner;
    const politician = item.politician;
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));

    // Initialize ownership stats if not already present
    if (!ownershipStats[owner]){
      ownershipStats[owner] = {
        count: 0,
        totalPrice: 0,
        politicians: {},
      };
    }

    // Update ownership stats
    ownershipStats[owner].count += 1;

    // Only consider valid prices
    if (!isNaN(price)) {
      ownershipStats[owner].totalPrice += price;
    }

    // Track trades by politicians
    if (!ownershipStats[owner].politicians[politician]) {
      ownershipStats[owner].politicians[politician] = 0;
    }

    // Increment politician trade count
    ownershipStats[owner].politicians[politician] += 1;
  });

  const totalTrades = data.length;
  const list = document.getElementById("ownershipPatternsList");
  list.innerHTML = "";

  Object.entries(ownershipStats).forEach(([owner, stats]) => {
    const avgPrice = stats.totalPrice / stats.count;
    const percentage = ((stats.count / totalTrades) * 100).toFixed(1);

    const topPoliticians = Object.entries(stats.politicians)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 3) // Get top 3
      .map(([name, count]) => `${name} (${count})`)
      .join(", ");

    const li = document.createElement("li");
    li.textContent = `${owner}: ${stats.count} trades (${percentage}%), Avg Price: $${avgPrice.toFixed(2)}, Top Politicians: ${topPoliticians}`;
  
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
    updatePriceTrends(data);
    updateOwnershipPatterns(data);
  } catch (error) {
    console.error("Error Loading analysis data", error);
  }
}

document.addEventListener("DOMContentLoaded", loadAnalysisData);
