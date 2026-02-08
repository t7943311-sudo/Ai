'use server';
/**
 * @fileOverview Parses a resume document (PDF or DOCX) and returns its text content.
 *
 * - parseResumeDocument - A function that handles the resume parsing process.
 * - ParseResumeDocumentInput - The input type for the parseResumeDocument function.
 * - ParseResumeDocumentOutput - The return type for the parseResumeDocument function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

const ParseResumeDocumentInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "A resume file as a data URI. Supported formats: PDF, DOCX. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeDocumentInput = z.infer<typeof ParseResumeDocumentInputSchema>;

const ParseResumeDocumentOutputSchema = z.object({
  text: z.string().describe('The extracted text content of the resume.'),
});
export type ParseResumeDocumentOutput = z.infer<typeof ParseResumeDocumentOutputSchema>;

export async function parseResumeDocument(input: ParseResumeDocumentInput): Promise<ParseResumeDocumentOutput> {
  return parseResumeDocumentFlow(input);
}

const parseResumeDocumentFlow = ai.defineFlow(
  {
    name: 'parseResumeDocumentFlow',
    inputSchema: ParseResumeDocumentInputSchema,
    outputSchema: ParseResumeDocumentOutputSchema,
  },
  async ({ fileDataUri }) => {
    const [header, data] = fileDataUri.split(',');
    if (!header || !data) {
        throw new Error('Invalid data URI format.');
    }

    const mimeType = header.match(/:(.*?);/)?.[1];
    const buffer = Buffer.from(data, 'base64');

    let text = '';

    if (mimeType === 'application/pdf') {
        const pdfData = await pdf(buffer);
        text = pdfData.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const docxData = await mammoth.extractRawText({ buffer });
        text = docxData.value;
    } else {
        throw new Error(`Unsupported file type: ${mimeType}. Please upload a PDF or DOCX file.`);
    }

    return { text };
  }
);
