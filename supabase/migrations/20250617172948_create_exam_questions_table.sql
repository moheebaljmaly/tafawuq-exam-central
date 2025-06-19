CREATE TABLE public.exam_questions (
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    marks INT NOT NULL,
    PRIMARY KEY (exam_id, question_id)
);

ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage questions for their own exams"
ON public.exam_questions
FOR ALL
USING (
    (SELECT teacher_id FROM public.exams WHERE id = exam_id) = auth.uid()
);

COMMENT ON TABLE public.exam_questions IS 'Links questions to exams and stores the points for each question in that exam.';
