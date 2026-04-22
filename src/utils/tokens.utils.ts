import jwt from "jsonwebtoken"

const ACCESS_SECRET = "access-token-secret"
const REFRESH_SECRET = "refresh-token-secret"

export interface AccessPayload {
    id: string,
    name: string,
    email: string,
}

export interface RefreshPayload {
    id: string,
}


export const generateAccessToken = (payload:AccessPayload)=>{
    return jwt.sign(payload, ACCESS_SECRET, {expiresIn: "15m"})
}

export const generateRefreshToken = (payload:RefreshPayload)=>{
    return jwt.sign(payload, REFRESH_SECRET, {expiresIn: "1d"})
}

export const verifyAccessToken = (token: string)=>{
    return jwt.verify(token, ACCESS_SECRET)
}

export const verifyRefreshToken = (token: string)=>{
    return jwt.verify(token, REFRESH_SECRET)
}
