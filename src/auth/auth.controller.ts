// Api level
import { Request, Response } from "express";
import { CreateUserService } from "./auth.service";
import bycrypt from "bcryptjs";

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