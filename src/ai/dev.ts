import { config } from 'dotenv';
config();

import '@/ai/flows/match-resume-to-job-description.ts';
import '@/ai/flows/analyze-resume-and-provide-feedback.ts';
import '@/ai/flows/rewrite-bullet-points-for-impact.ts';