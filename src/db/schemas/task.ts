import { mysqlTable, serial, varchar, timestamp } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

export const task = mysqlTable('task', {
  id: serial('id').primaryKey(),
  brief: varchar('brief', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
})