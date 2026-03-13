//routing
import { Express } from "express";
import { createUserController, getAllUsersController, loginUserController } from "./auth.controller";


const user = (app: Express)=>{
  //route path
  app.route("/auth/register").post(
    async (req, res, next) => {
      try {
        await createUserController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

  //login route
  app.route("/auth/login").post(
    async (req, res, next) => {
      try {
        await loginUserController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )


  //get all users
  app.route("/auth/users").post(
    async (req, res, next) => {
      try {
        await getAllUsersController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )
  
  
  
}

export default user;