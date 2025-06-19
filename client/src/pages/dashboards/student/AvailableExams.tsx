import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, Users, BookOpen } from "lucide-react";

const AvailableExams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: exams = [], isLoading, error } = useQuery({
    queryKey: ['/api/exams/active'],
    queryFn: async () => {
      const response = await fetch('/api/exams/active');
      if (!response.ok) {
        throw new Error('فشل في جلب الامتحانات');
      }
      return response.json();
    }
  });

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinExam = async (examId: number | string) => {
    try {
      const response = await fetch(`/api/exams/${examId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: 'demo_student'
        })
      });
      
      if (!response.ok) {
        throw new Error('فشل في الانضمام للامتحان');
      }
      
      toast({
        title: "تم الانضمام بنجاح",
        description: "سيتم توجيهك إلى صفحة الامتحان"
      });
      
      // منع النقر المتكرر
      setTimeout(() => {
        window.location.href = `/take-exam/${examId}`;
      }, 1000);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الانضمام للامتحان",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (exam: any) => {
    if (exam.is_active || exam.status === "active") {
      return <Badge className="bg-green-100 text-green-800">متاح الآن</Badge>;
    } else if (exam.status === "upcoming") {
      return <Badge variant="outline">قريباً</Badge>;
    } else {
      return <Badge variant="secondary">غير متاح</Badge>;
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('ar-SA') + ' - ' + date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الامتحانات المتاحة</h2>
        <p className="text-muted-foreground">اختر امتحاناً لبدء الحل</p>
      </div>

      {/* شريط البحث */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="البحث في الامتحانات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p>جاري تحميل الامتحانات...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">خطأ في جلب البيانات: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      )}

      {/* قائمة الامتحانات */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{exam.title}</CardTitle>
                  <CardDescription className="mt-2">{exam.description}</CardDescription>
                </div>
                {getStatusBadge(exam)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* تفاصيل الامتحان */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{exam.duration_minutes || exam.duration} دقيقة</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{exam.questions || 'متعدد'} سؤال</span>
                </div>
              </div>

              {/* وقت الامتحان */}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">وقت البداية: </span>
                  <span className="text-muted-foreground">{formatDateTime(exam.start_time || exam.startTime)}</span>
                </div>
                <div>
                  <span className="font-medium">وقت النهاية: </span>
                  <span className="text-muted-foreground">{formatDateTime(exam.end_time || exam.endTime)}</span>
                </div>
              </div>

              {/* زر البدء */}
              <Button 
                className="w-full" 
                disabled={!exam.is_active && exam.status !== "active"}
                onClick={() => handleJoinExam(exam.id)}
              >
                {(exam.is_active || exam.status === "active") ? "بدء الامتحان" : 
                 exam.status === "upcoming" ? "سيكون متاحاً قريباً" : "غير متاح"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && !error && filteredExams.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد امتحانات متاحة</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'لا توجد امتحانات تطابق بحثك' : 'لا توجد امتحانات متاحة حالياً'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailableExams;