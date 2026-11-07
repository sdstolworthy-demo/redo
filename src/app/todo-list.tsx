"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { addTodo, getServerTodos, getTodos, subscribe, toggleTodo } from "./todo-store";

export default function TodoList() {
  const todos = useSyncExternalStore(subscribe, getTodos, getServerTodos);
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addTodo(trimmed);
    setText("");
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
                onChange={() => toggleTodo(todo.id)}
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
