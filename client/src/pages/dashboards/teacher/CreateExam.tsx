import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Eye } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'essay';
  choices?: Choice[];
  points: number;
}

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

const CreateExam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examCode, setExamCode] = useState("");
  
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    duration: 60,
    totalPoints: 0,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    instructions: ""
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: 'multiple_choice' as 'multiple_choice' | 'essay',
    choices: [
      { id: '1', text: "", isCorrect: false },
      { id: '2', text: "", isCorrect: false },
      { id: '3', text: "", isCorrect: false },
      { id: '4', text: "", isCorrect: false }
    ],
    points: 1
  });

  const generateExamCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setExamCode(code);
    return code;
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال نص السؤال",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion.type === 'multiple_choice') {
      const hasCorrectAnswer = currentQuestion.choices.some(choice => choice.isCorrect);
      if (!hasCorrectAnswer) {
        toast({
          title: "خطأ",
          description: "يرجى تحديد الإجابة الصحيحة",
          variant: "destructive"
        });
        return;
      }
    }

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      text: currentQuestion.text,
      type: currentQuestion.type,
      choices: currentQuestion.type === 'multiple_choice' ? currentQuestion.choices : undefined,
      points: currentQuestion.points
    };

    setQuestions(prev => [...prev, newQuestion]);
    setExamData(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + currentQuestion.points
    }));

    // Reset current question
    setCurrentQuestion({
      text: "",
      type: 'multiple_choice',
      choices: [
        { id: '1', text: "", isCorrect: false },
        { id: '2', text: "", isCorrect: false },
        { id: '3', text: "", isCorrect: false },
        { id: '4', text: "", isCorrect: false }
      ],
      points: 1
    });

    toast({
      title: "تم إضافة السؤال",
      description: "تم إضافة السؤال بنجاح"
    });
  };

  const removeQuestion = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      setExamData(prev => ({
        ...prev,
        totalPoints: prev.totalPoints - question.points
      }));
    }
  };

  const updateChoice = (choiceId: string, text: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      choices: prev.choices.map(choice =>
        choice.id === choiceId ? { ...choice, text } : choice
      )
    }));
  };

  const setCorrectChoice = (choiceId: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      choices: prev.choices.map(choice => ({
        ...choice,
        isCorrect: choice.id === choiceId
      }))
    }));
  };

  const handleCreateExam = async () => {
    if (!examData.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان الامتحان",
        variant: "destructive"
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "خطأ",
        description: "يرجى إضافة أسئلة للامتحان",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const code = generateExamCode();
      
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...examData,
          code,
          questions,
          teacherId: 'demo_teacher',
          isActive: true
        })
      });

      if (!response.ok) {
        throw new Error('فشل في إنشاء الامتحان');
      }

      toast({
        title: "تم إنشاء الامتحان بنجاح",
        description: `رمز الامتحان: ${code}`
      });

      // Reset form
      setExamData({
        title: "",
        description: "",
        duration: 60,
        totalPoints: 0,
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        instructions: ""
      });
      setQuestions([]);
      
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الامتحان",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">إنشاء امتحان جديد</h2>
          <p className="text-muted-foreground">إنشاء وإعداد امتحان للطلاب</p>
        </div>
        {examCode && (
          <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
            رمز الامتحان: {examCode}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* معلومات الامتحان */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الامتحان</CardTitle>
            <CardDescription>البيانات الأساسية للامتحان</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان الامتحان</Label>
              <Input
                value={examData.title}
                onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="مثال: امتحان الرياضيات - الفصل الأول"
              />
            </div>

            <div className="space-y-2">
              <Label>وصف الامتحان</Label>
              <Textarea
                value={examData.description}
                onChange={(e) => setExamData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="وصف مختصر عن محتوى الامتحان"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>مدة الامتحان (دقيقة)</Label>
                <Input
                  type="number"
                  value={examData.duration}
                  onChange={(e) => setExamData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>إجمالي النقاط</Label>
                <Input
                  type="number"
                  value={examData.totalPoints}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>تاريخ البداية</Label>
                <Input
                  type="date"
                  value={examData.startDate}
                  onChange={(e) => setExamData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>وقت البداية</Label>
                <Input
                  type="time"
                  value={examData.startTime}
                  onChange={(e) => setExamData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>تعليمات الامتحان</Label>
              <Textarea
                value={examData.instructions}
                onChange={(e) => setExamData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="تعليمات خاصة للطلاب"
              />
            </div>
          </CardContent>
        </Card>

        {/* إضافة سؤال جديد */}
        <Card>
          <CardHeader>
            <CardTitle>إضافة سؤال جديد</CardTitle>
            <CardDescription>أدخل تفاصيل السؤال</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>نص السؤال</Label>
              <Textarea
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                placeholder="اكتب السؤال هنا..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع السؤال</Label>
                <Select
                  value={currentQuestion.type}
                  onValueChange={(value: 'multiple_choice' | 'essay') => 
                    setCurrentQuestion(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">اختيار متعدد</SelectItem>
                    <SelectItem value="essay">مقالي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>النقاط</Label>
                <Input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
            </div>

            {currentQuestion.type === 'multiple_choice' && (
              <div className="space-y-3">
                <Label>خيارات الإجابة</Label>
                {currentQuestion.choices.map((choice, index) => (
                  <div key={choice.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={choice.isCorrect}
                      onChange={() => setCorrectChoice(choice.id)}
                      className="mt-1"
                    />
                    <Input
                      value={choice.text}
                      onChange={(e) => updateChoice(choice.id, e.target.value)}
                      placeholder={`الخيار ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <Button onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 ml-2" />
              إضافة السؤال
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الأسئلة المضافة */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الأسئلة المضافة ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">سؤال {index + 1}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{question.text}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{question.type === 'multiple_choice' ? 'اختيار متعدد' : 'مقالي'}</Badge>
                        <Badge variant="outline">{question.points} نقطة</Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* أزرار الحفظ */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => navigate('/teacher-dashboard')}>
          إلغاء
        </Button>
        <Button 
          onClick={handleCreateExam}
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 ml-2" />
          {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الامتحان'}
        </Button>
      </div>
    </div>
  );
};

export default CreateExam;