'use client';

import { useState, useTransition } from 'react';
import { analyzeResumeAndProvideFeedback } from '@/ai/flows/analyze-resume-and-provide-feedback';
import type { AnalyzeResumeAndProvideFeedbackOutput } from '@/ai/flows/analyze-resume-and-provide-feedback';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { AnalysisResults } from '@/components/feature/analysis-results';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeResumeAndProvideFeedbackOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { firestore } = useFirebase();
  const { user } = useUser();

  const handleAnalyze = () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste your resume content before analyzing.',
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
        const result = await analyzeResumeAndProvideFeedback({ resumeText });
        setAnalysisResult(result);
        
        const analysisRef = await addDoc(collection(firestore, 'resumeAnalyses'), {
          ...result,
          userId: user.uid,
          resumeText: resumeText,
          createdAt: serverTimestamp(),
        });

        await addDoc(collection(firestore, 'activityHistory'), {
          userId: user.uid,
          type: 'RESUME_ANALYSIS',
          referenceId: analysisRef.id,
          details: {
            score: result.atsScore,
            resumeTitle: resumeText.substring(0, 50) + '...',
          },
          createdAt: serverTimestamp(),
        });

      } catch (error) {
        console.error('Analysis failed:', error);
        toast({
          title: 'Analysis Failed',
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
            <CardTitle>Resume Analyzer</CardTitle>
            <CardDescription>
              Paste your resume below to get an instant analysis of its
              strengths and weaknesses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your full resume text here..."
              className="min-h-[400px] font-mono text-sm"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={isPending}
            />
            <Button
              onClick={handleAnalyze}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Analyze Resume
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
                Analyzing your resume... this may take a moment.
              </p>
            </div>
          </Card>
        ) : analysisResult ? (
          <AnalysisResults result={analysisResult} />
        ) : (
          <Card className="flex h-[600px] items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Wand2 className="mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">
                Your analysis will appear here
              </h3>
              <p className="mt-2 text-sm">
                Paste your resume on the left and click &quot;Analyze Resume&quot; to begin.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
