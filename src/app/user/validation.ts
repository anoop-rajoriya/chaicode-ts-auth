import zod from "zod"

export const SignupSchema = zod.object({
    name: zod.string().min(2).max(20),
    email: zod.email(),
    password: zod.string().min(4).max(20)
})

export const SigninSchema = zod.object({
    email: zod.email(),
    password: zod.string().min(4).max(20)
})