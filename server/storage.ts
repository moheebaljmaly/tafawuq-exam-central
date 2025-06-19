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
  getExamByCode(code: string): Promise<Exam | undefined>;
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
    try {
      const { data, error } = await this.supabase.from('exams').insert({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        duration_minutes: exam.duration_minutes,
        teacher_id: exam.teacher_id,
        is_active: exam.is_active,
        code: exam.code,
        start_time: exam.start_time,
        end_time: exam.end_time
      }).select().single();
      
      if (error) {
        console.error('Error creating exam:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error creating exam:', error);
      throw error;
    }
  }

  async getExamsByTeacher(teacherId: string): Promise<any[]> {
    const { data } = await supabase.from('exams').select('*').eq('teacher_id', teacherId).order('created_at', { ascending: false });
    return data || [];
  }

  async getActiveExams(): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('exams')
        .select(`
          *,
          profiles!exams_teacher_id_fkey(full_name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching active exams:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching active exams:', error);
      return [];
    }
  }

  async getExamById(id: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('exams')
        .select(`
          *,
          profiles!exams_teacher_id_fkey(full_name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching exam by id:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error fetching exam by id:', error);
      return null;
    }
  }

  async getExamByCode(code: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('exams')
        .select(`
          *,
          profiles!exams_teacher_id_fkey(full_name)
        `)
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.error('Error fetching exam by code:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error fetching exam by code:', error);
      return null;
    }
  }

  async updateExam(id: string, updates: any): Promise<any> {
    const { data } = await supabase.from('exams').update(updates).eq('id', id).select().single();
    return data || undefined;
  }

  // Question methods
  async createQuestion(question: any): Promise<any> {
    try {
      const { data, error } = await this.supabase.from('questions').insert({
        id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        exam_id: question.exam_id,
        question_text: question.question_text,
        question_type: question.question_type,
        order_number: question.order_number
      }).select().single();
      
      if (error) {
        console.error('Error creating question:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error creating question:', error);
      throw error;
    }
  }

  async getQuestionsByExam(examId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('questions')
        .select(`
          *,
          answer_choices(*)
        `)
        .eq('exam_id', examId)
        .order('order_number');
      
      if (error) {
        console.error('Error fetching questions:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching questions:', error);
      return [];
    }
  }

  // Answer choice methods
  async createAnswerChoice(choice: { questionId: string; choiceText: string; isCorrect: boolean; orderNumber: number }) {
    try {
      const { data, error } = await this.supabase.from('answer_choices').insert({
        id: `ac_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question_id: choice.questionId,
        choice_text: choice.choiceText,
        is_correct: choice.isCorrect,
        order_number: choice.orderNumber
      }).select().single();
      
      if (error) {
        console.error('Error creating answer choice:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Unexpected error creating answer choice:', error);
      throw error;
    }
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
