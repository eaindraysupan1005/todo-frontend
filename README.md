# Todo List (frontend)

A responsive to-do list web app. This repository is the **frontend**; it talks to the REST API in the companion backend repository:

- Backend: https://github.com/eaindraysupan1005/todo-backend
- Frontend: https://github.com/eaindraysupan1005/todo-frontend

## Features

- Add a todo (blank titles are rejected with a message)
- Mark a todo complete / incomplete (completed items are struck through)
- Edit a todo's title
- Delete a todo
- Loading, empty-list and error states (with a Retry button)
- Responsive layout for desktop and mobile
- Every action goes through the REST API and is stored in PostgreSQL, so the list persists after a page refresh

## Tech stack

React 18, Vite, TypeScript, plain CSS (media queries), native `fetch`. Backend: Node.js, Express, `pg`, PostgreSQL (Supabase).

## Setup

Run the backend first (see the backend README), then:

1. Copy `.env.example` to `.env` and set the API URL:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

   `.env` is not committed; `.env.example` shows the format.

2. Install and start:

   ```bash
   npm install
   npm run dev
   ```

   The app runs at http://localhost:5173 and the backend at http://localhost:3000.

Production build: `npm run build` (output in `dist/`).

The backend `CORS_ORIGIN` must include the origin this app is served from (default `http://localhost:5173`).
