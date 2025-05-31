"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CustomHighVolumeChartProps {
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

// Helper to approximate size ranges into numeric value
const sizeRangeToNumber = (size: string) => {
  const ranges: Record<string, number> = {
    "$1K-$15K": 8000,
    "$15K-$50K": 32500,
    "$50K-$100K": 75000,
    "$100K-$250K": 175000,
    "$250K-$500K": 375000,
    "$500K-$1M": 750000,
    "$1M-$2.5M": 1750000,
    "$2.5M-$5M": 3750000,
    "$5M-$10M": 7500000,
    "$10M+": 10000000,
  };
  return ranges[size] || 0;
};

export default function CustomHighVolumeChart({
  data,
}: CustomHighVolumeChartProps) {
  const highVolumeData = data
    .map((item) => ({
      name: item.politician,
      company: item.traded_issuer,
      sizeLabel: item.size,
      approxValue: sizeRangeToNumber(item.size),
      type: item.type,
      tradedDate: item.traded,
    }))
    .filter((item) => item.approxValue >= 50000) // filter high-volume
    .sort((a, b) => b.approxValue - a.approxValue)
    .slice(0, 10); // top 10

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={highVolumeData}>
        <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={70} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="approxValue" fill="#7091E6" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length && payload[0]?.payload) {
    const d = payload[0].payload;
    return (
      <div className="bg-white text-black p-2 rounded shadow text-sm">
        <p className="font-bold">{d.name}</p>
        <p>Company: {d.company}</p>
        <p>Size: {d.sizeLabel} (~${d.approxValue.toLocaleString()})</p>
        <p>Type: {d.type}</p>
        <p>Date: {d.tradedDate}</p>
      </div>
    );
  }
  return null;
}