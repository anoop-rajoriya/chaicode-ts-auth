import type {Request, Response, NextFunction} from "express"
import {verifyAccessToken, type AccessPayload} from "../../utils/tokens.utils.js"

export const extractUser = ()=>{
    return (req:Request, res:Response, next:NextFunction)=>{
        const authorization = req.get("Authorization")

        if(authorization?.startsWith("Bearer ")){
            const token = authorization.split(" ")[1]
            if(token){
                try {
                    const decoded = verifyAccessToken(token)

                    if(decoded){
                        req.user = decoded as AccessPayload
                    }
                } catch (error) {
                    req.user = null
                    console.error("JWT Verification failed:", error);
                }
            }
        }

        next()
    }
}

export const allowUser = ()=>{
    return (req:Request, res:Response, next:NextFunction)=>{
        
        if(!req.user){
            return res.status(401).json({error: "Authentication required"})
        }

        next()
    }
}