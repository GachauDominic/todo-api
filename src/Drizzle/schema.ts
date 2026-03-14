import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";


// role Enum
export const roleEnum = pgEnum("role", ["admin", "user"])

// Users Table
export const UsersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first-name", {length: 50}).notNull(),
  lastName: varchar("last-name", {length: 50}).notNull(),
  email: varchar("email", {length: 100}).unique().notNull(),
  password: varchar("password", {length: 255}).notNull(),
  role: roleEnum("role").default("user")

})


// Todo Table
export const TodoTable = pgTable("todo", {
  id: serial("id").primaryKey(),
  userId: integer("user-id").notNull().references(()=> UsersTable.id, {onDelete: 'cascade'}),
  todoName: varchar("todo-name", {length: 100}).notNull(),
  createdAt: timestamp("created-at").defaultNow(),
  dueDate: timestamp("due-date"),
  descrption: text("description"),
  isCompleted: boolean("is-completed").default(false)
})


// Relationships
// user 1-n todo
export const UserRelations = relations(UsersTable, ({many})=>({
  todo: many(TodoTable)
}) )

// todo n-1 user
export const TodoRelations = relations(TodoTable, ({one})=>({
  user: one(UsersTable, {
    fields: [TodoTable.userId],
    references: [UsersTable.id]
  })
}))


//infer types
export type TIUser = typeof UsersTable.$inferInsert
export type TsUser = typeof UsersTable.$inferSelect
export type TITodo = typeof TodoTable.$inferInsert
export type TsTodo = typeof TodoTable.$inferSelect
