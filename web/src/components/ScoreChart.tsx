"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { ScoreItem } from "@/lib/models";

export default function ScoreChart({ scores }: { scores: ScoreItem[] }) {
  const data = scores.map((s) => ({
    category: s.category.replace(/（.*）/, ""),
    score: s.score,
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} />
        <Radar
          name="スコア"
          dataKey="score"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
