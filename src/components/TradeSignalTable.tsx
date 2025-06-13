"use client";
import { useEffect, useState } from "react";

type Trade = {
  traded_issuer_ticker: string;
  traded: string;
  type: string;
};

type ScoredStock = {
  ticker: string;
  score: number;
  buys: number;
  sells: number;
};

export default function TradeSignalTable() {
  const [signals, setSignals] = useState<ScoredStock[]>([]);
  const [dayRange, setDayRange] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://22dcfki3yk.execute-api.us-east-1.amazonaws.com/prod/?nocache=" + Date.now());
        const response = await res.json();
        const result = JSON.parse(response.body);
        const data = result.data;

        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - dayRange);

        const trades: Trade[] = data.map((row: any[]) => ({
          traded_issuer_ticker: row[1].match(/[A-Z$]+:[A-Z]{2}/)?.[0] ?? row[1],
          traded: row[3],
          type: row[6],
        }));

        const recentTrades = trades.filter(t => {
            // Fix missing space between month and year
            const cleaned = t.traded.replace(/(\w{3})(\d{4})/, "$1 $2");
            const parts = cleaned.match(/(\d{1,2}) (\w{3}) (\d{4})/);
            if (!parts) return false;
            const [, day, monthStr, year] = parts;
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const date = new Date(Number(year), months.indexOf(monthStr), Number(day));
            return date >= cutoff;
          });

        const counts: Record<string, { buys: number; sells: number }> = {};

        for (const t of recentTrades) {
            const lowerType = t.type.toLowerCase();
            const action = lowerType.includes("sale") || lowerType.includes("sell")
              ? "sells"
              : "buys";
          if (!counts[t.traded_issuer_ticker]) {
            counts[t.traded_issuer_ticker] = { buys: 0, sells: 0 };
          }
          counts[t.traded_issuer_ticker][action]++;
        }

        console.log("Filtered trades count:", recentTrades.length);

        const scores = Object.entries(counts).map(([ticker, { buys, sells }]) => {
          const score = buys - sells;
          return { ticker, score, buys, sells };
        });

        setSignals(scores.sort((a, b) => b.score - a.score));
      } catch (err) {
        console.error("Failed to load trade signals:", err);
      }
    };

    fetchData();
  }, [dayRange]);

  return (
    <div className="mainContainer mt-10">
        <h2 className="tableTitle mb-4">Trade Signals (+5/-5 Score)</h2>
        <div className="flex gap-2 mb-4">
            {[30, 60, 90].map((days) => (
                <button
                key={days}
                className={`customButton ${dayRange === days ? "bg-[#3D52A0]" : ""}`}
                onClick={() => setDayRange(days)}
                >
                Last {days} Days
                </button>
            ))}
        </div>
        <p className="text-sm text-gray-600 mb-4">
            Based on trading activity from the last 30 days.
        </p>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="groupHeader">
                    <tr>
                    <th className="tableHeader">Ticker</th>
                    <th className="tableHeader">Buys</th>
                    <th className="tableHeader">Sells</th>
                    <th className="tableHeader">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {signals.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-500">
                        No signals found.
                        </td>
                    </tr>
                    ) : (
                    signals.map((s, i) => (
                        <tr key={i} className="dataDivider">
                        <td className="dataCellSpaced">{s.ticker}</td>
                        <td className="dataCellSpaced">{s.buys}</td>
                        <td className="dataCellSpaced">{s.sells}</td>
                        <td className="dataCellSpaced font-semibold">{s.score}</td>
                        </tr>
                    ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}