'use client';

import { useState, useTransition } from 'react';
import { matchResumeToJobDescription } from '@/ai/flows/match-resume-to-job-description';
import type { MatchResumeToJobDescriptionOutput } from '@/ai/flows/match-resume-to-job-description';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, GitCompareArrows } from 'lucide-react';
import { MatchResults } from '@/components/feature/match-results';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function MatchJobPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] =
    useState<MatchResumeToJobDescriptionOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const { user } = useUser();

  const handleMatch = () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide both resume and job description.',
        variant: 'destructive',
      });
      return;
    }
    startTransition(async () => {
      if (!firestore || !user) {
        toast({ title: "Error", description: "You must be logged in to perform this action.", variant: 'destructive' });
        return;
      }
      try {
        const result = await matchResumeToJobDescription({
          resumeText,
          jobDescription,
        });
        setMatchResult(result);
        
        const matchRef = await addDoc(collection(firestore, 'jobMatches'), {
          ...result,
          userId: user.uid,
          resumeText: resumeText,
          jobDescription: jobDescription,
          createdAt: serverTimestamp(),
        });

        await addDoc(collection(firestore, 'activityHistory'), {
            userId: user.uid,
            type: 'JOB_MATCH',
            referenceId: matchRef.id,
            details: {
                matchPercentage: result.matchPercentage,
                jobTitle: jobDescription.substring(0, 50) + '...',
            },
            createdAt: serverTimestamp(),
        });

      } catch (error) {
        console.error('Match failed:', error);
        toast({
          title: 'Match Failed',
          description:
            'Something went wrong. Please check your connection and try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Job Description Matcher</CardTitle>
            <CardDescription>
              Compare your resume against a job description to see your match
              score and get tailored feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your resume text here..."
              className="min-h-[250px] font-mono text-sm"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={isPending}
            />
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[250px] font-mono text-sm"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isPending}
            />
            <Button onClick={handleMatch} disabled={isPending} className="w-full">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GitCompareArrows className="mr-2 h-4 w-4" />
              )}
              Match to Job
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {isPending ? (
          <Card className="flex h-[600px] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Comparing your resume to the job description...
              </p>
            </div>
          </Card>
        ) : matchResult ? (
          <MatchResults result={matchResult} />
        ) : (
           <Card className="flex h-[600px] items-center justify-center">
            <div className="text-center text-muted-foreground">
              <GitCompareArrows className="mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">
                Your match results will appear here
              </h3>
              <p className="mt-2 text-sm">
                Paste your info and click &quot;Match to Job&quot; to begin.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
