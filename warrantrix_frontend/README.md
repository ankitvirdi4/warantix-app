# Warrantrix Frontend

Internal dashboard UI for the Warranty Intelligence Copilot. Built with React, TypeScript, Vite, Material UI, React Query, and React Router.

## Getting started

```bash
npm install
npm run dev
```

The app expects the FastAPI backend to be running locally at `http://localhost:8000`. You can override the API base URL by setting `VITE_API_BASE_URL` in a `.env` file at the project root.

## Available scripts

- `npm run dev` – start Vite development server
- `npm run build` – build for production
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint with the configured TypeScript rules

## Environment variables

- `VITE_API_BASE_URL` – base URL of the FastAPI API (defaults to `http://localhost:8000/api/v1` for local development). Set this to the Render backend URL (e.g. `https://warrantrix-backend.onrender.com/api/v1`) in hosted environments such as Vercel.

## Deploying to Vercel

1. Push this repository to GitHub.
2. In the Vercel dashboard choose **Add New Project** and import the GitHub repo.
3. Select the **Vite** framework preset. Keep the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add the required environment variable under **Project → Settings → Environment Variables**:
   - `VITE_API_BASE_URL=https://warrantrix-backend.onrender.com/api/v1`
   Configure it for the Production environment (and optionally Preview/Development).
5. Deploy the project. After the build completes, open `https://<project-name>.vercel.app` and verify that the application loads without console errors and that API requests hit the Render backend (check the browser network tab for CORS/HTTPS issues).

## Architecture

```
src/
├── api/           # Axios client + strongly typed API calls
├── components/    # Reusable UI building blocks (layout, charts, tables, common widgets)
├── context/       # Authentication provider and hooks
├── hooks/         # Domain-specific hooks (auth, error helpers)
├── pages/         # Route-aligned pages
├── router/        # React Router configuration with protected routes
├── theme/         # Material UI theme configuration
└── types/         # Shared TypeScript types for API contracts
```

The dashboard uses React Query for data fetching, caching, and background refresh. Authentication state is stored in context and persisted to `localStorage` so users remain signed in across sessions.
