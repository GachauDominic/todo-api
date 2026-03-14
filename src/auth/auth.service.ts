// Database
import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIUser, UsersTable } from "../Drizzle/schema";

// Create a user 
export const CreateUserService = async (user: TIUser)=>{
  await db.insert(UsersTable).values(user)
  return "User created successfully !";
}

//get all users
export const getAllUsers = async () => {
  const allUsers = await db.query.UsersTable.findMany()
  return allUsers
}

//login a user
export const userLoginService = async (user: TIUser) => {
  //email and password
  const {email} = user;
  return await db.query.UsersTable.findFirst({
  columns: {
    id: true,
    firstName: true,
    lastName: true,
    password: true,
    email: true,
    role: true
  }, where: sql `${UsersTable.email} = ${email}`
  })
}
