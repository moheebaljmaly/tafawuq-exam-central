import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentOverview = () => {
  const navigate = useNavigate();

  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['/api/student/stats'],
    queryFn: async () => {
      const response = await fetch('/api/student/stats');
      if (!response.ok) {
        return [
          { title: "الامتحانات المتاحة", value: "0", icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-50" },
          { title: "الامتحانات المكتملة", value: "0", icon: Award, color: "text-green-600", bgColor: "bg-green-50" },
          { title: "الدرجات المعلقة", value: "0", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50" },
          { title: "متوسط الدرجات", value: "0%", icon: TrendingUp, color: "text-purple-600", bgColor: "bg-purple-50" }
        ];
      }
      return response.json();
    }
  });

  const upcomingExams = [
    { id: 1, title: "امتحان الرياضيات", date: "2025-06-25", time: "10:00 ص", status: "متاح" },
    { id: 2, title: "امتحان العلوم", date: "2025-06-28", time: "02:00 م", status: "متاح" },
    { id: 3, title: "امتحان التاريخ", date: "2025-07-01", time: "09:00 ص", status: "قريباً" }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">نظرة عامة</h2>
        <p className="text-muted-foreground">مرحباً بك في لوحة التحكم الخاصة بك</p>
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

      {/* الامتحانات القادمة */}
      <Card>
        <CardHeader>
          <CardTitle>الامتحانات القادمة</CardTitle>
          <CardDescription>الامتحانات المتاحة للطالب</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{exam.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {exam.date} في {exam.time}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={exam.status === "متاح" ? "default" : "secondary"}>
                    {exam.status}
                  </Badge>
                  {exam.status === "متاح" && (
                    <Button 
                      size="sm"
                      onClick={() => navigate('/student-dashboard/available-exams')}
                    >
                      دخول الامتحان
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أزرار سريعة */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الانضمام لامتحان</CardTitle>
            <CardDescription>أدخل رمز الامتحان للانضمام</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => navigate('/student-dashboard/join-exam')}
            >
              الانضمام لامتحان
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>عرض النتائج</CardTitle>
            <CardDescription>مراجعة نتائج الامتحانات السابقة</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/student-dashboard/completed-exams')}
            >
              عرض النتائج
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentOverview;