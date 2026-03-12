// Database
import db from "../Drizzle/db";
import { TIUser, UsersTable } from "../Drizzle/schema";

// Create a user 
export const CreateUserService = async (user: TIUser)=>{
  await db.insert(UsersTable).values(user)
  return "User created successfully !";
}
