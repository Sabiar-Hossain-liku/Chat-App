import express, { json } from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import messageRoutes from "../src/routes/message.route.js"
dotenv.config()
const app = express()

app.use(cookieParser())
app.use(express.json())

app.use('/app/auth', authRoutes)
app.use('/app/message', messageRoutes)


const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(` server is running at ${PORT}`)
    connectDB()
})