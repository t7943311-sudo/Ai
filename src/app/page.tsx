
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileScan, GitCompareArrows, PenSquare, GaugeCircle, Wand2, ShieldCheck, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/firebase';
import { InteractiveAnalyzer } from '@/components/feature/interactive-analyzer';

const features = [
  {
    icon: FileScan,
    title: 'AI-Powered Resume Analysis',
    description: 'Get an in-depth review of your resume, identifying strengths and weaknesses.',
  },
  {
    icon: GitCompareArrows,
    title: 'Job Description Matching',
    description: 'See how well your resume aligns with a specific job description and get a match score.',
  },
  {
    icon: PenSquare,
    title: 'Impactful Bullet Point Rewriting',
    description: 'Transform your experience into powerful, quantified achievements that grab attention.',
  },
  {
    icon: GaugeCircle,
    title: 'ATS Optimization Score',
    description: 'Understand how your resume will be read by Applicant Tracking Systems and improve it.',
  },
  {
    icon: Wand2,
    title: 'Personalized Suggestions',
    description: 'Receive tailored recommendations to make your resume stand out for your target role.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'Your data is yours. All analyses are performed securely, and your information is never shared.',
  },
];

const testimonials = [
  {
    quote: "CareerBoost AI was a game-changer. The ATS score helped me understand what I was missing, and the bullet point rewriter is pure magic. I landed three interviews within a week of updating my resume!",
    name: "Sarah J.",
    role: "Product Manager",
    avatar: "https://picsum.photos/seed/avatar1/100/100",
    avatarHint: "person face"
  },
  {
    quote: "I was skeptical about AI resume tools, but this one is different. The job match feature is incredibly accurate and showed me exactly where to focus my edits. Highly recommended.",
    name: "Michael B.",
    role: "Software Engineer",
    avatar: "https://picsum.photos/seed/avatar2/100/100",
    avatarHint: "person face"
  }
]

export default function LandingPage() {
  const { user, loading } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <AppLogo className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-semibold">CareerBoost AI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : user ? (
            <Link href="/dashboard" prefetch={false}>
              <Button>Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/login" prefetch={false}>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup" prefetch={false}>
                <Button>Get Started Free</Button>
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full pt-20 md:pt-32 pb-12 md:pb-24 lg:pb-32 relative">
           <div className="absolute top-0 left-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                   <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                    AI-Powered Career Tools
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Build a Resume That Gets You Hired
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Stop guessing what recruiters want. CareerBoost AI provides instant, data-driven feedback to optimize your resume, beat the bots, and land your dream job.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup" prefetch={false}>
                    <Button size="lg">Analyze Your Resume Free</Button>
                  </Link>
                  <Link href="#features" prefetch={false}>
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
                <div className="flex items-center justify-center">
                    <Image
                        src="https://picsum.photos/seed/career-hero-2/600/500"
                        width="600"
                        height="500"
                        alt="A modern, professional resume being analyzed on a screen"
                        className="mx-auto aspect-[6/5] overflow-hidden rounded-xl object-cover"
                        data-ai-hint="resume analysis tech"
                    />
                </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Smarter Way to Job Hunt
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our suite of AI tools gives you a professional edge. Go beyond simple spell-checking and get expert-level feedback in seconds.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return(
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <div className="bg-primary/10 p-3 rounded-full w-fit">
                                <Icon className="h-8 w-8 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                  )
              })}
            </div>
          </div>
        </section>

        {/* Interactive Analyzer Section */}
        <section id="try-it" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Get Instant Feedback
                    </h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Don't wait. See how your resume stacks up right now. Get a free analysis and discover key areas for improvement in seconds.
                    </p>
                </div>
                </div>
                <InteractiveAnalyzer />
            </div>
        </section>

        {/* See the Transformation Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">See the Transformation</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI doesn't just give advice. It rewrites and refines your content for maximum impact.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-4xl items-start gap-8 py-12 md:grid-cols-2 md:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Before</CardTitle>
                  <CardDescription>A standard resume bullet point.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    &quot;Responsible for managing social media accounts.&quot;
                  </p>
                </CardContent>
              </Card>
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle>After CareerBoost AI</CardTitle>
                  <CardDescription>An impact-driven, quantified achievement.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold">
                    &quot;Grew social media engagement by 45% across three platforms in six months by implementing a data-driven content strategy.&quot;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Trusted by Professionals
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what job seekers are saying about CareerBoost AI.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              {testimonials.map((testimonial, index) => (
                 <Card key={index} className="h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)}
                      </div>
                      <blockquote className="text-lg font-semibold leading-snug">
                        “{testimonial.quote}”
                      </blockquote>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                       <Image
                          src={testimonial.avatar}
                          width={48}
                          height={48}
                          alt={`Avatar of ${testimonial.name}`}
                          className="rounded-full"
                          data-ai-hint={testimonial.avatarHint}
                        />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Stop Applying. Start Interviewing.
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Your next career move is just one click away. Get your free, instant resume analysis and see the difference AI can make.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Link href="/signup" prefetch={false}>
                <Button className="w-full" size="lg">
                  Sign Up and Get Started
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                Free to start. No credit card required.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CareerBoost AI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
