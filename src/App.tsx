import { FormEvent, useCallback, useEffect, useState } from "react";
import { createTodo, deleteTodo, listTodos, updateTodo } from "./api";
import type { Todo } from "./types";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [busyIds, setBusyIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setTodos(await listTodos());
    } catch (e) {
      setLoadError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const withBusy = async (id: number, fn: () => Promise<void>) => {
    setActionError(null);
    setBusyIds((ids) => [...ids, id]);
    try {
      await fn();
    } catch (e) {
      setActionError((e as Error).message);
    } finally {
      setBusyIds((ids) => ids.filter((x) => x !== id));
    }
  };

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setFormError("Please enter a task title.");
      return;
    }
    setFormError(null);
    setActionError(null);
    setAdding(true);
    try {
      const created = await createTodo(trimmed);
      setTodos((t) => [created, ...t]);
      setTitle("");
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setAdding(false);
    }
  };

  const onToggle = (todo: Todo) =>
    withBusy(todo.id, async () => {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos((t) => t.map((x) => (x.id === updated.id ? updated : x)));
    });

  const onDelete = (todo: Todo) =>
    withBusy(todo.id, async () => {
      await deleteTodo(todo.id);
      setTodos((t) => t.filter((x) => x.id !== todo.id));
    });

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setActionError(null);
  };

  const saveEdit = (todo: Todo) => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setActionError("Title cannot be blank.");
      return;
    }
    return withBusy(todo.id, async () => {
      const updated = await updateTodo(todo.id, { title: trimmed });
      setTodos((t) => t.map((x) => (x.id === updated.id ? updated : x)));
      setEditingId(null);
    });
  };

  const done = todos.filter((t) => t.completed).length;

  return (
    <main className="app">
      <header>
        <h1>Todo List</h1>
        <p className="subtitle">Keep track of what you need to get done.</p>
      </header>

      <form className="add-form" onSubmit={onAdd} noValidate>
        <label htmlFor="new-title" className="sr-only">
          New task title
        </label>
        <input
          id="new-title"
          type="text"
          value={title}
          maxLength={255}
          placeholder="What needs to be done?"
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={formError ? true : undefined}
          aria-describedby={formError ? "form-error" : undefined}
        />
        <button type="submit" disabled={adding}>
          {adding ? "Adding…" : "Add task"}
        </button>
      </form>
      {formError && (
        <p id="form-error" className="error" role="alert">
          {formError}
        </p>
      )}
      {actionError && (
        <p className="error banner" role="alert">
          {actionError}
        </p>
      )}

      {loading ? (
        <p className="status" role="status">
          Loading tasks…
        </p>
      ) : loadError ? (
        <div className="error banner" role="alert">
          <p>{loadError}</p>
          <button type="button" onClick={load}>
            Retry
          </button>
        </div>
      ) : todos.length === 0 ? (
        <p className="status">No tasks yet. Add your first one above.</p>
      ) : (
        <>
          <p className="counts">
            {done} of {todos.length} completed
          </p>
          <ul className="todo-list">
            {todos.map((todo) => {
              const busy = busyIds.includes(todo.id);
              const editing = editingId === todo.id;
              return (
                <li key={todo.id} className={todo.completed ? "todo completed" : "todo"}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    disabled={busy || editing}
                    onChange={() => onToggle(todo)}
                    aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "completed"}`}
                  />
                  {editing ? (
                    <form
                      className="edit-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveEdit(todo);
                      }}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        maxLength={255}
                        autoFocus
                        aria-label="Edit task title"
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <button type="submit" disabled={busy}>
                        Save
                      </button>
                      <button type="button" className="secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <span className="title">{todo.title}</span>
                      <button type="button" className="secondary" disabled={busy} onClick={() => startEdit(todo)}>
                        Edit
                      </button>
                      <button type="button" className="danger" disabled={busy} onClick={() => onDelete(todo)}>
                        Delete
                      </button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
