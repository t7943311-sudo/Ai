# **App Name**: CareerBoost AI

## Core Features:

- Authentication: Email/password signup & login, Google OAuth (optional), protected routes, user profile stored in Firestore.
- Resume Upload & Analysis: Upload PDF/DOCX resumes, store files in Firebase Storage, extract text via resume parser. AI analyzes resume for ATS score, missing keywords, skill gaps, formatting issues, bullet-point quality. Save results to Firestore.
- Job Description Matching: User pastes a job description. AI compares resume vs job. Return match percentage, missing skills, resume improvement suggestions, role-specific feedback.
- AI Suggestions Engine: Rewrite bullet points (impact-focused), improve professional summary, suggest new skills & projects, career improvement recommendations.
- Dashboard: Resume score history, job match history, improvement timeline, charts and clear metrics.
- Export: Download improved resume as ATS-friendly PDF, copy AI-generated bullet points.
- AI-Enhanced Bullet Point Rewriting Tool: Provide a tool to rewrite bullet points to be more impactful and ATS-optimized using AI reasoning and prompts.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) for a professional and trustworthy feel.
- Background color: Very light grey (#F5F5F5), close in hue to the primary, creating a clean backdrop that doesn't distract from the content.
- Accent color: A slightly darker shade of violet (#7986CB), to provide highlights and indicate user actions.
- Body and headline font: 'Inter' for a modern, machined, objective, neutral look.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use clean, professional icons from a library like FontAwesome or Material Design to represent different features and actions.
- Implement subtle transitions and animations to enhance user experience when navigating the dashboard and viewing analysis results.