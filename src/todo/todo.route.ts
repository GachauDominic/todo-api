import { Express } from "express";
import { createTodoController, deleteTodoController, getAllTodoController, getTodoByIdController, updateTodoController } from "./todo.controller";

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

  // update a todo by its ID
  app.route("/todo/:id").put(
    async (req, res, next) => {
      try {
        await updateTodoController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

  //delete a todo by id
  app.route("/todo/:id").delete(
    async (req, res, next) => {
      try {
        await deleteTodoController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

}


export default todo