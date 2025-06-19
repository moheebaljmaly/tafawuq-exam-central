import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Award, Clock, Check, X, Percent, Hash } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';

const ExamResult = () => {
    const { registrationId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !registrationId) return;

        const fetchResultData = async () => {
            try {
                const { data, error: fetchError } = await supabase
                    .from('exam_registrations')
                    .select(`
                        score,
                        submitted_at,
                        exams (title, subject, created_at),
                        student_exam_answers (
                            is_correct,
                            questions (question_text, options, correct_answer)
                        )
                    `)
                    .eq('id', registrationId)
                    .eq('student_id', user.id)
                    .single();
                
                if (fetchError || !data) {
                    throw new Error("لم يتم العثور على نتيجة لهذا الامتحان أو لا تملك صلاحية الوصول.");
                }

                const totalQuestions = data.student_exam_answers.length;
                const correctAnswers = data.student_exam_answers.filter(a => a.is_correct).length;

                setResult({
                    ...data,
                    totalQuestions,
                    correctAnswers
                });

            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResultData();
    }, [registrationId, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-full max-w-3xl p-8 space-y-6">
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
             <div className="flex flex-col justify-center items-center h-screen text-center px-4">
                <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">حدث خطأ</h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={() => navigate('/student-dashboard')}>العودة إلى لوحة التحكم</Button>
            </div>
        )
    }

    const score = result?.score || 0;
    const scoreColor = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4" dir="rtl">
            <Card className="w-full max-w-4xl shadow-2xl animate-fade-in">
                <CardHeader className="text-center bg-gray-100 p-8 rounded-t-lg">
                    <Award className={`mx-auto h-20 w-20 ${scoreColor} mb-4`} />
                    <CardTitle className="text-4xl font-bold">نتيجة الامتحان</CardTitle>
                    <CardDescription className="text-xl text-gray-600 mt-2">{result.exams.title}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <p className="text-lg text-gray-700">لقد حصلت على</p>
                        <p className={`text-7xl font-bold my-2 ${scoreColor}`}>{score.toFixed(1)}<span className="text-5xl">%</span></p>
                        <Progress value={score} className="w-3/4 mx-auto mt-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-10 border-t border-b py-6">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <dt className="text-sm font-medium text-blue-600">الأسئلة الصحيحة</dt>
                            <dd className="mt-1 text-3xl font-semibold text-blue-800 flex items-center justify-center gap-2">
                                <Check /> {result.correctAnswers}
                            </dd>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <dt className="text-sm font-medium text-red-600">الأسئلة الخاطئة</dt>
                            <dd className="mt-1 text-3xl font-semibold text-red-800 flex items-center justify-center gap-2">
                                <X /> {result.totalQuestions - result.correctAnswers}
                            </dd>
                        </div>
                         <div className="p-4 bg-gray-50 rounded-lg">
                            <dt className="text-sm font-medium text-gray-600">إجمالي الأسئلة</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-800 flex items-center justify-center gap-2">
                                <Hash /> {result.totalQuestions}
                            </dd>
                        </div>
                    </div>
                    
                    <div className="flex justify-center">
                        <Button size="lg" onClick={() => navigate('/student-dashboard')}>
                            العودة إلى لوحة التحكم
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ExamResult; 