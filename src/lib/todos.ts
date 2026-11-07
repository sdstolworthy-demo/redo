import { asc, eq, not } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { db } from "./db";

export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Todo = { id: string; text: string; done: boolean };

const columns = { id: todos.id, text: todos.text, done: todos.done };

export const MAX_TODO_LENGTH = 500;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isTodoId(id: string): boolean {
  return UUID.test(id);
}

export function listTodos(): Promise<Todo[]> {
  return db().select(columns).from(todos).orderBy(asc(todos.createdAt), asc(todos.id));
}

export async function createTodo(text: string): Promise<Todo> {
  const [todo] = await db().insert(todos).values({ text }).returning(columns);
  return todo;
}

export async function toggleTodo(id: string): Promise<Todo | undefined> {
  const [todo] = await db()
    .update(todos)
    .set({ done: not(todos.done) })
    .where(eq(todos.id, id))
    .returning(columns);
  return todo;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const deleted = await db().delete(todos).where(eq(todos.id, id)).returning({ id: todos.id });
  return deleted.length > 0;
}
