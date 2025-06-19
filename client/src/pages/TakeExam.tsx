import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, type NavigateFunction } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"



const TakeExam = () => {
    console.log('--- Entering TakeExam component ---');
    const { examId } = useParams();
    const navigate: NavigateFunction = useNavigate(); // Explicitly type navigate
    const { user, userProfile } = useAuth();
    console.log('TakeExam - user and userProfile from useAuth:', { user: !!user, userProfile: !!userProfile, userData: user, profileData: userProfile });
    const [searchParams] = useSearchParams();
    const isPreview = searchParams.get('preview') === 'true' && userProfile?.role === 'teacher';
    
    console.log('TakeExam - useParams examId:', examId);
    console.log('TakeExam - user profile:', userProfile);

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    console.log('Before useEffect in TakeExam.');
    useEffect(() => {
        console.log('Inside useEffect in TakeExam.');
        const fetchExamData = async () => {
            console.log('Inside fetchExamData function.');
            setLoading(true);
            try {
                console.log('Checking initial conditions: user=', !!user, 'userProfile=', !!userProfile, 'examId=', !!examId);
                if (!user || !userProfile || !examId) {
                   console.log('Initial conditions not met, returning from fetchExamData.', {user: !!user, userProfile: !!userProfile, examId: !!examId});
                   setLoading(false); // Stop loading if conditions not met
                   return;
                }

                if (isPreview) {
                     console.log('Fetching exam data for teacher preview...');
                    const { data: examData, error: examError } = await supabase
                        .from('exams')
                        .select('*')
                        .eq('id', examId)
                        .eq('teacher_id', user.id)
                        .single();

                    console.log('Preview exam data:', examData, 'Error:', examError);
                    if (examError || !examData) throw new Error("لا يمكنك معاينة هذا الامتحان أو أنه غير موجود.");
                    setExam(examData);
                } else { // This is the student path
                     console.log('Fetching registration data for student...');
                    const { data: registrationData, error: registrationError } = await supabase
                        .from('exam_attempts')
                        .select('id, status, exams(*)')
                        .eq('exam_id', examId)
                        .eq('student_id', userProfile.id)
                        .single();

                    console.log('Raw registration data from Supabase:', registrationData, 'Error:', registrationError);
                    console.log('Step 1: Fetched registration data:', registrationData, 'Error:', registrationError);
                    if (registrationError || !registrationData) throw new Error("أنت غير مسجل في هذا الامتحان أو أن الامتحان غير موجود.");
                    
                    console.log('Step 2: Checking exam data...', registrationData.exams);
                    if (!registrationData.exams) {
                         throw new Error("بيانات الامتحان الأصلية غير موجودة أو قد تم حذفها.");
                    }
                    
                    console.log('Step 3: Checking registration status...', registrationData.status);
                    if (registrationData.status === 'completed') throw new Error("لقد قمت بتسليم هذا الامتحان مسبقًا.");
                    
                    console.log('Step 4: Setting exam data and proceeding to fetch questions.');
                    setExam({ ...registrationData.exams, registrationId: registrationData.id });
                }

                console.log('Attempting to fetch exam questions...');
                const { data: questionsData, error: questionsError } = await supabase
                    .from('exam_questions')
                    .select('questions(*)')
                    .eq('exam_id', examId);

                if (questionsError) throw new Error("فشل في تحميل أسئلة الامتحان.");

                console.log('Questions Data from Supabase:', questionsData);
                
                const loadedQuestions = questionsData.map(q => q.questions).filter(Boolean);
                console.log('Filtered questions:', loadedQuestions);
                
                if (loadedQuestions.length === 0 && questionsData.length > 0) {
                    toast.warning("تم العثور على أسئلة مرتبطة ولكن تعذر تحميلها.");
                } else if (loadedQuestions.length === 0) {
                    toast.warning("هذا الامتحان لا يحتوي على أي أسئلة.");
                }
                setQuestions(loadedQuestions);

            } catch (err) {
                toast.error(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, [examId, user, userProfile, isPreview]);
    useEffect(() => {
        if (!exam || !exam.end_time || isPreview) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const endTime = new Date(exam.end_time).getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft(0);
                if (!isSubmitting && !isFinished) {
                    toast.warning("انتهى الوقت! سيتم تسليم إجاباتك الآن.");
                    handleSubmitExam(); 
                }
            } else {
                setTimeLeft(distance);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [exam, isSubmitting, isPreview, isFinished]);

    const handleSubmitExam = async () => {
        if (!exam || !exam.registrationId) {
            toast.error("فشل في التسليم: معلومات تسجيل الامتحان غير متوفرة.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        toast.info("جاري تسليم إجاباتك...");

        try {
            let score = 0;
            const answerPromises = questions.map(q => {
                const selectedOption = answers[q.id];
                const correctAnswer = typeof q.correct_answer === 'object' ? q.correct_answer?.answer : q.correct_answer;
                const isCorrect = selectedOption !== undefined && correctAnswer === selectedOption;
                
                console.log('Question:', q.question_text);
                console.log('Selected answer:', selectedOption);
                console.log('Correct answer:', correctAnswer);
                console.log('Is correct?', isCorrect);
                
                if (isCorrect) score++;

                return supabase.from('student_exam_answers').insert({
                    registration_id: exam.registrationId,
                    question_id: q.id,
                    selected_option: selectedOption,
                    is_correct: isCorrect
                });
            });
            
            const results = await Promise.all(answerPromises);
            const hasErrors = results.some(res => res.error);
            if (hasErrors) throw new Error("فشلت بعض الإجابات في الحفظ.");

            const finalScore = questions.length > 0 ? (score / questions.length) * 100 : 0;

            await supabase.from('exam_registrations').update({
                status: 'completed',
                submitted_at: new Date().toISOString(),
                score: finalScore
            }).eq('id', exam.registrationId);

            toast.success("تم تسليم الامتحان بنجاح!");
            setIsFinished(true);

        } catch (dbError) {
            toast.error("فشل في حفظ الإجابات: " + dbError.message);
            setIsSubmitting(false);
        }
    };

    const formatTime = (ms) => {
        if (ms === null) return '00:00:00';
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    
    if (loading) return <div className="flex justify-center items-center h-screen"><p>جاري التحميل...</p></div>;
    if (error) return (
        <div className="flex flex-col justify-center items-center h-screen text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">حدث خطأ</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/student-dashboard')}>العودة إلى لوحة التحكم</Button>
        </div>
    );

    if (isFinished) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-center" dir="rtl">
                <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
                <h1 className="text-3xl font-bold mb-4">اكتمل الامتحان بنجاح!</h1>
                <p className="text-gray-700 text-lg mb-8">تم تسليم إجاباتك بنجاح. يمكنك الآن عرض نتيجتك.</p>
                <Button onClick={() => navigate(`/student-dashboard/exam-result/${exam.registrationId}`)} size="lg">
                    عرض النتيجة
                </Button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4" dir="rtl">
            {isPreview && (
                <div className="w-full max-w-4xl mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">وضع المعاينة</p>
                    <p>أنت تشاهد هذا الامتحان كمعلم. لن يتم تسجيل إجاباتك ولن يعمل المؤقت.</p>
                </div>
            )}
            <Card className="w-full max-w-4xl shadow-lg">
                <CardHeader className="bg-gray-100 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">{exam?.title}</CardTitle>
                            <p className="text-sm text-gray-600">{exam?.subject}</p>
                        </div>
                        <div className={`flex items-center gap-2 font-mono text-lg p-2 border rounded-md ${isPreview ? 'text-gray-500' : 'text-red-600'}`}>
                            <Clock className="h-5 w-5" />
                            <span>{isPreview ? 'معطل' : formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {questions.length > 0 && currentQuestion ? (
                        <div>
                            <div className="mb-6">
                                <p className="text-lg font-semibold text-gray-800 mb-2">
                                    السؤال {currentQuestionIndex + 1} من {questions.length}
                                </p>
                                <p className="text-xl">{currentQuestion.question_text}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold mb-4">اختر الإجابة الصحيحة:</h3>
                                {currentQuestion.question_type === 'multiple_choice' && (
                                    <RadioGroup
                                        value={answers[currentQuestion.id]}
                                        onValueChange={(value) => {
                                            setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
                                        }}
                                        className="space-y-3"
                                    >
                                        {currentQuestion.options.map((option, index) => (
                                            <div key={index} className="flex items-center space-x-3 space-x-reverse rounded-md border p-4 hover:bg-gray-50 transition-colors">
                                                <RadioGroupItem value={String(index)} id={`q${currentQuestion.id}-o${index}`} />
                                                <Label htmlFor={`q${currentQuestion.id}-o${index}`} className="flex-1 cursor-pointer text-lg">{option.text}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10"><p>لا توجد أسئلة متاحة لهذا الامتحان.</p></div>
                    )}
                </CardContent>

                <div className="flex justify-between items-center p-4 border-t">
                    <Button 
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0 || isSubmitting}
                    >
                        <ChevronRight className="h-4 w-4 ml-1" />
                        السابق
                    </Button>
                    
                    {currentQuestionIndex === questions.length - 1 ? (
                        <Button 
                            variant="default"
                            onClick={() => setShowSubmitConfirm(true)}
                            disabled={isSubmitting || isPreview}
                            className="bg-green-600 hover:bg-green-700"
                        >
                           {isSubmitting ? "جاري التسليم..." : "تسليم الإجابات"}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            disabled={isSubmitting}
                        >
                            التالي
                           <ChevronLeft className="h-4 w-4 mr-1" />
                        </Button>
                    )}
                </div>
            </Card>

            <AlertDialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد من رغبتك في التسليم؟</AlertDialogTitle>
                        <AlertDialogDescription>بمجرد تسليم إجاباتك، لن تتمكن من تغييرها. سيتم حساب نتيجتك النهائية.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmitExam} disabled={isSubmitting}>
                            {isSubmitting ? "جاري التسليم..." : "نعم، قم بالتسليم"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default TakeExam; 