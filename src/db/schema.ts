import {pgTable, uuid, varchar, text, timestamp} from "drizzle-orm/pg-core"

export const userTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", {length: 50}).notNull(),
    email: varchar("email", {length: 322}).notNull(),
    password: varchar("password", {length: 70}),
    salt: text("salt"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(()=>new Date())
})

