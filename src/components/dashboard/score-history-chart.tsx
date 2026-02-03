'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { date: '2024-01', score: 65 },
  { date: '2024-02', score: 68 },
  { date: '2024-03', score: 72 },
  { date: '2024-04', score: 70 },
  { date: '2024-05', score: 75 },
  { date: '2024-06', score: 78 },
  { date: '2024-07', score: 82 },
];

const chartConfig = {
  score: {
    label: 'ATS Score',
    color: 'hsl(var(--primary))',
  },
};

export function ScoreHistoryChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
          dataKey="score"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[50, 100]}
        />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 7)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="score"
          type="monotone"
          stroke="var(--color-score)"
          strokeWidth={2}
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  );
}
