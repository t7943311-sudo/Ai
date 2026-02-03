import type { AnalyzeResumeAndProvideFeedbackOutput } from '@/ai/flows/analyze-resume-and-provide-feedback';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '../ui/scroll-area';

interface AnalysisResultsProps {
  result: AnalyzeResumeAndProvideFeedbackOutput;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const feedbackSections = [
    { title: 'Missing Keywords', content: result.missingKeywords },
    { title: 'Skill Gaps', content: result.skillGaps },
    { title: 'Formatting Issues', content: result.formattingIssues },
    { title: 'Bullet Point Improvements', content: result.bulletPointImprovements },
    { title: 'Role Specific Suggestions', content: result.roleSpecificSuggestions },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
    <div className="space-y-4 pr-4">
      <Card>
        <CardHeader>
          <CardTitle>ATS Score: {result.atsScore}/100</CardTitle>
          <CardDescription>
            This score estimates how well your resume will pass through Applicant Tracking Systems.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={result.atsScore} className="w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{result.overallFeedback}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rewritten Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-semibold">{result.summaryRewrite}</p>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full">
        {feedbackSections.map((section, index) =>
          section.content && section.content.length > 0 ? (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <span>{section.title}</span>
                  <Badge variant="secondary">{section.content.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ) : null
        )}
      </Accordion>
    </div>
    </ScrollArea>
  );
}
