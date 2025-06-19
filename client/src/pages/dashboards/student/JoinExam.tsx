import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Users, Clock, BookOpen, AlertCircle } from "lucide-react";

const JoinExam = () => {
  const [examCode, setExamCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [examInfo, setExamInfo] = useState(null);
  const { toast } = useToast();

  // بيانات وهمية للامتحانات
  const mockExams = {
    "MATH2025": {
      title: "امتحان الرياضيات المتقدمة",
      teacher: "د. أحمد محمد",
      duration: 120,
      questions: 50,
      startTime: "2025-06-25T10:00:00",
      endTime: "2025-06-25T12:00:00",
      description: "امتحان شامل في الجبر والهندسة التحليلية",
      status: "active"
    },
    "SCI2025": {
      title: "امتحان العلوم الطبيعية",
      teacher: "د. فاطمة علي",
      duration: 90,
      questions: 40,
      startTime: "2025-06-28T14:00:00",
      endTime: "2025-06-28T15:30:00",
      description: "فيزياء وكيمياء وأحياء",
      status: "upcoming"
    },
    "HIST2025": {
      title: "امتحان التاريخ الإسلامي",
      teacher: "د. محمد حسن",
      duration: 60,
      questions: 30,
      startTime: "2025-06-20T09:00:00",
      endTime: "2025-06-20T10:00:00",
      description: "تاريخ الدولة الإسلامية من البداية حتى العصر العباسي",
      status: "ended"
    }
  };

  const handleSearch = async () => {
    if (!examCode.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رمز الامتحان",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // محاكاة طلب API
    setTimeout(() => {
      const exam = mockExams[examCode.toUpperCase()];
      if (exam) {
        setExamInfo(exam);
        toast({
          title: "تم العثور على الامتحان",
          description: "تم العثور على الامتحان بنجاح"
        });
      } else {
        setExamInfo(null);
        toast({
          title: "لم يتم العثور على الامتحان",
          description: "رمز الامتحان غير صحيح أو منتهي الصلاحية",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleJoinExam = () => {
    if (!examInfo) return;

    if (examInfo.status === "ended") {
      toast({
        title: "انتهى الامتحان",
        description: "انتهى وقت هذا الامتحان ولا يمكن دخوله",
        variant: "destructive"
      });
      return;
    }

    if (examInfo.status === "upcoming") {
      toast({
        title: "الامتحان لم يبدأ بعد",
        description: "سيكون الامتحان متاحاً في الوقت المحدد",
        variant: "destructive"
      });
      return;
    }

    // توجيه إلى صفحة الامتحان
    window.location.href = `/take-exam/${examCode}`;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('ar-SA') + ' - ' + date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return { text: "متاح الآن", color: "text-green-600", bgColor: "bg-green-50" };
      case "upcoming":
        return { text: "لم يبدأ بعد", color: "text-orange-600", bgColor: "bg-orange-50" };
      case "ended":
        return { text: "انتهى", color: "text-red-600", bgColor: "bg-red-50" };
      default:
        return { text: "غير معروف", color: "text-gray-600", bgColor: "bg-gray-50" };
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الانضمام لامتحان</h2>
        <p className="text-muted-foreground">أدخل رمز الامتحان للانضمام</p>
      </div>

      {/* نموذج إدخال رمز الامتحان */}
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="examCode">رمز الامتحان</Label>
            <Input
              id="examCode"
              placeholder="مثال: MATH2025"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value.toUpperCase())}
              className="text-center text-lg font-mono"
              maxLength={10}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading || !examCode.trim()}
            className="w-full"
          >
            {isLoading ? "جاري البحث..." : "البحث عن الامتحان"}
          </Button>
        </CardContent>
      </Card>

      {/* معلومات الامتحان */}
      {examInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{examInfo.title}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(examInfo.status).color} ${getStatusInfo(examInfo.status).bgColor}`}>
                {getStatusInfo(examInfo.status).text}
              </span>
            </CardTitle>
            <CardDescription>{examInfo.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* تفاصيل الامتحان */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">المعلم: {examInfo.teacher}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">المدة: {examInfo.duration} دقيقة</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">الأسئلة: {examInfo.questions} سؤال</span>
              </div>
            </div>

            {/* أوقات الامتحان */}
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">وقت البداية: </span>
                <span className="text-muted-foreground">{formatDateTime(examInfo.startTime)}</span>
              </div>
              <div>
                <span className="font-medium">وقت النهاية: </span>
                <span className="text-muted-foreground">{formatDateTime(examInfo.endTime)}</span>
              </div>
            </div>

            {/* تحذيرات حسب حالة الامتحان */}
            {examInfo.status === "upcoming" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  هذا الامتحان لم يبدأ بعد. سيكون متاحاً في الوقت المحدد.
                </AlertDescription>
              </Alert>
            )}

            {examInfo.status === "ended" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  انتهى وقت هذا الامتحان ولا يمكن دخوله.
                </AlertDescription>
              </Alert>
            )}

            {examInfo.status === "active" && (
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  الامتحان متاح الآن. يمكنك الانضمام وبدء الحل.
                </AlertDescription>
              </Alert>
            )}

            {/* زر الانضمام */}
            <Button 
              onClick={handleJoinExam}
              disabled={examInfo.status !== "active"}
              className="w-full"
              size="lg"
            >
              {examInfo.status === "active" ? "الانضمام للامتحان" : 
               examInfo.status === "upcoming" ? "الامتحان لم يبدأ بعد" : 
               "انتهى الامتحان"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* تعليمات */}
      <Card>
        <CardHeader>
          <CardTitle>تعليمات مهمة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• تأكد من استقرار اتصال الإنترنت قبل بدء الامتحان</li>
            <li>• احفظ إجاباتك بانتظام لتجنب فقدان البيانات</li>
            <li>• لا يمكن إعادة دخول الامتحان بعد تسليمه</li>
            <li>• اتصل بالمعلم في حالة وجود أي مشاكل تقنية</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinExam;