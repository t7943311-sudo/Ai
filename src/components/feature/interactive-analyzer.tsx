'use client';

import { useState, useTransition, useEffect } from 'react';
import { analyzeResumeAndProvideFeedback } from '@/ai/flows/analyze-resume-and-provide-feedback';
import type { AnalyzeResumeAndProvideFeedbackOutput } from '@/ai/flows/analyze-resume-and-provide-feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Wand2, TriangleAlert, ShieldCheck } from 'lucide-react';
import { AnalysisResults } from '@/components/feature/analysis-results';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { ResumeInput } from '@/components/feature/resume-input';
import Link from 'next/link';

const ANONYMOUS_USAGE_LIMIT = 5;
const STORAGE_KEY = 'careerboost_anonymous_usage';

export function InteractiveAnalyzer() {
  const { user } = useUser();
  const [resumeText, setResumeText] = useState('');
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeResumeAndProvideFeedbackOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && !user) {
      try {
        const storedUsage = localStorage.getItem(STORAGE_KEY);
        setUsageCount(storedUsage ? parseInt(storedUsage, 10) : 0);
      } catch (error) {
        console.warn('Could not access localStorage for usage tracking.');
        setUsageCount(ANONYMOUS_USAGE_LIMIT); 
      }
    }
  }, [user]);

  const remainingUses = ANONYMOUS_USAGE_LIMIT - usageCount;

  const handleAnalyze = () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste or upload your resume before analyzing.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user && remainingUses <= 0) {
        toast({
            title: 'Limit Reached',
            description: 'You have used all your free analyses. Please sign up for unlimited use.',
            variant: 'destructive'
        });
        return;
    }

    startTransition(async () => {
      try {
        const result = await analyzeResumeAndProvideFeedback({ resumeText });
        setAnalysisResult(result);
        
        if (!user) {
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            localStorage.setItem(STORAGE_KEY, newCount.toString());
        }

      } catch (error: any) {
        console.error('Analysis failed:', error);
        toast({
          title: 'Analysis Failed',
          description:
            error.message || 'Something went wrong. Please check your connection and try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <Card>
            <CardHeader>
                <CardTitle>Try it Now</CardTitle>
                <CardDescription>
                Get an instant analysis of your resume. Paste your resume or upload a file to see our AI in action.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ResumeInput
                value={resumeText}
                onTextChange={setResumeText}
                disabled={isPending}
                placeholder="Paste your full resume text here..."
                height="300px"
                />
                {!user && remainingUses <= 0 ? (
                    <Card className="bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                        <CardContent className="pt-6 text-center">
                            <TriangleAlert className="mx-auto h-8 w-8 text-amber-500" />
                            <h3 className="mt-2 font-semibold">Free Limit Reached</h3>
                            <p className="mt-1 text-sm text-muted-foreground">You&apos;ve used all your free analyses.</p>
                             <Button asChild className="mt-4">
                                <Link href="/signup">Sign Up for Unlimited Analyses</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
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
                    {!user && (
                        <p className="text-center text-sm text-muted-foreground">
                            You have <strong className="text-primary">{remainingUses}</strong> free {remainingUses === 1 ? 'analysis' : 'analyses'} remaining.
                        </p>
                    )}
                     {user && (
                         <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Unlimited analyses with your account.</span>
                         </div>
                    )}
                    </>
                )}
            </CardContent>
            </Card>
        </div>
        <div className="grid auto-rows-max items-start">
            {isPending ? (
            <Card className="flex h-full min-h-[400px] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">
                    Analyzing your resume... this may take a moment.
                </p>
                </div>
            </Card>
            ) : analysisResult ? (
                <div className="rounded-lg border overflow-hidden">
                    <AnalysisResults result={analysisResult} scrollAreaClassName="h-full max-h-[75vh]" />
                </div>
            ) : (
            <Card className="flex h-full min-h-[400px] items-center justify-center bg-muted/20">
                <div className="text-center text-muted-foreground">
                <Wand2 className="mx-auto h-12 w-12" />
                <h3 className="mt-4 text-lg font-semibold">
                    Your analysis will appear here
                </h3>
                <p className="mt-2 max-w-xs mx-auto text-sm">
                    Paste your resume and click &quot;Analyze Resume&quot; to get instant, AI-powered feedback.
                </p>
                </div>
            </Card>
            )}
        </div>
    </div>
  );
}
