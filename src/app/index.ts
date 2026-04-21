import express from "express"

export default function (){
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded())

    app.get("/health", (req, res)=>{
        res.send("Server is active")
    })

    return app
}