import type {Request, Response} from "express"
import {eq} from "drizzle-orm"

import {SignupSchema} from "./validation.js"
import {db} from "../../db/index.js"
import {userTable} from "../../db/schema.js"
import {generateHash, generateSalt} from "../../utils/crypto.utils.js"

export const signup = async (req:Request, res:Response)=>{
    // validate request
    const parsed = SignupSchema.safeParse(req.body)
    if(!parsed.success){
        return res.status(400).json({error: parsed.error.issues})
    }
    const {name, email, password} = parsed.data

    // check existance (Error: User already registered)
    const users = await db
        .select({id: userTable.id})
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1)

    if(users.length > 0){
        return res.status(400).json({error: "User already registered"})
    }

    // hash password
    const salt = generateSalt()
    const hash = generateHash(password, salt)

    // create user row
    const result = await db.insert(userTable).values({
        name,
        email,
        password: hash,
        salt
    }).returning({
        userId: userTable.id, 
        userEmail: userTable.email
    })

    // return {id, email}
    return res.status(201).json(result[0]);
}

export const signin = (req:Request, res:Response)=>{
    // validate request
    // find user (Error: User not registered)
    // compare password (Error: Email or password incorrect)
    // generate tokens
    // return {id, refreshToken, accessToken}
}

export const signout = (req:Request, res:Response)=>{
    // find user (Error: Unauthorized access)
    // remove token
    // return {id, isSignout}
}

export const me = (req:Request, res:Response)=>{
    // find user (Error: Unauthorized access)
    // return user
}