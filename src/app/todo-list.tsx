"use client";

import { useState, type FormEvent } from "react";
import type { Todo } from "@/lib/todos";

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [text, setText] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed }),
    });
    if (!response.ok) return;
    const created: Todo = await response.json();
    setTodos((current) => [...current, created]);
  }

  async function handleToggle(id: string) {
    const flip = (current: Todo[]) =>
      current.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
    setTodos(flip);
    const response = await fetch(`/api/todos/${id}`, { method: "PATCH" }).catch(() => null);
    if (!response?.ok) {
      setTodos(flip);
      return;
    }
    const updated: Todo = await response.json();
    setTodos((current) => current.map((todo) => (todo.id === id ? updated : todo)));
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="new-todo" className="sr-only">
          New to-do
        </label>
        <input
          id="new-todo"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs doing?"
          maxLength={500}
          className="flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
        >
          Add
        </button>
      </form>
      <ul aria-label="To-dos" className="flex flex-col gap-2">
        {todos.map((todo) => (
          <li key={todo.id}>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
                className="h-4 w-4"
              />
              <span className={todo.done ? "text-zinc-400 line-through" : ""}>{todo.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
