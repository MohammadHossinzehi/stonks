"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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


export default function CustomDoughnutChart({ data }: CustomChartProps) {
    const counts: Record<string, number> = {};
  
    data.forEach((item) => {
      const owner = item.owner.trim();
      counts[owner] = (counts[owner] || 0) + 1;
    });
  
    const chartData = Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  
    const COLORS = ["#7091E6", "#ADBBDA", "#F7C59F", "#EF6F6C", "#9BC1BC", "#5D576B"];
  
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={80}
            label
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }