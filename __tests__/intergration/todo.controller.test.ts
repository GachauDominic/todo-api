import request  from "supertest";
import db from '../../src/Drizzle/db'
import { eq, is} from 'drizzle-orm'
import app from '../../src/index' 
import { TodoTable, UsersTable } from "../../src/Drizzle/schema";
import bcrypt from "bcryptjs";


let todoId: number;
let userId: number;
let token :string;

let testUser = {
 firstName: "Test", 
 lastName: "todoUser", 
 password: "todotestpass123",
 email: "todoTestUser@gmail.com"
}

beforeAll(async () => {
  const hashedpass = bcrypt.hashSync(testUser.password, 10);
  const [user] = await db.insert(UsersTable).values({
    ...testUser, 
    password: hashedpass, 
    role: "admin",
    isVerified: true
  }).returning()
  userId =  user.id;

  //login to get the token
  const res = await request(app)
  .post("/auth/login")
  .send({
    email: testUser.email,
    password: testUser.password
  })
  token = res.body.token

  //create a test todo for retrieval tests
  const testTodo = {
    userId,
    todoName: "Submit code",
    descrption: "submit/push code for the new feature for the todo system",
    dueDate: new Date().toISOString()
  };
  const todoRes = await request(app)
  .post("/todo")
  .set("Authorization", `Bearer ${token}`)
  .send(testTodo)
  if (todoRes.body.todo) {
    todoId = todoRes.body.todo.id;
  }
})
afterAll( async () => {
  await db.delete(TodoTable).where(eq(TodoTable.userId, userId))
  await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email))
  await db.$client.end()
})

describe("todo API intergration test", ()=>{
  it.skip("should create a new todo", async()=>{
    const testTodo = {
      userId,
      todoName: "Submit code",
      descrption: "submit/push code for the   new feature for the todo system",
      dueDate: new Date().toISOString(),
      // isCompleted: false
    };
    
    const res = await request(app)
    .post("/todo")
    .set("Authorization", `Bearer ${token}`)
    .send(testTodo)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("message", "Todo created successfully")
    todoId = res.body.todo.id;
  })

  it.skip("should get all todos", async()=>{
    const res = await request(app)
    .post("/todos")
    .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeInstanceOf(Array)
  })

  it.skip("should get a todo by its Id", async()=>{
    const res= await request(app)
    .get(`/todo/${todoId}`)
    .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveProperty("id", todoId)
  })

  it.skip("should update a todo by its Id", async()=>{
    const updatedTodo = {
      "todoName": "upated todo",
      "description": "updated description"
    }
    const res = await request(app)
    .put(`/todo/${todoId}`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedTodo)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("message", "Todo updated successfully")
  })

  it.skip("should delete a todo by its Id", async()=>{
    const res = await request(app)
    .delete(`/todo/${todoId}`)
    .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(204)
  })

  it("should get a todo specific to a user through userId", async()=>{
    const res = await request(app)
    .get(`/todos/user/${userId}`)
    .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toBeInstanceOf(Array)
  })
  
  // NEGATIVE TESTING 
  test.skip("should not get a todo with invalid todo id", async()=>{
    const res = await request(app)
    .get(`/todo/invalidId`)
    .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("message", "Invalid ID!")
  })

  test.skip("should not return a todo with invalid userId", async()=>{
    const res = await request(app)
    .get(`/todos/user/789`)
    .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual({"message": "No Todos found for this user"})
    
  })

  test.skip("should  not delete a todo with invalid Id", async()=>{
    const res = await request(app)
    .delete(`/todo/3456`)
    .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual({"message": "Todo not found!"})

  })

  test.skip("should not update a todo with invalid todo Id", async()=>{
    const updatedTodo = {
      "todoName": "upated todo",
      "description": "updated description"
    }
    const res = await request(app)
    .put(`/todo/789`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedTodo)

    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty("message", "Todo not found!")
  })
  
})