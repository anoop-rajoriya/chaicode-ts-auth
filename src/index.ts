import {createServer} from "node:http"
import createApp from "./app/index.js"

function main (){
    try{
        const proxy = createServer(createApp())
        const PORT = 8080
        
        proxy.listen(PORT, ()=>console.log(`Server listening on : http://localhost:${PORT}`))
    } catch (error){
        console.error("Error starting the server:", error)
    }
}

main()