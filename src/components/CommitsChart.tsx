// components/CommitsChart.tsx
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CommitDay {
  date: string;
  count: number;
}

export default function CommitsChart({ username }: { username: string }) {
  const [data, setData] = useState<CommitDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/users/${username}/events/public`)
      .then((res) => res.json())
      .then((events) => {
        const commitData: Record<string, number> = {};

        events.forEach((event: any) => {
          if (event.type === "PushEvent") {
            const date = new Date(event.created_at).toLocaleDateString();
            commitData[date] =
              (commitData[date] || 0) + event.payload.commits.length;
          }
        });

        const formatted = Object.entries(commitData).map(([date, count]) => ({
          date,
          count,
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <Card className="bg-[#1f2937] text-white shadow-xl border border-gray-700">
        <CardContent className="p-6">
          <Skeleton className="h-8 w-40 mb-4 bg-gray-700" />
          <Skeleton className="h-[300px] w-full bg-gray-700" />
        </CardContent>
      </Card>
    );
  }

  if (error)
    return (
      <p className="text-red-500 text-center">Failed to load commit data.</p>
    );

  return (
    <Card className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white shadow-lg border border-gray-600">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            📈 GitHub Commit Activity
          </h2>
          <span className="text-sm text-gray-400">(Last few days)</span>
        </div>

        {data.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-lg">
            No recent commits found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#cbd5e1"
                tick={{ fill: "#cbd5e1" }}
                fontSize={12}
              />
              <YAxis
                stroke="#cbd5e1"
                tick={{ fill: "#cbd5e1" }}
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: 8,
                  color: "#f1f5f9",
                }}
                cursor={{ fill: "#1F2937", opacity: 0.5 }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Bar
                dataKey="count"
                fill="#60a5fa"
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
