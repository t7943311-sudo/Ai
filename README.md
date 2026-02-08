# CareerBoost AI

CareerBoost AI is a Next.js web application designed to help job seekers optimize their resumes and improve their chances of landing their dream job. It leverages AI to provide data-driven feedback, match resumes to job descriptions, and rewrite content for maximum impact.

![CareerBoost AI Screenshot](https://i.ibb.co/W21x0p3/image.png)

## ✨ Features

-   **🤖 AI-Powered Resume Analysis**: Get an instant, in-depth review of your resume, including an ATS (Applicant Tracking System) score, keyword analysis, and formatting suggestions.
-   **🎯 Job Description Matching**: See how well your resume aligns with a specific job description and get a percentage match score.
-   **✍️ Impactful Bullet Point Rewriting**: Transform your job experiences into powerful, quantified achievements that grab recruiters' attention.
-   **🔒 Secure & Private**: Your data is stored securely in your own private Firebase project.
-   **📈 Activity History & Progress Tracking**: Monitor your resume score improvements over time and review all your past analyses and job matches.
-   **🌗 Light & Dark Mode**: Choose your preferred theme for a comfortable user experience.
-   **🆓 Anonymous Usage**: Try out the core analysis feature for free without creating an account.

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [Firebase](https://firebase.google.com/) project.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/careerboost-ai.git
    cd careerboost-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    -   Go to your Firebase project settings.
    -   Create a new Web App.
    -   Copy the `firebaseConfig` object.
    -   Paste it into `src/firebase/config.ts`.
    -   Create a `.env` file in the root of the project and add your Gemini API Key:
        ```
        GEMINI_API_KEY=your_gemini_api_key
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:9002`.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models.
-   **Form Management**: [React Hook Form](https://react-hook-form.com/)
-   **Schema Validation**: [Zod](https://zod.dev/)

## 📁 Key File Structure

```
.
├── src
│   ├── app                 # Next.js App Router pages
│   │   ├── (auth)          # Auth routes (login, signup)
│   │   ├── (main)          # Main authenticated app routes
│   │   ├── api             # API routes
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout
│   ├── ai                  # Genkit flows and configuration
│   │   ├── flows           # AI-powered business logic
│   │   └── genkit.ts       # Genkit initialization
│   ├── components          # Reusable React components
│   │   ├── feature         # App-specific feature components
│   │   ├── layout          # Layout components (header, sidebar)
│   │   └── ui              # ShadCN UI components
│   ├── firebase            # Firebase configuration and hooks
│   ├── hooks               # Custom React hooks
│   └── lib                 # Utility functions and helpers
├── docs                    # Project documentation
└── public                  # Static assets
```

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
