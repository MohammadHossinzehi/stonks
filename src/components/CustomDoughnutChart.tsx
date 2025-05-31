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
    const counts = { Self: 0, Spouse: 0 };
  
    data.forEach((item) => {
      const owner = item.owner.toLowerCase();
      if (owner.includes("self")) counts.Self += 1;
      if (owner.includes("spouse")) counts.Spouse += 1;
    });
  
    const chartData = [
      { name: "Self", value: counts.Self },
      { name: "Spouse", value: counts.Spouse },
    ];
  
    const COLORS = ["#7091E6", "#ADBBDA"];
  
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