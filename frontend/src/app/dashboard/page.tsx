import { MetricsDashboard } from "@/components/MetricsDashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white py-20 px-4 mt-16 pb-32">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <MetricsDashboard />
      </div>
    </main>
  );
}
