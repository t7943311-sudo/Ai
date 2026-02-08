'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useFirebase, useUser, useCollection } from '@/firebase';
import { collection, query, where, type DocumentData, type Query } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

type Activity = {
  id: string;
  type: 'RESUME_ANALYSIS' | 'JOB_MATCH' | 'BULLET_REWRITE';
  details: any;
  createdAt: { toDate: () => Date };
};

export default function HistoryPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const activitiesQuery = useMemo(() => {
      if (!firestore || !user) return null;
      // The orderBy clause is removed to prevent the index error.
      // Sorting will be handled on the client side as a workaround.
      return query(
          collection(firestore, 'activityHistory'),
          where('userId', '==', user.uid)
      );
  }, [firestore, user]);

  const { data, loading } = useCollection<Activity>(activitiesQuery as Query<Activity> | null);

  const activities = useMemo(() => {
    if (!data) return [];
    // Sort activities by creation date on the client.
    return [...data].sort((a, b) => {
        const dateA = a.createdAt?.toDate?.().getTime() || 0;
        const dateB = b.createdAt?.toDate?.().getTime() || 0;
        return dateB - dateA;
    });
  }, [data]);


  const renderDetails = (activity: Activity) => {
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

  const renderResult = (activity: Activity) => {
    switch (activity.type) {
      case 'RESUME_ANALYSIS':
        return `${activity.details.score}/100`;
      case 'JOB_MATCH':
        return `${activity.details.matchPercentage}%`;
      case 'BULLET_REWRITE':
        return `+${activity.details.pointsCount} improved`;
      default:
        return '-';
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Activity History</h1>
        <p className="text-muted-foreground">A complete log of all your activities on CareerBoost AI.</p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="w-[150px] text-right">Result</TableHead>
                <TableHead className="w-[150px] text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-4/5" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!loading && activities && activities.length > 0 && activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                     <Badge
                        variant={
                          activity.type === 'RESUME_ANALYSIS'
                            ? 'default'
                            : activity.type === 'JOB_MATCH'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {activity.type === 'RESUME_ANALYSIS' ? 'Analysis' : activity.type === 'JOB_MATCH' ? 'Job Match' : 'Rewrite'}
                      </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{renderDetails(activity)}</TableCell>
                  <TableCell className="text-right">{renderResult(activity)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {activity.createdAt ? `${formatDistanceToNow(activity.createdAt.toDate())} ago` : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {!loading && (!activities || activities.length === 0) && (
              <div className="text-center p-8 text-muted-foreground">
                No activity yet. Analyze a resume or match a job to get started!
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
