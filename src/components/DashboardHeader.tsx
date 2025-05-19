const DashboardHeader = ({ filters, setFilters }: any) => (
  <header className="sticky top-0 bg-blue-950/90 z-10 p-4 flex items-center gap-4 shadow">
    <input
      className="rounded p-2 border bg-white/10 text-white"
      placeholder="Filter by origin..."
      value={filters.origin || ""}
      onChange={e => setFilters((f: any) => ({ ...f, origin: e.target.value }))}
    />
    <input
      className="rounded p-2 border bg-white/10 text-white"
      placeholder="Urgency (if available)..."
      value={filters.urgency || ""}
      onChange={e => setFilters((f: any) => ({ ...f, urgency: e.target.value }))}
    />
    {/* Add more filter controls as needed */}
  </header>
);
export default DashboardHeader;
