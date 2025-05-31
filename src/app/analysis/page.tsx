import AnalysisDashboard from "@/components/AnalysisDashboard";

export default function AnalysisPage() {
  return (
    <div>
      <main className="mb-8">
        <header>
          <h1 className="text-3xl font-bold text-[#3D52A0] p-1">
            Trading Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-700 p-1 pb-5">
            Deep insights into political trading patterns and trends
          </p>
        </header>
        <section>
          <AnalysisDashboard />
        </section>
      </main>
    </div>
  );
}