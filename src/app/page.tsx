import { connection } from "next/server";
import { listTodos } from "@/lib/todos";
import TodoList from "./todo-list";

export default async function Home() {
  // The shared list lives in the database, so render it per request, never at build time.
  await connection();
  const todos = await listTodos();

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-8 bg-white px-8 py-24 dark:bg-black">
        <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">Redo</h1>
        <TodoList initialTodos={todos} />
      </main>
    </div>
  );
}
