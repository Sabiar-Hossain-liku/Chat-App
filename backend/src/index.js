import express, { json } from "express"
import authRoutes from "./routes/auth.route.js"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.js"

dotenv.config()
const app = express()
app.use(express.json())

app.use('/app/auth', authRoutes)

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(` server is running at ${PORT}`)
    connectDB()
})