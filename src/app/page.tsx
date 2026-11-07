import TodoList from "./todo-list";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-8 bg-white px-8 py-24 dark:bg-black">
        <h1 className="text-5xl font-bold tracking-tight text-black dark:text-zinc-50">Redo</h1>
        <TodoList />
      </main>
    </div>
  );
}
