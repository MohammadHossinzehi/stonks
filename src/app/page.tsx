import DataTable from "@/components/DataTable";

export default function HomePage() {
  return (
    <div>
      <main className="mb-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[#3D52A0] p-1">Political Trading Dashboard</h1>
          <p className="text-lg text-gray-700 p-1 pb-5">
            Track and analyze political stock trading data in real-time
          </p>
        </header>

        <section>
          <DataTable />
        </section>
      </main>
    </div>
  );
}