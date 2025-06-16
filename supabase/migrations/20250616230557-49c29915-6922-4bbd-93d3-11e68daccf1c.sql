
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'admin');

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for exams
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  exam_code TEXT UNIQUE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_marks INTEGER NOT NULL DEFAULT 100,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for questions
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  marks INTEGER NOT NULL DEFAULT 1,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for answer choices
CREATE TABLE public.answer_choices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  choice_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for student exam attempts
CREATE TABLE public.exam_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  exam_id UUID REFERENCES public.exams(id) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  total_score INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress',
  UNIQUE(student_id, exam_id)
);

-- Create table for student answers
CREATE TABLE public.student_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES public.exam_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) NOT NULL,
  selected_choice_id UUID REFERENCES public.answer_choices(id),
  answer_text TEXT,
  is_correct BOOLEAN,
  marks_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for exams
CREATE POLICY "Teachers can view their own exams" ON public.exams
  FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can create exams" ON public.exams
  FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update their own exams" ON public.exams
  FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "Students can view active exams" ON public.exams
  FOR SELECT USING (is_active = true);

-- Create RLS policies for questions
CREATE POLICY "Teachers can manage questions for their exams" ON public.questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.exams 
      WHERE exams.id = questions.exam_id 
      AND exams.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view questions during exam attempts" ON public.questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exam_attempts 
      WHERE exam_attempts.exam_id = questions.exam_id 
      AND exam_attempts.student_id = auth.uid()
      AND exam_attempts.status = 'in_progress'
    )
  );

-- Create RLS policies for answer choices
CREATE POLICY "Teachers can manage answer choices for their exam questions" ON public.answer_choices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.exams e ON q.exam_id = e.id
      WHERE q.id = answer_choices.question_id 
      AND e.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view answer choices during exam attempts" ON public.answer_choices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.exam_attempts ea ON q.exam_id = ea.exam_id
      WHERE q.id = answer_choices.question_id 
      AND ea.student_id = auth.uid()
      AND ea.status = 'in_progress'
    )
  );

-- Create RLS policies for exam attempts
CREATE POLICY "Students can view their own exam attempts" ON public.exam_attempts
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create their own exam attempts" ON public.exam_attempts
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own exam attempts" ON public.exam_attempts
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Teachers can view attempts for their exams" ON public.exam_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exams 
      WHERE exams.id = exam_attempts.exam_id 
      AND exams.teacher_id = auth.uid()
    )
  );

-- Create RLS policies for student answers
CREATE POLICY "Students can manage their own answers" ON public.student_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.exam_attempts 
      WHERE exam_attempts.id = student_answers.attempt_id 
      AND exam_attempts.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view answers for their exam attempts" ON public.student_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exam_attempts ea
      JOIN public.exams e ON ea.exam_id = e.id
      WHERE ea.id = student_answers.attempt_id 
      AND e.teacher_id = auth.uid()
    )
  );

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate unique exam codes
CREATE OR REPLACE FUNCTION public.generate_exam_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-character random code
    code := upper(substr(md5(random()::text), 1, 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.exams WHERE exam_code = code) INTO exists_check;
    
    -- If code doesn't exist, return it
    IF NOT exists_check THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
