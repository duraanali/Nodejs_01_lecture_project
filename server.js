import express from 'express'
import cors from "cors"
import bodyParser from "body-parser"
import studentRoute from "./routes/studentRoute.js"
import db from "./data/db.js";

// Initialize Express
const app = express()
const PORT = process.env.PORT || 5001
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Students
app.use("/api/students", studentRoute)


// Basic API
// GET, POST, PUT, DELETE
// API ENDPOINT
// req = request (codsi), res = response (jawaab)
app.get("/", (req, res) => {
    res.send("Hello from Express")
});

app.get("/users", async (req, res) => {
    try{
        const users = await db.find();
        res.status(200).json(users);
      
    } catch (error) {
        res.status(500).json({
            error: "Could not retrieve users",
        });
    }

});

// Starting the server

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

export default app