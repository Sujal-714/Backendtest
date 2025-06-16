import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import postRoutes from "./routes/post.js";
import cors from "cors";

const pool = new pg.Pool({
    user: "postgres",
host: "localhost",
database: "books",
password: "admin",
port:5432
});


const app = express();
const PORT = 3000;


//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/posts", postRoutes(pool));

app.get("/",async(req,res)=>{
    res.send("API is running");
})

app.listen(PORT,()=>{
    console.log(`Server Running on port:${PORT}`);
});

export default pool;
