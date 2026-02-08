import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScoreHistoryChart } from '@/components/dashboard/score-history-chart';

const stats = [
  {
    title: 'Overall Resume Score',
    value: '82/100',
    change: '+5.2% from last analysis',
    icon: <Activity className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Recent Job Match',
    value: '76%',
    change: 'for "Senior FE Engineer"',
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Keywords to Add',
    value: '+12',
    change: 'High-impact keywords missing',
    icon: <CreditCard className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: 'Bullet Points Improved',
    value: '+8',
    change: 'Rewritten for impact',
    icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  },
];

const recentActivities = [
  {
    type: 'Analysis',
    details: 'Resume v3',
    score: '82/100',
    date: '2023-11-23',
  },
  {
    type: 'Job Match',
    details: 'Senior Frontend Engineer @ Google',
    score: '76%',
    date: '2023-11-22',
  },
  {
    type: 'Rewrite',
    details: '5 bullet points rewritten',
    score: '+8% impact',
    date: '2023-11-21',
  },
  {
    type: 'Analysis',
    details: 'Resume v2',
    score: '77/100',
    date: '2023-11-20',
  },
  {
    type: 'Job Match',
    details: 'Product Manager @ Vercel',
    score: '65%',
    date: '2023-11-19',
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Resume Score History</CardTitle>
            <CardDescription>
              Tracking your resume&apos;s ATS score over the last 7 analyses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreHistoryChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A log of your recent analyses and job matches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Score/Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.date}>
                    <TableCell>
                      <Badge
                        variant={
                          activity.type === 'Analysis'
                            ? 'default'
                            : activity.type === 'Job Match'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {activity.details}
                    </TableCell>
                    <TableCell className="text-right">{activity.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
