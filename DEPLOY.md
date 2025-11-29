# Deployment Guide for Vercel

This project is configured to be deployed on Vercel as a full-stack application (Next.js Frontend + Python Serverless Backend).

## Prerequisites

1.  **GitHub Repository**: Push this entire `viraledge-backend` folder to a GitHub repository.
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).

## Deployment Steps

1.  **Import Project**:
    *   Go to Vercel Dashboard -> "Add New..." -> "Project".
    *   Select your GitHub repository.

2.  **Configure Project**:
    *   **Framework Preset**: Select `Next.js`.
    *   **Root Directory**: Click "Edit" and select `frontend`.
        *   *Important*: This ensures Vercel sees the `package.json` and `api/` folder correctly.

3.  **Environment Variables**:
    *   Add the following variables in the Vercel "Environment Variables" section:
        *   `DATABASE_URL`: Your production database URL (e.g., from Neon, Supabase, or Railway).
        *   `KINDE_CLIENT_ID`: Your Kinde Client ID.
        *   `KINDE_CLIENT_SECRET`: Your Kinde Client Secret.
        *   `KINDE_ISSUER_URL`: Your Kinde Issuer URL.
        *   `KINDE_SITE_URL`: `https://<your-project>.vercel.app`
        *   `KINDE_POST_LOGOUT_REDIRECT_URL`: `https://<your-project>.vercel.app`
        *   `KINDE_POST_LOGIN_REDIRECT_URL`: `https://<your-project>.vercel.app/dashboard`
        *   `OPENROUTER_API_KEY`: Your OpenRouter API Key for DeepSeek.
        *   `STRIPE_SECRET_KEY`: Your Stripe Secret Key.
        *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe Publishable Key.
        *   `STRIPE_WEBHOOK_SECRET`: Your Stripe Webhook Secret.

4.  **Deploy**:
    *   Click "Deploy".

## Local Development

To run the project locally after the restructuring:

1.  **Frontend (Next.js)**:
    ```bash
    cd frontend
    npm run dev
    ```
    *   Runs on `http://localhost:3000`.

2.  **Backend (Python)**:
    ```bash
    cd frontend
    uvicorn api.py.index:app --reload --port 8000
    ```
    *   Runs on `http://localhost:8000`.
    *   Note: The Python code is now located in `frontend/api/py`.

## Folder Structure

*   `frontend/`: Contains the Next.js application.
*   `frontend/api/py/`: Contains the Python backend code (Serverless Functions).
*   `frontend/requirements.txt`: Python dependencies for Vercel.
