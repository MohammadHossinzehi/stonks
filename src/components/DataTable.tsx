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
        const res = await fetch("/data/stock_data.json");
        // const res = await fetch("/api/fetch-data"); // or use /data/stock_data.json for local
        if (!res.ok) throw new Error("Failed to fetch data");

        const result = await res.json();
        console.log("Fetched result:", result);

        setData(result);
    } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Unknown error");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Auto-fetch on page load
  }, []);

  return (
    <div className="bg-[#EDE8F5]/80 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-[#3D52A0]">Collected Data</h2>
            <button
                onClick={fetchData}
                className="bg-[#7091E6] text-white px-4 py-2 rounded hover:bg-[#ADBBDA] hover:text-white"
            >
                {loading ? "Refreshing..." : "Refresh Data"}
            </button>
        </div>

        {error && <div className="text-red-500 mb-4">Error: {error}</div>}

        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="shadow p-6 text-[#3D52A0] text-lg font-semibold">
                    <tr>
                    <th className="p-4 text-left">Politician</th>
                    <th className="px-4 py-2 text-left">Traded Issuer</th>
                    <th className="px-4 py-2 text-left">Published</th>
                    <th className="px-4 py-2 text-left">Traded</th>
                    <th className="px-4 py-2 text-left">Filed After</th>
                    <th className="px-4 py-2 text-left">Owner</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Size</th>
                    <th className="px-4 py-2 text-left">Price</th>
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
                        <tr key={idx} className="hover:bg-[#B8C5E0] shadow p-6 font-medium">
                            <td className="p-4 text-gray-700 text-base">{item.politician}</td>
                            <td className="px-4 py-2 text-gray-700 text-base">{item.traded_issuer}</td>
                            <td className="px-4 py-2 text-gray-700 text-base">{item.published}</td>
                            <td className="px-4 py-2 text-gray-700 text-base">{item.traded}</td>
                            <td className="px-4 py-2 text-gray-700 text-base">{item.filed_after}</td>
                            <td className="px-4 py-2 text-gray-700 text-base">
                            <span className="px-2 py-1 rounded text-base bg-[#7091E6] text-white">
                                {item.owner}
                            </span>
                            </td>
                            <td className="px-4 py-2 text-gray-700">
                            <span className= "px-2 py-1 rounded text-base bg-[#7091E6] text-white">
                                {item.type}
                            </span>
                            </td>
                            <td className="px-4 py-2 text-gray-700 text-base">{item.size}</td>
                            <td className="px-4 py-2 text-gray-700 text-base">{item.price}</td>
                        </tr>
                    ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}