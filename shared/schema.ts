import { pgTable, text, serial, integer, boolean, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);

// Tables
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default('student'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const exams = pgTable("exams", {
  id: uuid("id").defaultRandom().primaryKey(),
  teacherId: uuid("teacher_id").references(() => profiles.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  examCode: text("exam_code").unique().notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  totalMarks: integer("total_marks").notNull().default(100),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  examId: uuid("exam_id").references(() => exams.id, { onDelete: 'cascade' }).notNull(),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull().default('multiple_choice'),
  marks: integer("marks").notNull().default(1),
  orderNumber: integer("order_number").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const answerChoices = pgTable("answer_choices", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionId: uuid("question_id").references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  choiceText: text("choice_text").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
  orderNumber: integer("order_number").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const examAttempts = pgTable("exam_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => profiles.id).notNull(),
  examId: uuid("exam_id").references(() => exams.id).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  totalScore: integer("total_score").default(0),
  status: text("status").notNull().default('in_progress'),
});

export const studentAnswers = pgTable("student_answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  attemptId: uuid("attempt_id").references(() => examAttempts.id, { onDelete: 'cascade' }).notNull(),
  questionId: uuid("question_id").references(() => questions.id).notNull(),
  selectedChoiceId: uuid("selected_choice_id").references(() => answerChoices.id),
  answerText: text("answer_text"),
  isCorrect: boolean("is_correct"),
  marksAwarded: integer("marks_awarded").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Legacy users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles);
export const selectProfileSchema = createSelectSchema(profiles);

export const insertExamSchema = createInsertSchema(exams);
export const selectExamSchema = createSelectSchema(exams);

export const insertQuestionSchema = createInsertSchema(questions);
export const selectQuestionSchema = createSelectSchema(questions);

export const insertAnswerChoiceSchema = createInsertSchema(answerChoices);
export const selectAnswerChoiceSchema = createSelectSchema(answerChoices);

export const insertExamAttemptSchema = createInsertSchema(examAttempts);
export const selectExamAttemptSchema = createSelectSchema(examAttempts);

export const insertStudentAnswerSchema = createInsertSchema(studentAnswers);
export const selectStudentAnswerSchema = createSelectSchema(studentAnswers);

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof exams.$inferSelect;

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export type InsertAnswerChoice = z.infer<typeof insertAnswerChoiceSchema>;
export type AnswerChoice = typeof answerChoices.$inferSelect;

export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type ExamAttempt = typeof examAttempts.$inferSelect;

export type InsertStudentAnswer = z.infer<typeof insertStudentAnswerSchema>;
export type StudentAnswer = typeof studentAnswers.$inferSelect;
