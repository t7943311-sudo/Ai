'use server';

/**
 * @fileOverview A flow to rewrite resume bullet points to be more impactful and ATS-optimized.
 *
 * - rewriteBulletPointsForImpact - A function that handles the bullet point rewriting process.
 * - RewriteBulletPointsInput - The input type for the rewriteBulletPointsForImpact function.
 * - RewriteBulletPointsOutput - The return type for the rewriteBulletPointsForImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteBulletPointsInputSchema = z.object({
  bulletPoints: z.array(z.string()).describe('The bullet points to rewrite.'),
  jobDescription: z.string().optional().describe('Optional job description for context.'),
});
export type RewriteBulletPointsInput = z.infer<typeof RewriteBulletPointsInputSchema>;

const RewriteBulletPointsOutputSchema = z.object({
  rewrittenBulletPoints: z.array(z.string()).describe('The rewritten bullet points.'),
  overallFeedback: z.string().describe('Overall feedback on the rewritten bullet points.'),
});
export type RewriteBulletPointsOutput = z.infer<typeof RewriteBulletPointsOutputSchema>;

export async function rewriteBulletPointsForImpact(input: RewriteBulletPointsInput): Promise<RewriteBulletPointsOutput> {
  return rewriteBulletPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rewriteBulletPointsPrompt',
  input: {schema: RewriteBulletPointsInputSchema},
  output: {schema: RewriteBulletPointsOutputSchema},
  prompt: `You are an expert resume writer specializing in optimizing bullet points for Applicant Tracking Systems (ATS) and recruiter readability.\n\n  Rewrite the following bullet points to be more impact-focused, highlighting accomplishments and quantifying contributions whenever possible. Focus on clarity, measurable impact, and recruiter readability. Avoid generic advice and be precise and actionable.\n\n  Job Description (if provided): {{{jobDescription}}}\n\n  Original Bullet Points:\n  {{#each bulletPoints}}\n  - {{{this}}}\n  {{/each}}\n\n  Return the rewritten bullet points as an array of strings and provide overall feedback on the rewritten bullet points.\n\n  Ensure the response is valid JSON.\n  `,
});

const rewriteBulletPointsFlow = ai.defineFlow(
  {
    name: 'rewriteBulletPointsFlow',
    inputSchema: RewriteBulletPointsInputSchema,
    outputSchema: RewriteBulletPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
