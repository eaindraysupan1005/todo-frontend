# Todo List (frontend)

React + Vite + TypeScript UI for the Todo API. Supports add, list, complete/incomplete, edit title, and delete; includes loading, empty, and error states and a responsive layout.

## Setup

1. Start the backend first (see the backend repository README).
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` (default `http://localhost:3000`).
3. Run:

```bash
npm install
npm run dev     # http://localhost:5173
```

Build: `npm run build` (output in `dist/`).

Make sure the backend `CORS_ORIGIN` includes the origin this app is served from.
