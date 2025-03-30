import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// State information
export const states = pgTable("states", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: text("abbreviation").notNull(),
  description: text("description").notNull(),
  resourceUrl: text("resource_url"),
  manualUrl: text("manual_url"),
});

export const insertStateSchema = createInsertSchema(states).pick({
  name: true,
  abbreviation: true,
  description: true,
  resourceUrl: true,
  manualUrl: true,
});

export type InsertState = z.infer<typeof insertStateSchema>;
export type State = typeof states.$inferSelect;

// Test questions
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  stateId: integer("state_id"),
  category: text("category").notNull(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  stateId: true,
  category: true,
  question: true,
  options: true,
  correctAnswer: true,
  explanation: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// Driver resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: text("file_size"),
  featured: boolean("featured").default(false),
  category: text("category").notNull(),
  stateId: integer("state_id"),
  imageUrl: text("image_url"),
  isNew: boolean("is_new").default(false),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  fileUrl: true,
  fileSize: true,
  featured: true,
  category: true,
  stateId: true,
  imageUrl: true,
  isNew: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Driving tips
export const drivingTips = pgTable("driving_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
});

export const insertDrivingTipSchema = createInsertSchema(drivingTips).pick({
  title: true,
  content: true,
  category: true,
});

export type InsertDrivingTip = z.infer<typeof insertDrivingTipSchema>;
export type DrivingTip = typeof drivingTips.$inferSelect;

// Basic user model for newsletter subscriptions
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribed: boolean("subscribed").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  subscribed: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
