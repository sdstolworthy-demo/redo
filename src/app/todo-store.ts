export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "redo.todos";
const EMPTY: Todo[] = [];

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedTodos: Todo[] = EMPTY;

// useSyncExternalStore needs a stable snapshot, so parse only when the stored string changes.
export function getTodos(): Todo[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedTodos = raw ? (JSON.parse(raw) as Todo[]) : EMPTY;
    } catch {
      cachedTodos = EMPTY;
    }
  }
  return cachedTodos;
}

export function getServerTodos(): Todo[] {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function save(todos: Todo[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  listeners.forEach((listener) => listener());
}

export function addTodo(text: string) {
  save([...getTodos(), { id: crypto.randomUUID(), text, done: false }]);
}

export function toggleTodo(id: string) {
  save(getTodos().map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
}
