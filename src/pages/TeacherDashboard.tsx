
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Plus, 
  Users, 
  FileText, 
  TrendingUp, 
  Settings,
  Search,
  Calendar,
  Clock,
  Award,
  LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const stats = [
    { title: "إجمالي الامتحانات", value: "24", icon: FileText, color: "bg-blue-500" },
    { title: "الطلاب المسجلين", value: "156", icon: Users, color: "bg-green-500" },
    { title: "معدل النجاح", value: "87%", icon: TrendingUp, color: "bg-purple-500" },
    { title: "الامتحانات النشطة", value: "3", icon: Clock, color: "bg-orange-500" }
  ];

  const recentExams = [
    {
      id: 1,
      title: "امتحان الرياضيات - الفصل الأول",
      subject: "رياضيات",
      students: 32,
      status: "نشط",
      date: "2024-01-15",
      code: "MTH001"
    },
    {
      id: 2,
      title: "اختبار الفيزياء التطبيقية",
      subject: "فيزياء",
      students: 28,
      status: "مكتمل",
      date: "2024-01-12",
      code: "PHY002"
    },
    {
      id: 3,
      title: "امتحان الكيمياء العضوية",
      subject: "كيمياء",
      students: 25,
      status: "قريباً",
      date: "2024-01-20",
      code: "CHM003"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary-700 mr-2">تفوق</span>
                <GraduationCap className="h-8 w-8 text-primary-600" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-gray-900">لوحة تحكم المعلم</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">د. أحمد محمد</p>
                <p className="text-xs text-gray-500">معلم رياضيات</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-semibold">أ</span>
              </div>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك، د. أحمد</h2>
          <p className="text-gray-600">إليك نظرة عامة على أنشطتك التعليمية اليوم</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button className="bg-primary-600 hover:bg-primary-700 h-16 text-lg">
            <Plus className="ml-2 h-6 w-6" />
            إنشاء امتحان جديد
          </Button>
          <Button variant="outline" className="h-16 text-lg">
            <Users className="ml-2 h-6 w-6" />
            إدارة الطلاب
          </Button>
          <Button variant="outline" className="h-16 text-lg">
            <TrendingUp className="ml-2 h-6 w-6" />
            التقارير والإحصائيات
          </Button>
          <Button variant="outline" className="h-16 text-lg">
            <Settings className="ml-2 h-6 w-6" />
            الإعدادات
          </Button>
        </div>

        {/* Recent Exams */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">الامتحانات الأخيرة</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="بحث في الامتحانات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">{exam.subject}</span>
                        <span className="text-sm text-gray-500">كود: {exam.code}</span>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 ml-1" />
                          <span className="text-sm text-gray-500">{exam.students} طالب</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={exam.status === 'نشط' ? 'default' : exam.status === 'مكتمل' ? 'secondary' : 'outline'}
                      className={
                        exam.status === 'نشط' ? 'bg-green-100 text-green-800' :
                        exam.status === 'مكتمل' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }
                    >
                      {exam.status}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 ml-1" />
                      {exam.date}
                    </div>
                    <Button variant="ghost" size="sm">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
