import type { Todo } from "./types";

const BASE = `${(import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/api/todos`;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check that the API is running.");
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      message = (await res.json()).error ?? message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const listTodos = () => request<Todo[]>(BASE);

export const createTodo = (title: string) =>
  request<Todo>(BASE, { method: "POST", body: JSON.stringify({ title }) });

export const updateTodo = (id: number, changes: Partial<Pick<Todo, "title" | "completed">>) =>
  request<Todo>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(changes) });

export const deleteTodo = (id: number) => request<void>(`${BASE}/${id}`, { method: "DELETE" });
