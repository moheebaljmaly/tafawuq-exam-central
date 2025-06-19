import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CreateExamForm } from './components/CreateExamForm';
import { AddQuestionDialog } from './components/AddQuestionDialog';

const examSchema = z.object({
    title: z.string().min(5, { message: "العنوان يجب أن يكون 5 أحرف على الأقل." }),
    subject: z.string().min(2, { message: "المادة يجب أن تكون حرفين على الأقل." }),
    description: z.string().optional(),
    start_time: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "تاريخ البدء مطلوب." }),
    end_time: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "تاريخ الانتهاء مطلوب." }),
    questions: z.array(z.string()).min(1, { message: "يجب اختيار سؤال واحد على الأقل." }),
}).refine(data => new Date(data.start_time) < new Date(data.end_time), {
    message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.",
    path: ["end_time"],
});

const CreateExam = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [isAddQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(examSchema),
        defaultValues: {
            title: '',
            subject: '',
            description: '',
            start_time: '',
            end_time: '',
            questions: [],
        }
    });

    const fetchQuestions = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('questions')
            .select('id, question_text')
            .eq('teacher_id', user.id);
        if (error) {
            toast.error("فشل في جلب الأسئلة: " + error.message);
        } else {
            setAvailableQuestions(data);
        }
    }, [user]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const handleQuestionAdded = (newQuestion) => {
        // Refresh the questions list
        fetchQuestions();
        // Add the new question to the form's selected questions
        const currentQuestions = form.getValues('questions');
        form.setValue('questions', [...currentQuestions, newQuestion.id]);
        setAddQuestionDialogOpen(false); // Close the dialog
    }

    const generateExamCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const onSubmit = async (values) => {
        if (!user) return;
        
        try {
            const examCode = generateExamCode();
            
            const startTime = new Date(values.start_time).toISOString();
            const endTime = new Date(values.end_time).toISOString();

            const { data: examData, error: examError } = await supabase.from('exams').insert({
                title: values.title,
                subject: values.subject,
                description: values.description,
                start_time: startTime,
                end_time: endTime,
                teacher_id: user.id,
                exam_code: examCode
            }).select('id').single();

            if (examError) throw examError;

            const examId = examData.id;
            const examQuestions = values.questions.map(questionId => ({
                exam_id: examId,
                question_id: questionId,
                marks: 1
            }));

            const { error: questionsError } = await supabase.from('exam_questions').insert(examQuestions);

            if (questionsError) throw questionsError;

            toast.success("تم إنشاء الامتحان بنجاح!");
            navigate('/teacher-dashboard/manage-exams');

        } catch (error) {
            toast.error("حدث خطأ أثناء إنشاء الامتحان: " + error.message);
        }
    };

    return (
        <>
            <AddQuestionDialog 
                open={isAddQuestionDialogOpen}
                onOpenChange={setAddQuestionDialogOpen}
                onQuestionAdded={handleQuestionAdded}
            />
            <CreateExamForm
                form={form}
                onSubmit={onSubmit}
                availableQuestions={availableQuestions}
                isEditing={false}
                onAddNewQuestion={() => setAddQuestionDialogOpen(true)}
            />
        </>
    );
};

export default CreateExam; 