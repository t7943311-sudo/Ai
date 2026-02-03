'use client';

import { useState, useTransition } from 'react';
import { rewriteBulletPointsForImpact } from '@/ai/flows/rewrite-bullet-points-for-impact';
import type { RewriteBulletPointsOutput } from '@/ai/flows/rewrite-bullet-points-for-impact';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, PenSquare } from 'lucide-react';
import { RewriteResults } from '@/components/feature/rewrite-results';
import { useToast } from '@/hooks/use-toast';

export default function RewritePage() {
  const [bulletPoints, setBulletPoints] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [rewriteResult, setRewriteResult] =
    useState<RewriteBulletPointsOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleRewrite = () => {
    const points = bulletPoints.split('\n').filter((p) => p.trim() !== '');
    if (points.length === 0) {
      toast({
        title: 'Error',
        description: 'Please provide at least one bullet point to rewrite.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await rewriteBulletPointsForImpact({
          bulletPoints: points,
          jobDescription: jobDescription || undefined,
        });
        setRewriteResult(result);
      } catch (error) {
        console.error('Rewrite failed:', error);
        toast({
          title: 'Rewrite Failed',
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
            <CardTitle>Bullet Point Rewriter</CardTitle>
            <CardDescription>
              Enter your bullet points to make them more impactful. Add a job
              description for tailored suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter each bullet point on a new line..."
              className="min-h-[200px] font-mono text-sm"
              value={bulletPoints}
              onChange={(e) => setBulletPoints(e.target.value)}
              disabled={isPending}
            />
            <Textarea
              placeholder="Optional: Paste job description for context..."
              className="min-h-[150px] font-mono text-sm"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isPending}
            />
            <Button onClick={handleRewrite} disabled={isPending} className="w-full">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PenSquare className="mr-2 h-4 w-4" />
              )}
              Rewrite Points
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
                Rewriting your bullet points with AI...
              </p>
            </div>
          </Card>
        ) : rewriteResult ? (
          <RewriteResults
            originalPoints={bulletPoints.split('\n').filter((p) => p.trim() !== '')}
            result={rewriteResult}
          />
        ) : (
          <Card className="flex h-[600px] items-center justify-center">
            <div className="text-center text-muted-foreground">
              <PenSquare className="mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">
                Your rewritten bullet points will appear here
              </h3>
              <p className="mt-2 text-sm">
                Enter your points on the left and click &quot;Rewrite Points&quot; to see the magic.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
