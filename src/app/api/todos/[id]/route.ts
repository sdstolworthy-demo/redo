import { deleteTodo, isTodoId, toggleTodo } from "@/lib/todos";

const notFound = () => Response.json({ error: "not found" }, { status: 404 });

export async function PATCH(_request: Request, ctx: RouteContext<"/api/todos/[id]">) {
  const { id } = await ctx.params;
  if (!isTodoId(id)) return notFound();
  const todo = await toggleTodo(id);
  return todo ? Response.json(todo) : notFound();
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/todos/[id]">) {
  const { id } = await ctx.params;
  if (!isTodoId(id)) return notFound();
  return (await deleteTodo(id)) ? new Response(null, { status: 204 }) : notFound();
}
