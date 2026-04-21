import crypto from "node:crypto"

const SECRET = "crypto-secret"

export const generateHash = (password:string, salt:string)=>{
    const payload = `${salt}${salt}${password}`

    return crypto.createHmac("sha256",SECRET).update(payload).digest("hex")
}

export const generateSalt = (lenInBytes=8)=>{
    return crypto.randomBytes(lenInBytes).toString("hex")
}