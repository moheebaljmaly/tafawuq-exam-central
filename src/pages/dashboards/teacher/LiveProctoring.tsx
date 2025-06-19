import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Video } from "lucide-react";


// Mock Data
const activeStudents = [
    { id: 1, name: "علي حسن", status: "focused", warnings: 0, image: "/avatars/04.png" },
    { id: 2, name: "مريم خالد", status: "warning", warnings: 1, image: "/avatars/05.png" },
    { id: 3, name: "خالد الفيصل", status: "focused", warnings: 0, image: "/avatars/06.png" },
    { id: 4, name: "سارة عبد الله", status: "critical", warnings: 3, image: "/avatars/01.png" },
    { id: 5, name: "نور الدين", status: "focused", warnings: 0, image: "/avatars/02.png" },
];

const getStatusBorder = (status) => {
    switch (status) {
        case "focused":
            return "border-green-500";
        case "warning":
            return "border-yellow-500";
        case "critical":
            return "border-red-500";
        default:
            return "border-gray-200";
    }
}

const LiveProctoring = () => {
  const [selectedExam, setSelectedExam] = useState("EXM002");

  return (
    <div className="space-y-6">
     <Card>
       <CardHeader>
         <CardTitle>مراقبة الامتحانات المباشرة</CardTitle>
          <div className="pt-2">
            <Label htmlFor="active-exam">اختر الامتحان للمراقبة:</Label>
            <Select dir="rtl" value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger id="active-exam" className="w-[300px]">
                <SelectValue placeholder="اختر امتحانًا نشطًا..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXM002">اختبار الفيزياء الحديثة (نشط)</SelectItem>
                <SelectItem value="EXM005">امتحان الأحياء الدقيقة (نشط)</SelectItem>
              </SelectContent>
            </Select>
          </div>
       </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeStudents.map(student => (
            <Card key={student.id} className={`overflow-hidden transition-all hover:shadow-xl border-2 ${getStatusBorder(student.status)}`}>
                <CardHeader className="p-0 relative">
                   <img src={`https://i.pravatar.cc/400?u=${student.id}`} alt={student.name} className="w-full h-48 object-cover" />
                   <div className="absolute top-2 right-2">
                        {student.status === 'focused' && <Badge variant="success">مركز</Badge>}
                        {student.status === 'warning' && <Badge variant="warning">تحذير</Badge>}
                        {student.status === 'critical' && <Badge variant="destructive">خطر</Badge>}
                   </div>
                </CardHeader>
                <CardContent className="p-4">
                    <h3 className="font-bold text-lg">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                </CardContent>
                <CardFooter className="bg-muted p-3 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span>تحذيرات: {student.warnings}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                        <Video className="ml-2 h-4 w-4" />
                        عرض التفاصيل
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveProctoring; 