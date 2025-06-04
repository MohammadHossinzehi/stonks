import DataTable from "../components/DataTable";

export default function HomePage() {
  return (
    <div>
      <main className="mb-8">
        <header className="mb-6">
          <h1 className="headerTitle">Political Trading Dashboard</h1>
          <p className="headerDescription">
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