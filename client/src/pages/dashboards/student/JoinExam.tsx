import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const JoinExam = () => {
    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const [examCode, setExamCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleJoinExam = async (e) => {
        e.preventDefault();
        if (!examCode.trim() || !userProfile) return;

        setLoading(true);
        setError('');
        
        try {
            console.log('User profile:', userProfile);
            console.log('Attempting to join exam with code:', examCode.trim().toUpperCase());
            
            // 1. Find the exam with the given code
            const { data: exam, error: examError } = await supabase
                .from('exams')
                .select('id, title, start_time, end_time')
                .eq('exam_code', examCode.trim().toUpperCase())
                .single();

            console.log('Exam search result:', exam, examError);

            if (examError) {
                console.error('Error finding exam:', examError);
                setError('كود الامتحان غير صالح أو لم يتم العثور عليه.');
                toast.error('كود الامتحان غير صالح أو لم يتم العثور عليه.');
                return;
            }

            // Verify exam timing
            const now = new Date();
            const startTime = new Date(exam.start_time);
            const endTime = new Date(exam.end_time);
            
            if (now < startTime) {
                setError(`هذا الامتحان لم يبدأ بعد. سيبدأ في ${startTime.toLocaleString('ar-SA')}`);
                toast.error(`هذا الامتحان لم يبدأ بعد. سيبدأ في ${startTime.toLocaleString('ar-SA')}`);
                return;
            }
            
            if (now > endTime) {
                setError('هذا الامتحان قد انتهى.');
                toast.error('هذا الامتحان قد انتهى.');
                return;
            }

            // 2. Check if the student is already registered
            const { data: existingRegistration, error: checkError } = await supabase
                .from('exam_attempts')
                .select('id, status')
                .eq('student_id', userProfile.id)
                .eq('exam_id', exam.id)
                .single();

            console.log('Existing registration check:', existingRegistration, checkError);

            if (existingRegistration) {
                toast.info(`أنت مسجل بالفعل في امتحان "${exam.title}".`);
                navigate('/student-dashboard/available-exams');
                return;
            }

            // 3. Register the student for the exam
            const { data: registration, error: registrationError } = await supabase
                .from('exam_attempts')
                .insert({
                    student_id: userProfile.id,
                    exam_id: exam.id,
                    status: 'registered',
                })
                .select()
                .single();

            console.log('Registration result:', registration, registrationError);

            if (registrationError) {
                throw registrationError;
            }

            toast.success(`تم تسجيلك بنجاح في امتحان "${exam.title}"!`);
            navigate('/student-dashboard/available-exams');

        } catch (error) {
            console.error('Error joining exam:', error);
            setError('حدث خطأ أثناء الانضمام للامتحان: ' + error.message);
            toast.error('حدث خطأ أثناء الانضمام للامتحان: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>الانضمام إلى امتحان</CardTitle>
                <CardDescription>أدخل كود الامتحان الذي تلقيته من معلمك للانضمام.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleJoinExam} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="exam-code" className="text-sm font-medium">كود الامتحان</label>
                        <Input
                            id="exam-code"
                            placeholder="مثال: AB12CD"
                            value={examCode}
                            onChange={(e) => setExamCode(e.target.value)}
                            className="text-center text-lg tracking-widest"
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
                            {error}
                        </div>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري التحقق...</> : 'الانضمام'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default JoinExam; 