# Application Architecture

This document provides a high-level overview of the CareerBoost AI application's architecture.

## 1. Frontend

The frontend is a single-page application built with **Next.js** and the **App Router**.

-   **Framework**: Next.js 14+
-   **Language**: TypeScript
-   **UI Library**: React with functional components and hooks.
-   **Component Library**: [ShadCN UI](https://ui.shadcn.com/), providing a set of accessible and composable components built on Radix UI and Tailwind CSS.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) is used for all styling, configured via `tailwind.config.ts` and `src/app/globals.css`. The theme is customizable through CSS variables.
-   **State Management**: For simple component state, `useState` and `useReducer` are used. For server state, we rely on custom hooks that interact with Firebase (`useUser`, `useCollection`, `useDoc`).

### Routing

The app uses the Next.js App Router paradigm.

-   `/app/(auth)`: Contains pages related to authentication (Login, Sign Up, Forgot Password). This route group has its own layout.
-   `/app/(main)`: Contains the core application pages accessible after a user logs in (Dashboard, Analyze, etc.). This route group is protected and has its own layout with a sidebar and header.
-   `/app/page.tsx`: The public landing page.

## 2. Backend (Firebase)

The application uses **Firebase** for its backend services.

-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) is used to manage user sign-up and sign-in with Email/Password and Google (OAuth). The `useUser` hook (`src/firebase/auth/use-user.tsx`) provides the current user's state throughout the app.
-   **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) is the NoSQL database used to store all application data. The schema is defined in `docs/backend.json`.
    -   `/users/{userId}`: Stores user profile information and settings.
    -   `/resumeAnalyses/{analysisId}`: Logs the results of every resume analysis.
    -   `/jobMatches/{jobMatchId}`: Stores the results of resume-to-job-description matches.
    -   `/activityHistory/{activityId}`: A chronological log of user actions.
-   **Security**: [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started) (`firestore.rules`) are in place to ensure that users can only access and modify their own data.

## 3. AI and Generative Features (Genkit)

All generative AI functionality is managed by **Genkit**, a framework for building production-ready AI-powered features.

-   **Configuration**: Genkit is initialized in `src/ai/genkit.ts`. It's configured to use Google's **Gemini** models.
-   **Flows**: Business logic that involves AI is encapsulated in "flows," located in `src/ai/flows/`. A flow defines the inputs, outputs, and the steps required to perform an AI-driven task.
    -   `analyze-resume-and-provide-feedback.ts`: Takes resume text and returns a detailed analysis.
    -   `match-resume-to-job-description.ts`: Compares a resume to a job description.
    -   `rewrite-bullet-points-for-impact.ts`: Rewrites resume bullet points.
    -   `parse-resume-document.ts`: Extracts text from PDF or DOCX files.
-   **Prompts**: Within each flow, `ai.definePrompt` is used to create a prompt template that instructs the LLM on what to do. These prompts use Handlebars templating (`{{{...}}}`) to insert dynamic data.
-   **Schema Validation**: [Zod](https://zod.dev/) is used to define the input and output schemas for each flow. This ensures that the data passed to and from the AI is correctly structured and typed. Genkit uses these schemas to enforce structured output from the model.

## 4. Data Flow Example: Analyzing a Resume

1.  **User Action**: The user pastes their resume text into the textarea on the `/analyze` page and clicks "Analyze Resume".
2.  **Client-Side**: The React component (`src/app/(main)/analyze/page.tsx`) enters a pending state.
3.  **Server Action**: It calls the `analyzeResumeAndProvideFeedback` server function.
4.  **Genkit Flow**: This function invokes the `analyzeResumeAndProvideFeedbackFlow` defined in `src/ai/flows/analyze-resume-and-provide-feedback.ts`.
5.  **LLM Call**: The flow formats the resume text into a prompt and sends it to the Gemini model via the `googleAI` plugin. The prompt requests the output to be in the JSON format defined by the Zod output schema.
6.  **Response**: The Gemini model processes the request and returns a structured JSON object.
7.  **Database Write**: The flow receives the analysis result. The client-side code then writes this result to the `resumeAnalyses` and `activityHistory` collections in Firestore.
8.  **UI Update**: The result is sent back to the client, the pending state ends, and the `AnalysisResults` component displays the feedback to the user.
