import { Express } from "express";
import { createUserController, getAllUsersController, getUserByIdController, loginUserController, updateUserByIdController, verifyUserController } from "./auth.controller";
import { adminRoleAuth, bothRoleAuth } from "../middleware/bearAuth";

const user = (app: Express)=>{
  //register path
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

  //verify route
  app.route("/auth/verify").post(
    async (req, res, next) => {
      try {
        await verifyUserController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

  //get all users
  app.route("/auth/users").get(
    adminRoleAuth,
    async (req, res, next) => {
      try {
        await getAllUsersController(req, res)
      } catch (error) {
        next(error)
      }
    }
  )

 // update user by id route
  app.route("/auth/user/:id").put(
      bothRoleAuth,
      async (req, res, next) => {
        try {
          await updateUserByIdController(req, res)
        } catch (error) {
            next(error)
        }
      }
  )

  // get user by id route
  app.route("/user/:id").get(
      bothRoleAuth,
      async (req, res, next) => {
          try {
              await getUserByIdController(req, res)
          } catch (error) {
              next(error)
          }
      }
  )
  
}

export default user;