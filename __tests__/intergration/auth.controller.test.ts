import {createUserController} from '../../src/auth/auth.controller'
// import { Request } from 'supertest'
import request from 'supertest'
import bycrypt from 'bcryptjs'
import app from '../../src/index' 
import { UsersTable } from '../../src/Drizzle/schema'
import db from '../../src/Drizzle/db'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

let testUser = {
 firstName: "Test", 
 lastName: "User", 
 password: "testpass123",
 email: "testUser@gmail.com"
}

beforeAll(async () => {
  //hash pass
  const hashedPassword = bcrypt.hashSync(testUser.password, 10)
  await db.insert(UsersTable).values({
    ...testUser,
    password: hashedPassword
  })
})

afterAll( async () => {
  //clean up
  await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email))
  await db.$client.end()
})

//testing authentication of a user
describe("Post /auth/login", ()=>{
  it("should authenticate a user and return a token", async()=>{
    const res = await request(app)
    .post("/auth/login")
    .send({
      email:"testUser@gmail.com",
      password: "testpass123"
    })
    
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("token")
    expect(res.body.user).toEqual(
      expect.objectContaining({
          "user-id": expect.any(Number),
          "fist-name": testUser.firstName,
          "last-name": testUser.lastName,
      })
    )
  })

  //wrong password testing
  it.skip("should return invalid credentials for a wrong password", async () => {
    const res = await request(app)
    .post("/auth/login")
    .send({
      email : "testUser@gmail.com",
      password: "wrong123"
    })
    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({message : "Invalid credentials"})
  })

  // wrong email testing
  it("should return user does not exist for a wrong email", async () => {
    const res = await request(app)
    .post("/auth/login")
    .send({
      email: "euejue@gmail.com",
      password: "testUser@gmail.com"
    })
    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual({message : "The user does not exist"})
  })

  //

  
})


