import express from 'express'
import user from './auth/auth.router'
import todo from './todo/todo.route'


const initializeApp = ()=> {
   const app = express()

  //middleware
  app.use(express.json())

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




