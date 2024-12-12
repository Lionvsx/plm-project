import { InferSelectModel, relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { Product, product } from "./product-schema";
import { user } from "./auth-schema";

export const projectStatusEnum = pgEnum("project_status", [
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
]);

export const project = pgTable("project", {
  id: serial("project_id").primaryKey(),
  productId: integer("product_id")
    .references(() => product.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  startDate: date("start_date", { mode: "date" }).notNull(),
  endDate: date("end_date", { mode: "date" }),
  status: projectStatusEnum("status").default("PLANNING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const task = pgTable("task", {
  id: serial("task_id").primaryKey(),
  projectId: integer("project_id")
    .references(() => project.id)
    .notNull(),
  assignedTo: text("assigned_to").references(() => user.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  deadline: date("deadline", { mode: "date" }),
  status: taskStatusEnum("status").default("TODO").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Task = InferSelectModel<typeof task>;
export type Project = InferSelectModel<typeof project>;

export const projectRelations = relations(project, ({ one, many }) => ({
  product: one(product, {
    fields: [project.productId],
    references: [product.id],
  }),
  tasks: many(task),
}));

export const taskRelations = relations(task, ({ one }) => ({
  project: one(project, {
    fields: [task.projectId],
    references: [project.id],
  }),
  assignee: one(user, {
    fields: [task.assignedTo],
    references: [user.id],
  }),
}));
