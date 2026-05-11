// Database
import { eq, SQL, sql } from "drizzle-orm";
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

// verify a user
export const verifyUserService = async (email: string) => {
    await db.update(UsersTable)
    .set({isVerified: true, verificationCode: null})
    .where(sql`${UsersTable.email} = ${email}`)
}

// get a user by their email
export const getUserByEmailService = async (email: string) => {
  return await db.query.UsersTable.findFirst({
    where: sql`${UsersTable.email} = ${email}`
  })
}

// get user by their id
export const getUserByIdService = async(id:number) => {
  return await db.query.UsersTable.findFirst({
    where: sql`${UsersTable.id} = ${id}`
  })
}

//update a user by their Id
export const updateUserByIdService = async(id: number, user:TIUser) => {
  await db.update(UsersTable).set(user).where(eq(UsersTable.id, id))
  return "User updated successfully!"
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
