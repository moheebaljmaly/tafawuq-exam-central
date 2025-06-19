import { createClient } from '@supabase/supabase-js';
import type { Database } from '../client/src/integrations/supabase/types';
import type { 
  Profile, Exam, Question, 
  InsertProfile, InsertExam, InsertQuestion 
} from '../shared/schema';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export interface IStorage {
  // Profile management (replaces user management)
  createProfile(profile: { id: string; fullName: string; role: 'student' | 'teacher' | 'admin' }): Promise<Profile>;
  getProfileById(id: string): Promise<Profile | undefined>;
  updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | undefined>;
  getAllProfiles(): Promise<Profile[]>;
  
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

export class SupabaseStorage implements IStorage {
  // Profile methods
  async createProfile(profile: { id: string; fullName: string; role: 'student' | 'teacher' | 'admin' }): Promise<any> {
    const { data } = await supabase.from('profiles').insert({
      id: profile.id,
      full_name: profile.fullName,
      role: profile.role
    }).select().single();
    return data!;
  }

  async getProfileById(id: string): Promise<any> {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    return data || undefined;
  }

  async updateProfile(id: string, updates: any): Promise<any> {
    const { data } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
    return data || undefined;
  }

  async getAllProfiles(): Promise<any[]> {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    return data || [];
  }

  // Exam methods
  async createExam(exam: any): Promise<any> {
    const { data } = await supabase.from('exams').insert(exam).select().single();
    return data!;
  }

  async getExamsByTeacher(teacherId: string): Promise<any[]> {
    const { data } = await supabase.from('exams').select('*').eq('teacher_id', teacherId).order('created_at', { ascending: false });
    return data || [];
  }

  async getActiveExams(): Promise<any[]> {
    const { data } = await supabase.from('exams').select('*').eq('is_active', true).order('created_at', { ascending: false });
    return data || [];
  }

  async getExamById(id: string): Promise<any> {
    const { data } = await supabase.from('exams').select('*').eq('id', id).single();
    return data || undefined;
  }

  async updateExam(id: string, updates: any): Promise<any> {
    const { data } = await supabase.from('exams').update(updates).eq('id', id).select().single();
    return data || undefined;
  }

  // Question methods
  async createQuestion(question: any): Promise<any> {
    const { data } = await supabase.from('questions').insert(question).select().single();
    return data!;
  }

  async getQuestionsByExam(examId: string): Promise<any[]> {
    const { data } = await supabase.from('questions').select('*').eq('exam_id', examId).order('order_number');
    return data || [];
  }

  // Answer choice methods
  async createAnswerChoice(choice: { questionId: string; choiceText: string; isCorrect: boolean; orderNumber: number }) {
    const { data } = await supabase.from('answer_choices').insert({
      question_id: choice.questionId,
      choice_text: choice.choiceText,
      is_correct: choice.isCorrect,
      order_number: choice.orderNumber
    }).select().single();
    return data!;
  }

  async getAnswerChoicesByQuestion(questionId: string) {
    const { data } = await supabase.from('answer_choices').select('*').eq('question_id', questionId).order('order_number');
    return data || [];
  }

  // Exam attempt methods
  async createExamAttempt(attempt: { studentId: string; examId: string }) {
    const { data } = await supabase.from('exam_attempts').insert({
      student_id: attempt.studentId,
      exam_id: attempt.examId
    }).select().single();
    return data!;
  }

  async getExamAttemptsByStudent(studentId: string) {
    const { data } = await supabase.from('exam_attempts').select('*').eq('student_id', studentId).order('started_at', { ascending: false });
    return data || [];
  }

  async updateExamAttempt(id: string, updates: any) {
    const { data } = await supabase.from('exam_attempts').update(updates).eq('id', id).select().single();
    return data || undefined;
  }

  // Student answer methods
  async saveStudentAnswer(answer: { attemptId: string; questionId: string; selectedChoiceId?: string; answerText?: string }) {
    const { data } = await supabase.from('student_answers').insert({
      attempt_id: answer.attemptId,
      question_id: answer.questionId,
      selected_choice_id: answer.selectedChoiceId,
      answer_text: answer.answerText
    }).select().single();
    return data!;
  }
}

export const storage = new SupabaseStorage();
