import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ArrowRight } from "lucide-react";

const JoinExam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [examCode, setExamCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinExam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!examCode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رمز الامتحان",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    
    try {
      // البحث عن الامتحان برمز الدخول
      const response = await fetch(`/api/exams/code/${examCode.toUpperCase()}`);
      
      if (!response.ok) {
        throw new Error('رمز الامتحان غير صحيح أو الامتحان غير متاح');
      }
      
      const exam = await response.json();
      
      // الانضمام للامتحان
      const joinResponse = await fetch(`/api/exams/${exam.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: 'demo_student'
        })
      });

      if (!joinResponse.ok) {
        throw new Error('فشل في الانضمام للامتحان');
      }

      toast({
        title: "تم الانضمام بنجاح",
        description: `تم الانضمام لامتحان: ${exam.title}`
      });

      // التوجه إلى صفحة الامتحان
      setTimeout(() => {
        navigate(`/take-exam/${exam.id}`);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في الانضمام للامتحان",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الانضمام لامتحان</h2>
        <p className="text-muted-foreground">أدخل رمز الامتحان للانضمام</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            رمز الامتحان
          </CardTitle>
          <CardDescription>
            أدخل الرمز الذي حصلت عليه من المعلم للانضمام للامتحان
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinExam} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="examCode">رمز الامتحان</Label>
              <Input
                id="examCode"
                type="text"
                placeholder="مثال: ABC123"
                value={examCode}
                onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono tracking-wider"
                maxLength={10}
              />
              <p className="text-sm text-muted-foreground">
                الرمز عبارة عن 6 أحرف أو أرقام
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isJoining}
            >
              {isJoining ? (
                "جاري الانضمام..."
              ) : (
                <>
                  <ArrowRight className="h-5 w-5 ml-2" />
                  الانضمام للامتحان
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* معلومات مفيدة */}
      <Card>
        <CardHeader>
          <CardTitle>تعليمات الانضمام</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              تأكد من إدخال الرمز بشكل صحيح كما حصلت عليه من المعلم
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              الرمز حساس للأحرف الكبيرة والصغيرة
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              تأكد من أن الامتحان متاح ولم ينته وقته
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              إذا كان لديك مشكلة في الرمز، تواصل مع المعلم
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* أمثلة على الرموز */}
      <Card>
        <CardHeader>
          <CardTitle>أمثلة على رموز الامتحانات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-mono text-lg">MATH01</div>
              <div className="text-sm text-muted-foreground">امتحان الرياضيات</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-mono text-lg">SCI123</div>
              <div className="text-sm text-muted-foreground">امتحان العلوم</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinExam;