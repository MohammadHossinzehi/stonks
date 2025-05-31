"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CustomChartProps {
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

export default function CustomLineChart({ data }: CustomChartProps) {
    const chartData = Object.entries(
        data.reduce((acc, item) => {
          const price = parseFloat(item.price.replace(/[$,]/g, ""));
          if (!acc[item.traded_issuer]) {
            acc[item.traded_issuer] = { total: 0, count: 0 };
          }
          acc[item.traded_issuer].total += price;
          acc[item.traded_issuer].count += 1;
          return acc;
        }, {} as Record<string, { total: number; count: number }>)
      ).map(([name, details]) => ({
        name,
        avgPrice: details.total / details.count,
        count: details.count,
      }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
      <XAxis
          dataKey="name"
          interval={0}
          angle={-30}
          textAnchor="end"
          height={70}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="avgPrice" stroke="#7091E6" />
      </LineChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length && payload[0]?.payload) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 rounded shadow text-sm text-black">
          <p className="font-bold">{label}</p>
          <p>Average Price: ${data.avgPrice.toFixed(2)}</p>
          <p>Trades: {data.count}</p>
        </div>
      );
    }
    return null;
  }