import { Express } from "express";
import { createTodoController, deleteTodoController, getAllTodoController, getTodoByIdController, getTodoByUseridController, updateTodoController } from "./todo.controller";
import { adminRoleAuth, bothRoleAuth, userRoleAuth } from "../middleware/bearAuth";
//import isAuthenticated from "../middleware/bearAuth";

const todo = (app: Express) => {
  //route path for creating a todo
  app.route("/todo").post(
    bothRoleAuth,
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
    //isAuthenticated,  
    bothRoleAuth,
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
    bothRoleAuth,
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
    adminRoleAuth,
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
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await deleteTodoController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

  //get todos specific to a user
  app.route("/todos/user/:userId").get(
    bothRoleAuth,
    async (req, res, next) => {
      try {
        await getTodoByUseridController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )
  
}


export default todo