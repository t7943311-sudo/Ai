'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileScan, GitCompareArrows, PenSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface OnboardingGuideProps {
  onComplete: () => void;
  name: string;
}

const steps = [
  {
    icon: FileScan,
    title: 'Analyze Your Resume',
    description: 'Get an instant AI-powered analysis of your resume to see your ATS score and areas for improvement.',
    href: '/analyze',
    cta: 'Analyze Resume',
  },
  {
    icon: GitCompareArrows,
    title: 'Match to a Job',
    description: 'Compare your resume against a specific job description to identify skill gaps and get tailored feedback.',
    href: '/match-job',
    cta: 'Match to Job',
  },
  {
    icon: PenSquare,
    title: 'Rewrite Bullet Points',
    description: 'Turn your responsibilities into impactful, quantified achievements that catch recruiters\' eyes.',
    href: '/rewrite',
    cta: 'Rewrite Points',
  },
];

export function OnboardingGuide({ onComplete, name }: OnboardingGuideProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Welcome to CareerBoost AI, {name}!</CardTitle>
        </div>
        <CardDescription>
          Here’s a quick guide to get you started on the path to your dream job.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">{step.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-1">{step.description}</p>
            <Button asChild variant="secondary" className="mt-2 w-fit">
              <Link href={step.href}>
                {step.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={onComplete}>
          Got it, let&apos;s get started!
        </Button>
      </CardFooter>
    </Card>
  );
}
