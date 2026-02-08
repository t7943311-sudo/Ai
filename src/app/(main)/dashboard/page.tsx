'use client';

import {
  Activity,
  FileScan,
  GitCompareArrows,
  PenSquare,
} from 'lucide-react';
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
import { useCollection, useFirebase, useUser } from '@/firebase';
import { collection, query, where, orderBy, limit, type Query } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

type ActivityDoc = {
  id: string;
  type: 'RESUME_ANALYSIS' | 'JOB_MATCH' | 'BULLET_REWRITE';
  details: any;
  createdAt: { toDate: () => Date };
};

type ResumeAnalysisDoc = {
    id: string;
    userId: string;
    atsScore: number;
    missingKeywords: string[];
    createdAt: { toDate: () => Date };
};


export default function DashboardPage() {
    const { firestore } = useFirebase();
    const { user } = useUser();

    const activitiesQuery = useMemo(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'activityHistory'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
    }, [firestore, user]);

    const analysesQuery = useMemo(() => {
        if (!firestore || !user) return null;
        return query(
            collection(firestore, 'resumeAnalyses'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(7) // For the chart and stats
        );
    }, [firestore, user]);

    const { data: activities, loading: activitiesLoading } = useCollection<ActivityDoc>(activitiesQuery as Query<ActivityDoc> | null);
    const { data: analyses, loading: analysesLoading } = useCollection<ResumeAnalysisDoc>(analysesQuery as Query<ResumeAnalysisDoc> | null);

    const loading = activitiesLoading || analysesLoading;

    const latestAnalysis = useMemo(() => analyses?.[0], [analyses]);
    const latestJobMatch = useMemo(() => activities?.find(a => a.type === 'JOB_MATCH'), [activities]);
    const latestRewrite = useMemo(() => activities?.find(a => a.type === 'BULLET_REWRITE'), [activities]);

    const stats = [
        {
            title: 'Overall Resume Score',
            value: latestAnalysis ? `${latestAnalysis.atsScore}/100` : '-',
            change: latestAnalysis ? `Analyzed ${formatDistanceToNow(latestAnalysis.createdAt.toDate())} ago` : 'No analysis yet',
            icon: <FileScan className="h-4 w-4 text-muted-foreground" />,
            loading: loading,
        },
        {
            title: 'Recent Job Match',
            value: latestJobMatch ? `${latestJobMatch.details.matchPercentage}%` : '-',
            change: latestJobMatch ? `for "${latestJobMatch.details.jobTitle}"` : 'No matches yet',
            icon: <GitCompareArrows className="h-4 w-4 text-muted-foreground" />,
            loading: loading,
        },
        {
            title: 'Keywords to Add',
            value: latestAnalysis ? `+${latestAnalysis.missingKeywords.length}` : '-',
            change: 'From latest resume analysis',
            icon: <Activity className="h-4 w-4 text-muted-foreground" />,
            loading: loading,
        },
        {
            title: 'Bullet Points Improved',
            value: latestRewrite ? `+${latestRewrite.details.pointsCount}` : '-',
            change: 'From latest rewrite session',
            icon: <PenSquare className="h-4 w-4 text-muted-foreground" />,
            loading: loading,
        },
    ];

    const chartData = useMemo(() => {
        if (!analyses) return [];
        return [...analyses]
            .reverse() // so the chart shows oldest to newest
            .map(a => ({
                date: format(a.createdAt.toDate(), 'MMM d'),
                score: a.atsScore,
            }));
    }, [analyses]);

    const renderActivityDetails = (activity: ActivityDoc) => {
        switch (activity.type) {
          case 'RESUME_ANALYSIS':
            return `Analyzed: ${activity.details.resumeTitle || 'Resume'}`;
          case 'JOB_MATCH':
            return `Matched against: ${activity.details.jobTitle || 'Job Description'}`;
          case 'BULLET_REWRITE':
            return `Rewrote ${activity.details.pointsCount} bullet point(s)`;
          default:
            return 'General activity';
        }
    };

    const renderActivityResult = (activity: ActivityDoc) => {
        switch (activity.type) {
          case 'RESUME_ANALYSIS':
            return <Badge variant="default">{activity.details.score}/100</Badge>;
          case 'JOB_MATCH':
            return <Badge variant="secondary">{activity.details.matchPercentage}%</Badge>;
          case 'BULLET_REWRITE':
            return <Badge variant="outline">+{activity.details.pointsCount} improved</Badge>;
          default:
            return '-';
        }
    };

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            {stat.icon}
                        </CardHeader>
                        <CardContent>
                            {stat.loading ? (
                                <>
                                 <Skeleton className="h-8 w-24 mt-1" />
                                 <Skeleton className="h-4 w-40 mt-2" />
                                </>
                            ) : (
                                <>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>Resume Score History</CardTitle>
                        <CardDescription>
                           Tracking your resume's ATS score over the last {analyses?.length || 0} analyses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[250px] flex items-center justify-center">
                                <Skeleton className="h-full w-full" />
                            </div>
                        ) : chartData.length > 1 ? (
                           <ScoreHistoryChart data={chartData} />
                        ) : (
                            <div className="h-[250px] flex flex-col items-center justify-center text-center text-muted-foreground">
                                <FileScan className="h-10 w-10 mb-4" />
                               <p className="font-semibold">No Score History Yet</p>
                               <p className="text-sm">Analyze your resume a few times to see your progress.</p>
                               <Button asChild variant="secondary" size="sm" className="mt-4">
                                   <Link href="/analyze">Analyze Resume</Link>
                               </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                A log of your most recent actions.
                            </CardDescription>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/history">
                                View All
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                       {loading && (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center p-2">
                                    <div className="space-y-1">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                                ))}
                            </div>
                        )}
                        {!loading && activities && activities.length > 0 ? (
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Result</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activities.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell>
                                            <div className="font-medium">{renderActivityDetails(activity)}</div>
                                            <div className="text-sm text-muted-foreground">{formatDistanceToNow(activity.createdAt.toDate(), { addSuffix: true })}</div>
                                        </TableCell>
                                        <TableCell className="text-right">{renderActivityResult(activity)}</TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : !loading && (
                            <div className="text-center text-muted-foreground p-8">
                                <Activity className="h-8 w-8 mx-auto mb-2"/>
                                <p className="font-semibold">No recent activity</p>
                                <p className="text-sm mt-1">Get started by analyzing a resume!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
