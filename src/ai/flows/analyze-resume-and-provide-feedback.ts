'use server';
/**
 * @fileOverview Analyzes a resume and provides feedback on ATS score, missing keywords,
 * skill gaps, formatting issues, and bullet point improvements.
 *
 * - analyzeResumeAndProvideFeedback - A function that handles the resume analysis process.
 * - AnalyzeResumeAndProvideFeedbackInput - The input type for the analyzeResumeAndProvideFeedback function.
 * - AnalyzeResumeAndProvideFeedbackOutput - The return type for the analyzeResumeAndProvideFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeAndProvideFeedbackInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to be analyzed.'),
});
export type AnalyzeResumeAndProvideFeedbackInput = z.infer<typeof AnalyzeResumeAndProvideFeedbackInputSchema>;

const AnalyzeResumeAndProvideFeedbackOutputSchema = z.object({
  atsScore: z.number().describe('The ATS score of the resume (0-100).'),
  missingKeywords: z.array(z.string()).describe('Keywords missing from the resume.'),
  skillGaps: z.array(z.string()).describe('Skill gaps identified in the resume.'),
  formattingIssues: z.array(z.string()).describe('Formatting issues found in the resume.'),
  bulletPointImprovements: z.array(z.string()).describe('Suggestions for improving bullet points in the resume.'),
  roleSpecificSuggestions: z.array(z.string()).describe('Role specific suggestions to improve the resume.'),
  summaryRewrite: z.string().describe('Rewritten professional summary for the resume.'),
  overallFeedback: z.string().describe('Overall feedback on the resume.'),
});
export type AnalyzeResumeAndProvideFeedbackOutput = z.infer<typeof AnalyzeResumeAndProvideFeedbackOutputSchema>;

export async function analyzeResumeAndProvideFeedback(input: AnalyzeResumeAndProvideFeedbackInput): Promise<AnalyzeResumeAndProvideFeedbackOutput> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('The AI service is not configured. Please set the GEMINI_API_KEY environment variable on your server.');
  }
  return analyzeResumeAndProvideFeedbackFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeAndProvideFeedbackInputSchema},
  output: {schema: AnalyzeResumeAndProvideFeedbackOutputSchema},
  prompt: `You are an ATS-optimized resume analyzer and career assistant.

Analyze the provided resume and optional job description.

Return ONLY valid JSON with:
1. atsScore (0–100)
2. missingKeywords []
3. skillGaps []
4. formattingIssues []
5. bulletPointImprovements []
6. roleSpecificSuggestions []
7. summaryRewrite
8. overallFeedback

Rules:
- Optimize strictly for ATS systems
- Focus on clarity, measurable impact, and recruiter readability
- Avoid generic advice
- Be precise and actionable
- Output JSON only

Resume:
{{{resumeText}}}`,
});

const analyzeResumeAndProvideFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeResumeAndProvideFeedbackFlow',
    inputSchema: AnalyzeResumeAndProvideFeedbackInputSchema,
    outputSchema: AnalyzeResumeAndProvideFeedbackOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
