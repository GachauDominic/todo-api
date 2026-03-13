import { eq, sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { TITodo, TIUser, TodoTable, UsersTable } from "../Drizzle/schema";

//create a todo
export const createTodoService = async (todo: TITodo) => {
  const [inserted] = await db.insert(TodoTable).values(todo).returning()
  if (inserted) {
    return inserted
  }
  return null
}

// get all todos
export const getTodoService = async () => {
  const todos = await db.query.TodoTable.findMany()
  return todos;
}

// get a specific todo by its id
export const getTodoByIdService = async (id: number) => {
  const todoById = await db.query.TodoTable.findFirst({
    where: eq(TodoTable.id, id)
  })
    return todoById
}

//update todo by id
export const updateTodoByIdService = async (id: number, todo: TITodo) => {
  await db.update(TodoTable).set(todo).where(eq(TodoTable.id, id))
  return "Todo updated successfully!"
}

//delete a todo by its id
export const deleteTodoByIdService = async (id: number) => {
  await db.delete(TodoTable).where(eq(TodoTable.id, id)).returning()
  return "Todo deleted successfully";
}


