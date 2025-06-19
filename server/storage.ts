import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  users, profiles, exams, questions, answerChoices, examAttempts, studentAnswers,
  type User, type InsertUser, type Profile, type Exam, type Question
} from "@shared/schema";
import { eq, and, desc } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile management
  createProfile(profile: { id: string; fullName: string; role: 'student' | 'teacher' | 'admin' }): Promise<Profile>;
  getProfileById(id: string): Promise<Profile | undefined>;
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | undefined>;
  
  // Exam management
  createExam(exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exam>;
  getExamsByTeacher(teacherId: string): Promise<Exam[]>;
  getActiveExams(): Promise<Exam[]>;
  getExamById(id: string): Promise<Exam | undefined>;
  updateExam(id: string, updates: Partial<Exam>): Promise<Exam | undefined>;
  
  // Question management
  createQuestion(question: Omit<Question, 'id' | 'createdAt'>): Promise<Question>;
  getQuestionsByExam(examId: string): Promise<Question[]>;
  
  // Answer choices
  createAnswerChoice(choice: { questionId: string; choiceText: string; isCorrect: boolean; orderNumber: number }): Promise<any>;
  getAnswerChoicesByQuestion(questionId: string): Promise<any[]>;
  
  // Exam attempts
  createExamAttempt(attempt: { studentId: string; examId: string }): Promise<any>;
  getExamAttemptsByStudent(studentId: string): Promise<any[]>;
  updateExamAttempt(id: string, updates: any): Promise<any>;
  
  // Student answers
  saveStudentAnswer(answer: { attemptId: string; questionId: string; selectedChoiceId?: string; answerText?: string }): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Legacy user methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Profile methods
  async createProfile(profile: { id: string; fullName: string; role: 'student' | 'teacher' | 'admin' }): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async getProfileById(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | undefined> {
    const result = await db.update(profiles).set(updates).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  // Exam methods
  async createExam(exam: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exam> {
    const result = await db.insert(exams).values(exam).returning();
    return result[0];
  }

  async getExamsByTeacher(teacherId: string): Promise<Exam[]> {
    return await db.select().from(exams).where(eq(exams.teacherId, teacherId)).orderBy(desc(exams.createdAt));
  }

  async getActiveExams(): Promise<Exam[]> {
    return await db.select().from(exams).where(eq(exams.isActive, true)).orderBy(desc(exams.createdAt));
  }

  async getExamById(id: string): Promise<Exam | undefined> {
    const result = await db.select().from(exams).where(eq(exams.id, id)).limit(1);
    return result[0];
  }

  async updateExam(id: string, updates: Partial<Exam>): Promise<Exam | undefined> {
    const result = await db.update(exams).set(updates).where(eq(exams.id, id)).returning();
    return result[0];
  }

  // Question methods
  async createQuestion(question: Omit<Question, 'id' | 'createdAt'>): Promise<Question> {
    const result = await db.insert(questions).values(question).returning();
    return result[0];
  }

  async getQuestionsByExam(examId: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.examId, examId)).orderBy(questions.orderNumber);
  }

  // Answer choice methods
  async createAnswerChoice(choice: { questionId: string; choiceText: string; isCorrect: boolean; orderNumber: number }) {
    const result = await db.insert(answerChoices).values(choice).returning();
    return result[0];
  }

  async getAnswerChoicesByQuestion(questionId: string) {
    return await db.select().from(answerChoices).where(eq(answerChoices.questionId, questionId)).orderBy(answerChoices.orderNumber);
  }

  // Exam attempt methods
  async createExamAttempt(attempt: { studentId: string; examId: string }) {
    const result = await db.insert(examAttempts).values(attempt).returning();
    return result[0];
  }

  async getExamAttemptsByStudent(studentId: string) {
    return await db.select().from(examAttempts).where(eq(examAttempts.studentId, studentId)).orderBy(desc(examAttempts.startedAt));
  }

  async updateExamAttempt(id: string, updates: any) {
    const result = await db.update(examAttempts).set(updates).where(eq(examAttempts.id, id)).returning();
    return result[0];
  }

  // Student answer methods
  async saveStudentAnswer(answer: { attemptId: string; questionId: string; selectedChoiceId?: string; answerText?: string }) {
    const result = await db.insert(studentAnswers).values(answer).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
