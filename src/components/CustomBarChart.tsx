"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CustomBarChartProps {
    data: {
      politician: string;
      traded_issuer: string;
      published: string;
      traded: string;
      filed_after: string;
      owner: string;
      type: string;
      size: string;
      price: string;
    }[];
}

export default function CustomBarChart({ data }: CustomBarChartProps) {
    const chartData = Object.entries(
        data.reduce((acc, item) => {
          if (!acc[item.politician]) {
            acc[item.politician] = { count: 0, companies: {} };
          }
          acc[item.politician].count += 1;
          acc[item.politician].companies[item.traded_issuer] =
            (acc[item.politician].companies[item.traded_issuer] || 0) + 1;
          return acc;
        }, {} as Record<string, { count: number; companies: Record<string, number> }>)
      )
        .map(([name, details]) => ({
          name,
          count: details.count,
          companies: details.companies,
      }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
  
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              tick={false}
              label={{ value: "Politicians", position: "insideBottom", offset: 5 }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#7091E6" />
          </BarChart>
        </ResponsiveContainer>
      );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length && payload[0]?.payload) {
    const data = payload[0].payload;

    return (
      <div 
        className="bg-white p-2 rounded shadow text-sm text-black"
        style={{
          maxHeight: "500px",
          maxWidth: "600px",
          overflowY: "auto",
          overflowX: "hidden",
          pointerEvents: "auto", // <- needed for scroll interactivity
          zIndex: 50,
        }}
      >
        <p className="font-bold">{label}</p>
        <p>Total Trades: {data.count}</p>
        <p>Companies:</p>
        {data.companies && Object.keys(data.companies).length > 0 ? (
          <ul className="list-disc pl-4">
            {Object.entries(data.companies).map(([company, count]) => (
              <li key={company}>
                {company}: {String(count)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No company data</p>
        )}
      </div>
    );
  }
  return null;
}