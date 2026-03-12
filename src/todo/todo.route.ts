import { Express } from "express";
import { createTodoController, getAllTodoController, getTodoByIdController } from "./todo.controller";

const todo = (app: Express) => {
  //route path
  app.route("/todo").post(
    async (req, res, next) => {
      try {
        await createTodoController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

  //get all todos
  app.route("/todos").post(
   async (req, res, next) => {
      try {
        await getAllTodoController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

  //get todo by id
  app.route("/todo/:id").get(
    async (req, res, next) => {
      try {
        await getTodoByIdController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )
}

export default todo