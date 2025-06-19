import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, TrendingUp, Clock, Bell, GitBranch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TeacherOverview = () => {
    // Mock data
  const stats = [
    { title: "الامتحانات النشطة", value: "3", icon: Clock, color: "text-orange-500", bgColor: "bg-orange-100" },
    { title: "الامتحانات المجدولة", value: "5", icon: FileText, color: "text-blue-500", bgColor: "bg-blue-100" },
    { title: "الطلاب المسجلين", value: "156", icon: Users, color: "text-green-500", bgColor: "bg-green-100" },
    { title: "النتائج المعلقة", value: "2", icon: TrendingUp, color: "text-purple-500", bgColor: "bg-purple-100" },
  ];

  const notifications = [
    { id: 1, text: "قام الطالب 'أحمد محمود' بتقديم امتحان الرياضيات.", time: "قبل 5 دقائق", icon: GitBranch },
    { id: 2, text: "تم إنشاء امتحان 'الفيزياء النووية' بنجاح.", time: "قبل ساعة", icon: FileText },
    { id: 3, text: "تنبيه: تبقى 24 ساعة على بدء امتحان الكيمياء.", time: "قبل 3 ساعات", icon: Bell },
  ];

  const recentResults = [
    { exam: "امتحان الرياضيات", class: "الصف العاشر", average: "85%", date: "2024-05-20" },
    { exam: "اختبار الفيزياء", class: "الصف العاشر", average: "78%", date: "2024-05-18" },
    { exam: "امتحان الأحياء", class: "الصف الحادي عشر", average: "91%", date: "2024-05-17" },
  ];


  return (
    <div className="space-y-6">
       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <span>إشعارات وتنبيهات</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notifications.map(item => (
                        <div key={item.id} className="flex items-start gap-3">
                           <div className="bg-muted p-2 rounded-full">
                             <item.icon className="h-5 w-5 text-muted-foreground" />
                           </div>
                           <div>
                            <p className="text-sm font-medium">{item.text}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                           </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Recent Results */}
        <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>أحدث النتائج</span>
                </CardTitle>
                <Button variant="outline">عرض كل النتائج</Button>
              </div>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الامتحان</TableHead>
                      <TableHead>الفصل</TableHead>
                      <TableHead>متوسط الدرجات</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الإجراء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentResults.map((result, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{result.exam}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{result.class}</Badge>
                            </TableCell>
                            <TableCell>{result.average}</TableCell>
                            <TableCell>{result.date}</TableCell>
                            <TableCell>
                                <Button variant="link" className="p-0 h-auto">تحليل</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default TeacherOverview; 