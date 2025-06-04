"use client";
import { useState, useEffect } from "react";

export default function DataTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://22dcfki3yk.execute-api.us-east-1.amazonaws.com/prod/");
      if (!res.ok) throw new Error("Failed to fetch data");

      const response = await res.json(); // API Gateway's wrapped response
      const result = JSON.parse(response.body); // Unwrap the stringified JSON

      console.log("Fetched result:", result);

      const formatted = result.data.map((row: any[]) => {
        const { name, meta } = formatPolitician(row[0]);
        const { name: issuerName, ticker } = formatIssuer(row[1]);
        return {
          politician: name,
          politician_meta: meta,
          traded_issuer_name: issuerName,
          traded_issuer_ticker: ticker,
          published: formatPublished(row[2]),
          traded: formatTraded(row[3]),
          filed_after: formatFiledAfter(row[4]),
          owner: row[5],
          type: row[6],
          size: row[7],
          price: row[8],
        };
      });

      setData(formatted);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    console.log("Refresh button clicked");
    setLoading(true);
    setError("");

    try {
      console.log("Sending request to getStonksData...");
      //Trigger getStonksData to re-scrape
      const scrapeRes = await fetch("https://22dcfki3yk.execute-api.us-east-1.amazonaws.com/prod/?pages=5", {
        method: "GET", 
      });

      if(!scrapeRes.ok) throw new Error("Failed to trigger scrape");

      const scrapeData = await scrapeRes.json();
      console.log("Scrape response:" , scrapeData);

      if(scrapeData.error) throw new Error(scrapeData.error);

      //Wait for the S3 update (10 seconds delay as a simple approach)
      await new Promise((resolve) => setTimeout(resolve, 10000));

      //Fetch updated data from pullFromStorageJSON 
      const dataRes = await fetch("https://22dcfki3yk.execute-api.us-east-1.amazonaws.com/prod/");

      if (!dataRes.ok) throw new Error("Failed to fetch updated data");

      const response = await dataRes.json();
      const result = JSON.parse(response.body);
      const formatted = result.data.map((row: any[]) => {
        const { name, meta } = formatPolitician(row[0]);
        const { name: issuerName, ticker } = formatIssuer(row[1]);
        return {
          politician: name,
          politician_meta: meta,
          traded_issuer_name: issuerName,
          traded_issuer_ticker: ticker,
          published: formatPublished(row[2]),
          traded: formatTraded(row[3]),
          filed_after: formatFiledAfter(row[4]),
          owner: row[5],
          type: row[6],
          size: row[7],
          price: row[8],
        };
      });
      setData(formatted);
    } 
    catch(err: any) 
    {
      console.error("Error refreshing data:", err);
      setError(err.message || "Unknown error");
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mainContainer">
      <div className="flex justify-between items-center mb-4">
        <h2 className="tableTitle">Collected Data</h2>
        <button
          onClick={refreshData} //Use refreshData here instead of fetchData
          className="customButton"
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="groupHeader">
            <tr>
              <th className="tableHeader">Politician</th>
              <th className="tableHeader">Traded Issuer</th>
              <th className="tableHeader">Published</th>
              <th className="tableHeader">Traded</th>
              <th className="tableHeader">Filed After</th>
              <th className="tableHeader">Owner</th>
              <th className="tableHeader">Type</th>
              <th className="tableHeader">Size</th>
              <th className="tableHeader">Price</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-gray-500">
                  No data loaded yet.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx} className="dataDivider">
                  <td className="p-4 text-gray-700 text-base">
                    <div className="flex flex-col">
                      <span className="font-bold" style={{ whiteSpace: "nowrap" }}>
                        {item.politician} <span className="spanCells">{item.politician_meta}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-700 text-base ">
                    <span className="font-medium">{item.traded_issuer_name}</span>
                    {item.traded_issuer_ticker && (
                      <span className="spanCells"> ({item.traded_issuer_ticker})</span>
                    )}
                  </td>
                  <td className="dataCellSpaced">{item.published}</td>
                  <td className="dataCellSpaced">{item.traded}</td>
                  <td className="dataCellSpaced">{item.filed_after}</td>
                  <td className="dataCellSpaced">
                    <span className="dataCell">
                      {item.owner}
                    </span>
                  </td>
                  <td className="dataCellSpaced">
                    <span className="dataCell uppercase">
                      {item.type}
                    </span>
                  </td>
                  <td className="dataCellSpaced">{item.size}</td>
                  <td className="dataCellSpaced">{item.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatPolitician(raw: string): { name: string; meta: string } {
  
  // Match everything before party as the full name, then party/chamber/state
  const match = raw.match(/^(.*?)(Democrat|Republican)(Senate|House)([A-Z]{2})$/);
  if (!match) return { name: raw, meta: "" };

  const [, fullName, party, chamber, state] = match;

  return {
    name: fullName.trim(), // e.g. "David Taylor"
    meta: `(${party}${chamber}${state})`, // e.g. "(RepublicanHouseOH)"
  };
}

function formatFiledAfter(raw: string): string {
  const match = raw.match(/days(\d+)/);
  return match ? `${match[1]} days` : raw;
}

function formatPublished(raw: string): string {
  // Case 1: "13:05Yesterday" → "13:05 Yesterday"
  if (/^\d{2}:\d{2}\w+/.test(raw)) {
    return raw.replace(/^(\d{2}:\d{2})(\w)/, "$1 $2");
  }

  // Case 3: "2 Jun2025" → "2 Jun 2025"
  if (/^\d{1,2} [A-Za-z]{3}\d{4}$/.test(raw)) {
    return raw.replace(/^(\d{1,2}) ([A-Za-z]{3})(\d{4})$/, "$1 $2 $3");
  }

  // Default fallback
  return raw;
}

function formatTraded(raw: string): string {
  return raw.replace(/^(\d{1,2} [A-Za-z]{3})(\d{4})$/, "$1 $2");
}

function formatIssuer(raw: string): { name: string; ticker: string } {
  const match = raw.match(/^(.*?)([A-Z$]+:[A-Z]{2})$/);
  if (!match) return { name: raw, ticker: "" };

  const [, name, ticker] = match;
  return {
    name: name.trim(),
    ticker,
  };
}