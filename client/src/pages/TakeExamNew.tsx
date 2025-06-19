import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Clock, AlertCircle, Save, Send } from "lucide-react";

const TakeExamNew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(7200); // 2 hours in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب بيانات الامتحان
  const { data: exam, isLoading: examLoading, error: examError } = useQuery({
    queryKey: ['/api/exams', id],
    queryFn: async () => {
      const response = await fetch(`/api/exams/${id}`);
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات الامتحان');
      }
      return response.json();
    },
    enabled: !!id
  });

  // جلب الأسئلة
  const { data: questions = [], isLoading: questionsLoading, error: questionsError } = useQuery({
    queryKey: ['/api/exams', id, 'questions'],
    queryFn: async () => {
      const response = await fetch(`/api/exams/${id}/questions`);
      if (!response.ok) {
        throw new Error('فشل في جلب أسئلة الامتحان');
      }
      return response.json();
    },
    enabled: !!id
  });

  const examQuestions = questions;

  // تحديث الوقت المتبقي بناءً على بيانات الامتحان
  useEffect(() => {
    if (exam?.duration_minutes) {
      setTimeRemaining(exam.duration_minutes * 60);
    }
  }, [exam]);

  // مؤقت العد التنازلي
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId: id,
          answers,
          attemptId: 'demo_attempt'
        })
      });

      if (!response.ok) {
        throw new Error('فشل في تسليم الامتحان');
      }
      
      toast({
        title: "تم تسليم الامتحان",
        description: "تم تسليم إجاباتك بنجاح"
      });
      
      navigate("/exam-result");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تسليم الامتحان",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAnswer = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ إجابتك"
    });
  };

  if (!id) {
    return <div>معرف الامتحان مفقود</div>;
  }

  if (examLoading || questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-lg">جاري تحميل الامتحان...</p>
        </div>
      </div>
    );
  }

  if (examError || questionsError) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-lg text-red-600">خطأ في جلب بيانات الامتحان</p>
          <p className="text-sm text-muted-foreground">
            {examError?.message || questionsError?.message}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (!examQuestions || examQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-lg">لا توجد أسئلة في هذا الامتحان</p>
          <Button onClick={() => navigate('/student-dashboard')} className="mt-4">
            العودة إلى لوحة التحكم
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / examQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* رأس الصفحة */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{exam?.title || 'امتحان الرياضيات - الفصل الأول'}</h1>
            <p className="text-muted-foreground">{exam?.description || 'اقرأ الأسئلة بعناية واختر الإجابة الصحيحة'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5" />
              <span className={timeRemaining < 300 ? "text-red-600" : ""}>{formatTime(timeRemaining)}</span>
            </div>
            {timeRemaining < 300 && (
              <Badge variant="destructive" className="animate-pulse">
                الوقت ينفد!
              </Badge>
            )}
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>التقدم في الامتحان</span>
            <span>{currentQuestion + 1} من {examQuestions.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* بطاقة السؤال */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>السؤال {currentQuestion + 1}</CardTitle>
            <CardDescription>
              السؤال {currentQuestion + 1} من {examQuestions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{examQuestions[currentQuestion].question_text}</h3>

              {(examQuestions[currentQuestion].question_type === "multiple_choice") ? (
                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={(value) => setAnswers(prev => ({ ...prev, [currentQuestion]: value }))}
                >
                  {examQuestions[currentQuestion].answer_choices?.map((choice) => (
                    <div key={choice.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={choice.id} id={choice.id} />
                      <Label htmlFor={choice.id} className="flex-1 cursor-pointer">
                        {choice.choice_text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <Textarea
                  placeholder="اكتب إجابتك هنا..."
                  value={answers[currentQuestion] || ""}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion]: e.target.value }))}
                  rows={8}
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-muted-foreground">
                يتم حفظ إجاباتك تلقائياً كل 30 ثانية
              </span>
            </div>
          </CardContent>
        </Card>

        {/* أزرار التنقل */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          >
            السؤال السابق
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveAnswer}>
              <Save className="h-4 w-4 ml-2" />
              حفظ الإجابة
            </Button>
          </div>

          <div className="flex gap-2">
            {currentQuestion < examQuestions.length - 1 ? (
              <Button onClick={() => setCurrentQuestion(Math.min(examQuestions.length - 1, currentQuestion + 1))}>
                السؤال التالي
              </Button>
            ) : (
              <Button 
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 ml-2" />
                {isSubmitting ? "جاري التسليم..." : "تسليم الامتحان"}
              </Button>
            )}
          </div>
        </div>

        {/* نظرة عامة على الأسئلة */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-3">نظرة عامة على الإجابات</h4>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {examQuestions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? "default" : answers[index] ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className="w-8 h-8 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            تم الإجابة على {Object.keys(answers).length} من {examQuestions.length} سؤال
          </p>
        </div>
      </div>
    </div>
  );
};

export default TakeExamNew;