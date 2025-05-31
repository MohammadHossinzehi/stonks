"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ✅ Add this interface at the top
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
        acc[item.politician] = (acc[item.politician] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, count]) => ({ name, count }));
  
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#7091E6" />
        </BarChart>
      </ResponsiveContainer>
    );
  }