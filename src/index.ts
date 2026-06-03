import express from 'express'
import user from './auth/auth.router'
import todo from './todo/todo.router'
import { logger } from './middleware/logger'
import rateLimiterMidd from './middleware/rateLimiter'
import cors  from 'cors'

const initializeApp = ()=> {
   const app = express()
   app.use(express.json())

  //middleware
  // be ware that the cors shold be used after the first two express 
  app.use(cors({
    origin: "https://todo-client-iota-ten.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE" ],
  }))

  app.use(logger)
  app.use(rateLimiterMidd)  
  //routes
  user(app)
  todo(app)

  app.get('/', (req, res) => {
    res.send('Hello Express !') //the send means it it a response from the sever side

  })

  return app
}
const app = initializeApp()
export default app




