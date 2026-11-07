import { createTodo, listTodos, MAX_TODO_LENGTH } from "@/lib/todos";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await listTodos());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text || text.length > MAX_TODO_LENGTH) {
    return Response.json({ error: `text must be 1-${MAX_TODO_LENGTH} characters` }, { status: 400 });
  }
  return Response.json(await createTodo(text), { status: 201 });
}
