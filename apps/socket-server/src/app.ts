import express from "express"
import cors from "cors";
import type { Request, Response, NextFunction } from "express";

const app = express()

if(!process.env.CORS_ORIGIN){
    console.log("Please mention the CORS link to env.")
}

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));


app.get("/",(req,res)=>{
    res.send("hiii")
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    console.error(err.message)

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })

})

export { app }