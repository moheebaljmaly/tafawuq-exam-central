import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// Mock Data
const studentsData = [
    {
      id: "STU001",
      name: "أحمد المصري",
      email: "ahmad.m@example.com",
      class: "الصف العاشر - أ",
      avatar: "/avatars/01.png",
    },
    {
      id: "STU002",
      name: "فاطمة الزهراء",
      email: "fatima.z@example.com",
      class: "الصف العاشر - ب",
      avatar: "/avatars/02.png",
    },
    {
      id: "STU003",
      name: "يوسف شاهين",
      email: "youssef.s@example.com",
      class: "الصف الحادي عشر - أ",
      avatar: "/avatars/03.png",
    },
];

const ManageStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = studentsData.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Tabs defaultValue="students">
      <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="students">إدارة الطلاب</TabsTrigger>
            <TabsTrigger value="classes">إدارة الفصول</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline">
                <Users className="h-3.5 w-3.5 ml-1" />
                إدارة الفصول
            </Button>
            <Button size="sm">
              <PlusCircle className="h-3.5 w-3.5 ml-1" />
              إضافة طالب جديد
            </Button>
          </div>
        </div>
        <TabsContent value="students">
             <Card>
               <CardHeader>
                    <CardTitle>قائمة الطلاب</CardTitle>
                    <div className="relative w-full pt-2">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10 w-full"
                        dir="rtl"
                      />
                    </div>
               </CardHeader>
               <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم الطالب</TableHead>
                        <TableHead>الفصل</TableHead>
                        <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
                        <TableHead>
                          <span className="sr-only">إجراءات</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{student.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.class}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                                <DropdownMenuItem>تعديل</DropdownMenuItem>
                                <DropdownMenuItem>عرض الملف الشخصي</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
        </TabsContent>
        <TabsContent value="classes">
            <Card>
                <CardHeader>
                    <CardTitle>إدارة الفصول الدراسية</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>واجهة إدارة الفصول قيد الإنشاء.</p>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
};

export default ManageStudents; 