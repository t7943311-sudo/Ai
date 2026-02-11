import {genkit, type GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const plugins: GenkitPlugin[] = [];

// Conditionally initialize the googleAI plugin only if the API key is present.
// This prevents a server crash during initialization if the key is missing in the environment.
if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.5-flash',
});
