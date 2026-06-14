import {createTodoService, deleteTodoByIdService, getTodoByIdService, getTodoService, updateTodoByIdService, } from "../../src/todo/todo.services"
import db from "../../src/Drizzle/db"
import { TITodo, TodoTable } from "../../src/Drizzle/schema"


//mocking the modules
jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    TodoTable:{
      findMany: jest.fn(),
      findFirst: jest.fn()
    }
  },

}))

beforeEach(()=>{
  jest.clearAllMocks();
});

describe("Todo service", ()=>{
  // test the insertion of a todo
	describe("createTodoService", ()=>{
		it("should insert a todo and return that inserted todo", async()=>{
			const todo = { // this is a mock for a todo
				userId: 1,
				todoName: "mock sample",
				dueDate: new Date(),
				descrption: "sample todo"			
      };
			const inserted = {id: 1, ...todo};

      //chaining
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([inserted])
        })
      })

      const result = await createTodoService(todo)
=
			expect(db.insert).toHaveBeenCalledWith(TodoTable)
			expect(result).toEqual(inserted)
		})

    it("should retun NULL if insertion failed", async ()=>{
      // chaining
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([null])
        })
      });

      const todo = {
        todoName: "failed",
        description: "fake",
        duedate: new Date(),
        userId: 1 
      }

      const result = await createTodoService(todo)
      expect(result).toBeNull()
    })
	})

  //testing on getting all todos service
  describe("getTodoService", ()=>{
    it("should return all available todos", async ()=>{
      const todos = [
        {id: 1, todoName: "lunch", description: "cook lunch", userId: 1, deuDate: new Date()},
        {id: 2, todoName: "gym", description: "shoulders day", userId: 2, deuDate: new Date()},
        {id: 3, todoName: "shopping", description: "shop for kitchen appliances", userId: 1, deuDate: new Date()}
      ];
      (db.query.TodoTable.findMany as jest.Mock).mockResolvedValueOnce(todos)

      const result = await getTodoService()
      expect(result).toEqual(todos)
    })

    it("should return an empty array if there are no Todos", async ()=>{
      (db.query.TodoTable.findMany as jest.Mock).mockResolvedValueOnce([])

      const result = await getTodoService()
      expect(result).toEqual([])
    })
  })


  describe("getTodoByIdService", ()=>{
    it("should retun a todo if found through userId", async()=>{
      const todo = {
        id: 1,
        todoName: "Todo 1",
        userId: 1,
        dueDate: new Date(),
      };
      (db.query.TodoTable.findFirst as jest.Mock).mockResolvedValueOnce(todo)

      const result = await getTodoByIdService(1)
      expect(db.query.TodoTable.findFirst).toHaveBeenCalled()
      expect(result).toEqual(todo)
    })

    it("should return undefined if no todo found", async()=>{
      (db.query.TodoTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined)

      const result = await getTodoByIdService(679)
      expect(result).toBeUndefined()
    })
  })

  //update todo by id test
  describe("updateTodoByIdService", ()=>{
    it("should update a todo and return a success message", async()=>{
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValueOnce(undefined)
        })
      })

      const result = await updateTodoByIdService(1, {
        todoName: "Todo 1",
        descrption: "updated",
        userId: 1,
        dueDate: new Date(),
      })

      expect(db.update).toHaveBeenCalledWith(TodoTable)
      expect(result).toBe("Todo updated successfully!")
    })
  })

  // delete a todo by id test
  describe("", ()=>{
    it("should delete a todo and return a success message", async ()=>{
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValueOnce(undefined)
      })
      const result = await deleteTodoByIdService(1) ;
      expect(db.delete).toHaveBeenCalledWith(TodoTable)
      expect(result).toBe("Todo deleted successfully")
      
    })
  })


})