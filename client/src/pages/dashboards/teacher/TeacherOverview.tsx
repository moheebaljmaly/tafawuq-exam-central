import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, Clock, Award, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeacherOverview = () => {
  const navigate = useNavigate();

  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['/api/teacher/stats'],
    queryFn: async () => {
      const response = await fetch('/api/teacher/stats');
      if (!response.ok) {
        return [
          { title: "إجمالي الامتحانات", value: "0", icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "الطلاب المسجلين", value: "0", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "الامتحانات النشطة", value: "0", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
          { title: "معدل النجاح", value: "0%", icon: Award, color: "text-purple-600", bgColor: "bg-purple-50" }
        ];
      }
      return response.json();
    }
  });

  const { data: recentExams = [], isLoading: examsLoading } = useQuery({
    queryKey: ['/api/teacher/recent-exams'],
    queryFn: async () => {
      const response = await fetch('/api/teacher/recent-exams');
      if (!response.ok) {
        throw new Error('فشل في جلب الامتحانات الأخيرة');
      }
      return response.json();
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "جاري":
        return <Badge className="bg-green-100 text-green-800">جاري</Badge>;
      case "مكتمل":
        return <Badge variant="secondary">مكتمل</Badge>;
      case "مجدول":
        return <Badge variant="outline">مجدول</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">نظرة عامة</h2>
          <p className="text-muted-foreground">لوحة تحكم المعلم</p>
        </div>
        <Button onClick={() => navigate('/teacher-dashboard/create-exam')}>
          <Plus className="h-4 w-4 ml-2" />
          إنشاء امتحان جديد
        </Button>
      </div>

      {/* الإحصائيات */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* الامتحانات الأخيرة */}
      <Card>
        <CardHeader>
          <CardTitle>الامتحانات الأخيرة</CardTitle>
          <CardDescription>آخر الامتحانات التي قمت بإنشائها</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{exam.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {exam.date} في {exam.time} • {exam.participants} طالب مشارك
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(exam.status)}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/teacher-dashboard/exam-details/${exam.id}`)}
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    عرض
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أزرار سريعة */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>إدارة الامتحانات</CardTitle>
            <CardDescription>عرض وتعديل الامتحانات الحالية</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/teacher-dashboard/manage-exams')}
            >
              إدارة الامتحانات
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>بنك الأسئلة</CardTitle>
            <CardDescription>إضافة وتنظيم الأسئلة</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/teacher-dashboard/question-bank')}
            >
              بنك الأسئلة
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تحليل النتائج</CardTitle>
            <CardDescription>مراجعة وتحليل أداء الطلاب</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/teacher-dashboard/results-analysis')}
            >
              تحليل النتائج
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* إشعارات سريعة */}
      <Card>
        <CardHeader>
          <CardTitle>الإشعارات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">امتحان الرياضيات المتقدمة جاري الآن</p>
                <p className="text-xs text-muted-foreground">45 طالب يؤدون الامتحان حالياً</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">3 طلاب جدد يحتاجون موافقة</p>
                <p className="text-xs text-muted-foreground">مراجعة طلبات الانضمام الجديدة</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherOverview;