'use client';

import type { RewriteBulletPointsOutput } from '@/ai/flows/rewrite-bullet-points-for-impact';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface RewriteResultsProps {
  originalPoints: string[];
  result: RewriteBulletPointsOutput;
}

export function RewriteResults({ originalPoints, result }: RewriteResultsProps) {
    const { toast } = useToast();
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast({ title: "Copied to clipboard!"});
        setTimeout(() => setCopiedIndex(null), 2000);
    };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
    <div className="space-y-4 pr-4">
      <Card>
        <CardHeader>
          <CardTitle>Rewritten Bullet Points</CardTitle>
          <CardDescription>{result.overallFeedback}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.rewrittenBulletPoints.map((rewrittenPoint, index) => (
            <div key={index} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-through">
                  {originalPoints[index] || 'Original point not available'}
                </p>
                <div className="flex items-start gap-4">
                    <p className="flex-1 text-sm font-semibold">{rewrittenPoint}</p>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(rewrittenPoint, index)}>
                        {copiedIndex === index ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
              {index < result.rewrittenBulletPoints.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
    </ScrollArea>
  );
}
