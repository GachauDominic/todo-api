import { Request, Response } from "express";
import { createTodoService, deleteTodoByIdService, getTodoByIdService, getTodoService, updateTodoByIdService } from "./todo.services";

// create a todo controller
export const createTodoController = async(req: Request, res:Response) => {
  try {
    const todo = req.body

    //convert dueDate to a Date Object if provided
    if(todo.dueDate) {
      todo.dueDate = new Date(todo.dueDate)
    }

    const newTodo = await createTodoService(todo)
    if (!newTodo) {
      return res.status(400).json({message: "Todo not created"})
    }
    return res.status(201).json({message: "Todo created successfully", todo: newTodo})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

// Get all todos controller
export const getAllTodoController = async(req: Request, res: Response)=>{
  try {
    const todos = await getTodoService()
    if(!todos || todos.length === 0){
      return res.status(404).json({message: `No todos found!`}) 
    }
    return res.status(200).json({data: todos})

  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}


// get a todo by id
export const getTodoByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if ( isNaN(id) ) {
       return res.status(400).json({message: `Invalid ID!`})
    }

    const todo = await getTodoByIdService(id)
    if (!todo) {
      return res.status(404).json({message: "Todo not found!"})
    }
    return res.status(200).json({data: todo})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

//update a todo by id
export const updateTodoController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if ( isNaN(id) ) {
       return res.status(400).json({message: `Invalid ID!`})
    }

    const todo = req.body;

    //convert dueDate to a Date Object if provided
    if(todo.dueDate) {
      todo.dueDate = new Date(todo.dueDate)
    }

    //check if the todo is existing
    const ifExistingTodo = await getTodoByIdService(id)
    if (!ifExistingTodo) {
      return res.status(404).json({message: "Todo not found!"})
    }

    const updatedTodo = await updateTodoByIdService(id, todo)
    if (!updatedTodo) {
      return res.status(400).json({message: "Todo not updated!"})
    }
    return res.status(200).json({message: `Todo updated successfully`, data: todo})

    
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

//deleting a todo by its id
export const deleteTodoController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string)
    if ( isNaN(id) ) {
       return res.status(400).json({message: `Invalid ID!`})
    }

   //check if the todo is existing
    const ifExistingTodo = await getTodoByIdService(id)
    if (!ifExistingTodo) {
      return res.status(404).json({message: "Todo not found!"})
    }

    const deletedTodo = await deleteTodoByIdService(id);
    if (!deletedTodo) {
      return res.status(400).json({message: "Todo not deleted!"})
    }
    return res.status(204).json({message: "Todo deleted successfully"})

  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}

