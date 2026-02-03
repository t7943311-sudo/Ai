'use server';
/**
 * @fileOverview Matches a resume against a job description, providing a match percentage, missing skills, and resume improvement suggestions.
 *
 * - matchResumeToJobDescription - A function that handles the resume matching process.
 * - MatchResumeToJobDescriptionInput - The input type for the matchResumeToJobDescription function.
 * - MatchResumeToJobDescriptionOutput - The return type for the matchResumeToJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchResumeToJobDescriptionInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
  jobDescription: z.string().describe('The job description text.'),
});
export type MatchResumeToJobDescriptionInput = z.infer<typeof MatchResumeToJobDescriptionInputSchema>;

const MatchResumeToJobDescriptionOutputSchema = z.object({
  matchPercentage: z.number().describe('The percentage match between the resume and the job description (0-100).'),
  missingSkills: z.array(z.string()).describe('An array of skills missing from the resume that are present in the job description.'),
  resumeImprovementSuggestions: z.array(z.string()).describe('Specific suggestions for improving the resume to better match the job description.'),
  roleSpecificFeedback: z.string().describe('Role-specific feedback on the resume based on the job description'),
});
export type MatchResumeToJobDescriptionOutput = z.infer<typeof MatchResumeToJobDescriptionOutputSchema>;

export async function matchResumeToJobDescription(input: MatchResumeToJobDescriptionInput): Promise<MatchResumeToJobDescriptionOutput> {
  return matchResumeToJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchResumeToJobDescriptionPrompt',
  input: {schema: MatchResumeToJobDescriptionInputSchema},
  output: {schema: MatchResumeToJobDescriptionOutputSchema},
  prompt: `You are a resume expert, skilled in matching resumes to job descriptions and providing actionable feedback.

  Analyze the following resume and job description to determine the match percentage, identify missing skills, and suggest resume improvements.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}

  Return ONLY valid JSON with the following structure:
  {
    "matchPercentage": number (0-100),
    "missingSkills": string[],
    "resumeImprovementSuggestions": string[],
    "roleSpecificFeedback": string
  }

  Be precise and actionable. Focus on clarity, measurable impact, and recruiter readability.
  Avoid generic advice.
`,
});

const matchResumeToJobDescriptionFlow = ai.defineFlow(
  {
    name: 'matchResumeToJobDescriptionFlow',
    inputSchema: MatchResumeToJobDescriptionInputSchema,
    outputSchema: MatchResumeToJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
