import express from "express"
import AuthRouter from "./user/route.js"

export default function (){
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded())

    app.get("/health", (req, res)=>{
        res.send("Server is active")
    })

    app.use("/auth", AuthRouter)

    return app
}