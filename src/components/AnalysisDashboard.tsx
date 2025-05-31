"use client";
import { useEffect, useState } from "react";
import CustomBarChart from "../components/CustomBarChart";
import CustomHighVolumeChart from "../components/CustomHighVolumeChart";
import CustomLineChart from "../components/CustomLineChart";
import CustomDoughnutChart from "../components/CustomDoughnutChart";

interface StockItem {
  politician: string;
  traded_issuer: string;
  published: string;
  traded: string;
  filed_after: string;
  owner: string;
  type: string;
  size: string;
  price: string;
}

export default function AnalysisDashboard(){
  const [data, setData] = useState<StockItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try{
        const res = await fetch("/data/stock_data.json");
        const json = await res.json();
        setData(json);
      }catch (err){
        console.error("Error loading data", err);
      }
    };
    loadData();
  }, []);

  if (data.length === 0){
    return <div className='text-center text-[#3D52A0]'>Loading Data...</div>;
  }

  return (
    <div className="space-y-8">
       {/* Summary Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Total Trades" value={data.length} />
        <SummaryCard title="Average Price" value={`$${calculateAveragePrice(data)}`} />
        <SummaryCard title="Most Traded Stock" value={calculateMostTradedStock(data)} />
        <SummaryCard title="Trade Type Distribution" value={getBuySellSummary(data)} />
      </div>

      {/* Detailed Sections with Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailCard title="Top Politicians by Trade Volume" description="Most active traders in the dataset">
          <CustomBarChart data={data} />
        </DetailCard>
        <DetailCard title="High-Volume Trades" description="Largest dollar-size trades">
        <CustomHighVolumeChart data={data} />
      </DetailCard>
        <DetailCard title="Price Trends" description="Average prices and trade volumes by stock">
          <CustomLineChart data={data} />
        </DetailCard>
        <DetailCard title="Ownership Patterns" description="Self vs Spouse trading distribution">
          <CustomDoughnutChart data={data} />
        </DetailCard>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string | number }){
  return (
    <div className="bg-[#EDE8F5] p-4 rounded-lg shadow">
      <h3 className="text-[#3D52A0] font-semibold">{title}</h3>
      <p className="text-2xl font-bold text-[#3D52A0]">{value}</p>
    </div>
  )
}

function DetailCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#EDE8F5] p-4 rounded-lg shadow">
      <div className="mb-2">
        <h3 className="text-[#3D52A0] font-semibold">{title}</h3>
        <p className="text-sm text-pink-500">{description}</p>
      </div>
      <div className="h-64">{children}</div>
    </div>
  );
}

function calculateAveragePrice(data: StockItem[]) {
  const total = data.reduce((acc, item) => acc + parseFloat(item.price.replace(/[$,]/g, "")), 0);
  return (total / data.length).toFixed(2);
}

function calculateMostTradedStock(data: StockItem[]) {
  const counts: Record<string, number> = {};
  data.forEach((item) => {
    counts[item.traded_issuer] = (counts[item.traded_issuer] || 0) + 1;
  });

  const [topStock, topCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return `${topStock} (${topCount} trades)`;
}

function getBuySellSummary(data: StockItem[]) {
  const counts = { buy: 0, sell: 0 };
  data.forEach((item) => {
    const type = item.type.toLowerCase();
    if (type === "buy") counts.buy += 1;
    if (type === "sell") counts.sell += 1;
  });
  return `${counts.buy} buys / ${counts.sell} sells`;
}