// Api level
import { Request, Response } from "express";
import { CreateUserService, getAllUsers, userLoginService } from "./auth.service";
import bycrypt from "bcryptjs";
import { TodoTable } from "../Drizzle/schema";
import  jwt from "jsonwebtoken";
import "dotenv/config"

//from this end we have to create functions that will talk with the service

//create user controller
export const createUserController = async(req: Request, res:Response)=>{
  //try and catch should not be used on the services side
  try {
    const user = req.body
    const password = user.password;
    const hashedPassword = await bycrypt.hashSync(password, 10)
    user.password = hashedPassword;

    const createUser = await CreateUserService(user)
    if (!createUser) {
      return res.json({message: "User not created !"})
    }
    return res.status(201).json({message: "createdUser"})

  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}


//get all users
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers()
    if(!users || users.length === 0){
      return res.status(404).json({message: `No users found!`}) 
    }
    return res.status(200).json({data: users})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

//login a user controller
export const loginUserController = async (req: Request, res: Response) => {
  try {
   const user = req.body; 

   // check if user already exists
   const userExisting = await userLoginService(user)
   if (!userExisting) {
    return res.status(404).json({message: "The user does not exist"})
   }

   //verify the password with the hash 
   const userMatch = await bycrypt.compareSync(user.password, userExisting.password)
   if (!userMatch) {
    return res.status(401).json({message: "Invalid credentials"})
   };
   
   //create a payload
   const payload = {
    "sub": userExisting.id,
    "user-id": userExisting.id,
    "fist-name": userExisting.firstName,
    "last-name": userExisting.lastName,
    "role": userExisting.role,
    "exp": Math.floor(Date.now() / 1000) + 60*60*24 //token expires in 1 minute
   }

   //generate a JWT (json web token) 
   const secret = process.env.JWT_SECRET as string
   if (!secret) {
    throw new Error("JWT_SECRET is not defined in the environment variable");
   }
   const token = jwt.sign(payload, secret);
   

   //return the token with the user info
   return res.status(200).json({
    messsage: "The login was successfull",
    token,
    user: {
      "user-id": userExisting.id,
      "fist-name": userExisting.firstName,
      "last-name": userExisting.lastName,
      "email": userExisting.email,
      "role": userExisting.role
     }
   })

  } catch (error: any) {
    return res.status(500).json({error: error.message})
    
  }
}