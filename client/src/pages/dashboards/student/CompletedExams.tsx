import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Search, FileText, Calendar, Award, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompletedExams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: exams = [], isLoading, error } = useQuery({
    queryKey: ['/api/student/completed-exams'],
    queryFn: async () => {
      const response = await fetch('/api/student/completed-exams');
      if (!response.ok) {
        throw new Error('فشل في جلب الامتحانات المكتملة');
      }
      return response.json();
    }
  });

  const completedExams = [
    {
      id: 1,
      title: "امتحان الرياضيات - نهاية الفصل",
      subject: "الرياضيات",
      completedDate: "2025-06-15",
      score: 85,
      totalScore: 100,
      duration: 120,
      questions: 50,
      grade: "A",
      status: "graded"
    },
    {
      id: 2,
      title: "امتحان الفيزياء التطبيقية",
      subject: "الفيزياء",
      completedDate: "2025-06-10",
      score: 92,
      totalScore: 100,
      duration: 90,
      questions: 40,
      grade: "A+",
      status: "graded"
    },
    {
      id: 3,
      title: "امتحان الكيمياء العضوية",
      subject: "الكيمياء",
      completedDate: "2025-06-08",
      score: 78,
      totalScore: 100,
      duration: 100,
      questions: 45,
      grade: "B+",
      status: "graded"
    },
    {
      id: 4,
      title: "امتحان التاريخ الحديث",
      subject: "التاريخ",
      completedDate: "2025-06-05",
      score: null,
      totalScore: 100,
      duration: 60,
      questions: 30,
      grade: null,
      status: "pending"
    }
  ];

  const filteredExams = completedExams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGradeBadge = (grade: string | null, status: string) => {
    if (status === "pending") {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">قيد التصحيح</Badge>;
    }
    
    if (!grade) return null;
    
    const gradeColors: Record<string, string> = {
      "A+": "bg-green-100 text-green-800",
      "A": "bg-green-100 text-green-800",
      "B+": "bg-blue-100 text-blue-800",
      "B": "bg-blue-100 text-blue-800",
      "C+": "bg-orange-100 text-orange-800",
      "C": "bg-orange-100 text-orange-800",
      "D": "bg-red-100 text-red-800",
      "F": "bg-red-100 text-red-800"
    };

    return <Badge className={gradeColors[grade] || "bg-gray-100 text-gray-800"}>{grade}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الامتحانات المكتملة</h2>
        <p className="text-muted-foreground">مراجعة نتائج امتحاناتك السابقة</p>
      </div>

      {/* شريط البحث */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="البحث في الامتحانات المكتملة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الامتحانات</p>
                <p className="text-2xl font-bold">{completedExams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">متوسط الدرجات</p>
                <p className="text-2xl font-bold">
                  {Math.round(completedExams.filter(e => e.score).reduce((acc, e) => acc + (e.score || 0), 0) / completedExams.filter(e => e.score).length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">مصححة</p>
                <p className="text-2xl font-bold">{completedExams.filter(e => e.status === "graded").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">قيد التصحيح</p>
                <p className="text-2xl font-bold">{completedExams.filter(e => e.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الامتحانات */}
      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{exam.title}</h3>
                      <p className="text-muted-foreground text-sm">{exam.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getGradeBadge(exam.grade, exam.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">تاريخ الامتحان:</span>
                      <p className="font-medium">{formatDate(exam.completedDate)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">المدة:</span>
                      <p className="font-medium">{exam.duration} دقيقة</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">عدد الأسئلة:</span>
                      <p className="font-medium">{exam.questions} سؤال</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">الدرجة:</span>
                      <p className="font-medium">
                        {exam.score !== null ? `${exam.score}/${exam.totalScore}` : "قيد التصحيح"}
                      </p>
                    </div>
                  </div>

                  {exam.status === "graded" && exam.score !== null && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(exam.score / exam.totalScore) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        نسبة النجاح: {Math.round((exam.score / exam.totalScore) * 100)}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="mr-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/student-dashboard/exam-result/${exam.id}`)}
                    disabled={exam.status === "pending"}
                  >
                    <Eye className="h-4 w-4 ml-2" />
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد امتحانات</h3>
            <p className="text-muted-foreground">لا توجد امتحانات مكتملة تطابق بحثك</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompletedExams;