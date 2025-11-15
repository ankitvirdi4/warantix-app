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
- `npm run build` – type-check and build for production
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint with the configured TypeScript rules

## Environment variables

- `VITE_API_BASE_URL` – base URL of the FastAPI API (defaults to `http://localhost:8000/api/v1`).

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
