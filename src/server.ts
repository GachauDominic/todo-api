import app from "./index"


//an app must listen to a port and some ports are usually available while others are not (8080, 8081, 3000) are usually available
app.listen(8080, () => {
  console.log('Server is running on the port: http://localhost:8080')
})
