import type { MatchResumeToJobDescriptionOutput } from '@/ai/flows/match-resume-to-job-description';
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

interface MatchResultsProps {
  result: MatchResumeToJobDescriptionOutput;
}

export function MatchResults({ result }: MatchResultsProps) {
  const feedbackSections = [
    { title: 'Missing Skills', content: result.missingSkills },
    { title: 'Resume Improvement Suggestions', content: result.resumeImprovementSuggestions },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
    <div className="space-y-4 pr-4">
      <Card>
        <CardHeader>
          <CardTitle>Match Score: {result.matchPercentage}%</CardTitle>
          <CardDescription>
            This score estimates how well your resume matches the provided job description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={result.matchPercentage} className="w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role-Specific Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{result.roleSpecificFeedback}</p>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="w-full" defaultValue={['item-0']}>
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
