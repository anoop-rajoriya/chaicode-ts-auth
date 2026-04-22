import type {Request, Response} from "express"
import {eq} from "drizzle-orm"

import {SignupSchema, SigninSchema} from "./validation.js"
import {db} from "../../db/index.js"
import {userTable} from "../../db/schema.js"
import {generateHash, generateSalt} from "../../utils/crypto.utils.js"
import {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, type AccessPayload, type RefreshPayload} from "../../utils/tokens.utils.js"

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

export const signin = async (req:Request, res:Response)=>{
    // validate request
    const parsed = SigninSchema.safeParse(req.body)
    if(!parsed.success){
        return res.status(400).json({error: parsed.error.issues})
    }
    const {email, password} = parsed.data

    // find user (Error: User not registered)
    const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1)

    if(!user){
        return res.status(400).json({error: "Email or password incorrect"})
    }

    // compare password (Error: Email or password incorrect)
    const hash = generateHash(password, user.salt!)

    if(user.password !== hash){
        return res.status(400).json({error: "Email or password incorrect"})
    }

    // generate tokens and refreshtoken in user entry
    const accessToken = generateAccessToken({
        id: user.id, 
        name: user.name!, 
        email: user.email
    })
    const refreshToken = generateRefreshToken({id: user.id})

    await db.update(userTable)
    .set({refreshToken: refreshToken})
    .where(eq(userTable.id, user.id))

    // return {id, refreshToken, accessToken}
    res.set("Authorization", `Bearer ${accessToken}`)
    res.status(200).json({id: user.id, refreshToken})

}

interface RefreshParams {
    token: string
}

export const refresh = async (req:Request<RefreshParams>, res:Response)=>{
    // extract token from params
    const {token} = req.params || ""

    // verify token (Error: Invalid refresh token)
    const decoded = verifyRefreshToken(token) as RefreshPayload
    if(!decoded){
        res.status(400).json({error: "Invalid refresh token"})
    }

    // find user and match token (Error: Invalid refresh token)
    const [user] = await db.select()
    .from(userTable)
    .where(eq(userTable.id, decoded.id))

    if(!user || user.refreshToken !== token){
        return res.status(400).json({error: "Invalid refresh token"})
    }

    // generate new tokens
    const accessToken = generateAccessToken({
        id: user.id, 
        name: user.name!, 
        email: user.email
    })
    const refreshToken = generateRefreshToken({id: user.id})

    await db.update(userTable)
    .set({refreshToken})
    .where(eq(userTable.id, user.id))

    // return generated tokens
    res.set("Authorization", `Bearer ${accessToken}`)
    return res.status(200).json({id: user.id, refreshToken})
}

export const signout = async (req:Request, res:Response)=>{
    // extract token from Bearer header
    const bearer = req.get("Authorization") || ""
    if(bearer.length === 0 || !bearer.startsWith("Bearer ")){
        res.status(401).json({error: "Unauthorized access"})
    }

    const decoded = verifyAccessToken(bearer.split(" ")[1]!) as AccessPayload

    // remove token from row entry (Error: Invalid authoriztion headers)
    const [user] = await db.update(userTable)
    .set({refreshToken: null})
    .where(eq(userTable.id, decoded.id))
    .returning({id: userTable.id})

    if(!user){
        res.status(401).json({error: "Unauthorized access"})
    }

    // remove token
    res.set("Authorization", "")
    
    // return {id, isSignout}
    res.status(200).json({userId: user?.id, isSignout: true})
}

export const me = async (req:Request, res:Response)=>{
    // find user (Error: Unauthorized access)
    const [user] = await db.select()
    .from(userTable)
    .where(eq(userTable.id, req.user.id))

    if(!user){
        res.status(404).json({error: "User not found"})
    }

    // return user
    return res.status(200).json({
        id: user?.id, 
        name: user?.name, 
        email: user?.email, 
        createdAt: user?.createdAt, 
        updatedAt: user?.updatedAt
    })
}