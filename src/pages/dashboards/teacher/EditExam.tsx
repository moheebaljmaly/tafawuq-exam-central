import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { CreateExamForm } from './components/CreateExamForm';
import { Skeleton } from '@/components/ui/skeleton';

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

const toLocalISOString = (date) => {
    const d = new Date(date);
    // Pad a number to 2 digits
    const pad = (num) => (num < 10 ? '0' : '') + num;
    // Format to YYYY-MM-DDTHH:mm
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const EditExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [availableQuestions, setAvailableQuestions] = useState([]);
    
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

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !examId) return;
            setLoading(true);
            try {
                const { data: questionsData, error: questionsError } = await supabase
                    .from('questions')
                    .select('id, question_text')
                    .eq('teacher_id', user.id);
                if (questionsError) throw questionsError;
                setAvailableQuestions(questionsData);

                const { data: examData, error: examError } = await supabase
                    .from('exams')
                    .select('*, exam_questions(question_id)')
                    .eq('id', examId)
                    .single();
                
                if (examError) throw new Error("لم يتم العثور على الامتحان.");
                
                form.reset({
                    title: examData.title,
                    subject: examData.subject,
                    description: examData.description,
                    start_time: toLocalISOString(examData.start_time),
                    end_time: toLocalISOString(examData.end_time),
                    questions: examData.exam_questions.map(q => q.question_id),
                });

            } catch (error) {
                toast.error(error.message);
                navigate('/teacher-dashboard/manage-exams');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, examId, form, navigate]);

    const onSubmit = async (values) => {
        if (!user || !examId) return;
        
        form.control._formState.isSubmitting = true;
        try {
            toast.info("جاري تحديث الامتحان...");

            const startTime = new Date(values.start_time).toISOString();
            const endTime = new Date(values.end_time).toISOString();

            const { error: examUpdateError } = await supabase
                .from('exams')
                .update({
                    title: values.title,
                    subject: values.subject,
                    description: values.description,
                    start_time: startTime,
                    end_time: endTime,
                })
                .eq('id', examId);

            if (examUpdateError) throw examUpdateError;

            const { error: deleteError } = await supabase
                .from('exam_questions')
                .delete()
                .eq('exam_id', examId);
            
            if (deleteError) throw deleteError;

            const newExamQuestions = values.questions.map(questionId => ({
                exam_id: examId,
                question_id: questionId
            }));

            const { error: insertError } = await supabase
                .from('exam_questions')
                .insert(newExamQuestions);

            if (insertError) throw insertError;

            toast.success("تم تحديث الامتحان بنجاح!");
            navigate('/teacher-dashboard/manage-exams');

        } catch (error) {
            toast.error("حدث خطأ أثناء التحديث: " + error.message);
        } finally {
             form.control._formState.isSubmitting = false;
        }
    };

    if (loading) {
        return (
             <div className="container mx-auto py-8">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-6 w-80 mb-8" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <CreateExamForm
            form={form}
            onSubmit={onSubmit}
            availableQuestions={availableQuestions}
            isEditing={true}
        />
    );
};

export default EditExam; 