// Api level
import { Request, Response } from "express";
import { CreateUserService, getAllUsers, getUserByEmailService, userLoginService, verifyUserService, } from "./auth.service";
import bycrypt from "bcryptjs";
import { TodoTable } from "../Drizzle/schema";
import  jwt from "jsonwebtoken";
import "dotenv/config"
import { sendMail } from "../Mailer/mailer";

//from this end we have to create functions that will talk with the service

//create user controller
export const createUserController = async(req: Request, res:Response)=>{
  //try and catch should not be used on the services side
  try {
    const user = req.body
    const password = user.password;
    const hashedPassword = await bycrypt.hashSync(password, 10)
    user.password = hashedPassword;

    // generate a 6 digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    user.verificationCode = verificationCode;
    user.isVerified = false;


    const createUser = await CreateUserService(user)
    if (!createUser) {
      return res.json({message: "User not created !"})
    }
    try {
      await sendMail(
        user.email,
        "verify your account",
        `Hello ${user.lastName}, your verification code is: ${verificationCode}`,
        `<div>
          <h2>Hello ${user.lastName} </h2>  
        <p>Your verificaton code is: <strong> ${verificationCode} </strong> </p>
        <p> Enter this code to verify your account </p>
        </div>`

      )
    } catch (emailError) {
      console.error("Failed to send registration email:", emailError)
    }

    return res.status(201).json({message: "User created and verification sent to your email"})

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

  //verify a user
  export const verifyUserController = async (req: Request, res: Response) => {
    const {email, code} = req.body
    try {
      const user = await getUserByEmailService(email)
      if (!user) {
        return res.status(404).json({message: "User not found!"})
      }
      if (user.verificationCode === code) {
          await verifyUserService(email)

            //send verification email to user
          try {
          await sendMail(
            user.email,
            "Account verified successfully",
            `Hello ${user.lastName}, Your account was verified successfuly. You can now login and use the features`,
            `<div>
              <h2>Hello ${user.lastName} </h2>  
            <p>Your account has been <strong> successfully verified </strong> </p>
            <p> Enjoy the services. </p>
            </div>`
          )
        } catch (error) {
          console.error("Failed to send the verification: ", error)
        }
        return res.status(200).json({message: "User verified successfully!"})
      } else {
        return res.status(400).json({message: " Invalid verification code!"})
      }
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