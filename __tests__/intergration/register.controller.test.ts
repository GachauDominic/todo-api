import {createUserController} from '../../src/auth/auth.controller'
// import { Request } from 'supertest'
import request from 'supertest'
import app from '../../src/index' 
import { UsersTable } from '../../src/Drizzle/schema'
import db from '../../src/Drizzle/db'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { TIUser } from '../../src/Drizzle/schema'

let testUser = {
 firstName: "Test", 
 lastName: "User", 
 password: "testpass123",
 email: "testUser@gmail.com"
}

afterAll( async () => {
  //clean up
  await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email))
  await db.$client.end()
})


describe("post /auth/register", ()=>{
  it.skip("should register a new user", async()=>{
    const res = await request(app)
    .post("/auth/register")
    .send({
     ...testUser,
     password: bcrypt.hashSync(testUser.password, 10)
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({"message": "User created and verification sent to your email"})
    // expect(res.body).toHaveProperty("message", "User created and verification sent to your email")
  })

  it.skip("should not register an already existing user", async()=>{
    const res = await request(app)
    .post("/auth/register")
    .send({
     ...testUser,
     password: bcrypt.hashSync(testUser.password, 10)
    })

    expect(res.statusCode).toBe(500)
    expect(res.body).toHaveProperty("error")
  })

  it("should not register a user with missing fields", async()=>{
    const res = await request(app)
    .post("/auth/register")
    .send({
      firstName: "Test", 
      lastName: "User", 
      password: "testpass123"
    })

    expect(res.statusCode).toBe(500)
    expect(res.body).toHaveProperty("error")
  })
})