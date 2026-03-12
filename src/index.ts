import express from 'express'
import user from './auth/auth.router'
import todo from './todo/todo.route'
const app = express()

//middleware
app.use(express.json())

//routes
user(app)
todo(app)

app.get('/', (req, res) => {
  res.send('Hello Express !') //the send means it it a response from the sever side

})

//an app must listen to a port and some ports are usually available while others are not (8080, 8081, 3000) are usually available
app.listen(8080, () => {
  console.log('Server is running on the port: http://localhost:8080')
})

