"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendDataPoint {
  date: string;
  score: number;
  decision: string;
}

interface ScoreTrendProps {
  data: TrendDataPoint[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: TrendDataPoint }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded border bg-white p-2 text-sm shadow dark:border-gray-700 dark:bg-gray-800">
      <p className="font-medium">{item.date}</p>
      <p>スコア: {item.score}</p>
      <p>判定: {item.decision}</p>
    </div>
  );
}

export default function ScoreTrend({ data }: ScoreTrendProps) {
  if (data.length < 2) {
    return (
      <div className="rounded-lg border bg-white p-6 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-semibold">スコア推移</h3>
        <p className="text-gray-500">データが不足しています</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatDate(d.date),
  }));

  return (
    <div className="rounded-lg border bg-white p-6 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">スコア推移</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 5]} tickCount={6} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            dot={{ r: 4, fill: "#3b82f6" }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
