import { useState, useEffect, useCallback } from "react";
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
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Users,
  Eye,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "مجدول";
    if (now >= start && now <= end) return "نشط";
    if (now > end) return "مكتمل";
    return "غير نشط";
}

const getStatusVariant = (status) => {
    switch (status) {
      case "نشط":
        return "success";
      case "مكتمل":
        return "default";
      case "مجدول":
        return "info";
      case "غير نشط":
        return "secondary";
      default:
        return "outline";
    }
};

const ManageExams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examToDelete, setExamToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchExams = useCallback(async () => {
    if(!user) return;
    setLoading(true);
    const { data, error } = await supabase
        .from('exams')
        .select(`
            *,
            exam_questions ( count )
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });
    
    if(error){
        toast.error("فشل في جلب الامتحانات: " + error.message);
    } else {
        setExams(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleDeleteExam = async () => {
    if (!examToDelete) return;

    const { error } = await supabase
        .from('exams')
        .delete()
        .match({ id: examToDelete.id });
    
    if (error) {
        toast.error("فشل حذف الامتحان: " + error.message);
    } else {
        toast.success("تم حذف الامتحان بنجاح.");
        fetchExams(); // Refresh the list
    }
    setExamToDelete(null);
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        toast.success("تم نسخ الكود بنجاح!");
    });
  }

  const displayedExams = exams
    .filter(exam => {
      const status = getStatus(exam.start_time, exam.end_time);
      if (activeTab === 'all') return true;
      if (activeTab === 'active') return status === 'نشط';
      if (activeTab === 'scheduled') return status === 'مجدول';
      if (activeTab === 'completed') return status === 'مكتمل';
      return false;
    })
    .filter((exam) =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exam.subject && exam.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        exam.exam_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderTableRows = (examsToRender) => {
    if (loading) {
      return Array.from({length: 3}).map((_, i) => (
          <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-48" /></TableCell>
              <TableCell><Skeleton className="h-5 w-24" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
              <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
          </TableRow>
      ));
    }
    if (examsToRender.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                    لا توجد امتحانات لعرضها في هذا القسم.
                </TableCell>
            </TableRow>
        );
    }
    return examsToRender.map((exam) => {
        const status = getStatus(exam.start_time, exam.end_time);
        return (
            <TableRow key={exam.id}>
              <TableCell className="font-medium">{exam.title}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(status)}>{status}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {exam.exam_questions[0]?.count || 0}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(exam.start_time).toLocaleString('ar-SA')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(exam.exam_code)}>
                  {exam.exam_code}
                </Button>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-haspopup="true"
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate(`/teacher-dashboard/manage-exams/${exam.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/take-exam/${exam.id}?preview=true`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        معاينة
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/teacher-dashboard/manage-exams/${exam.id}/registrations`)}>
                        <Users className="mr-2 h-4 w-4" />
                        عرض المسجلين
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={() => setExamToDelete(exam)}>
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
        );
    });
  }

  return (
    <>
    <AlertDialog open={!!examToDelete} onOpenChange={() => setExamToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الامتحان وجميع البيانات المرتبطة به بشكل دائم.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExam}>متابعة الحذف</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    <TooltipProvider>
        <div className="flex items-center mb-4">
             <h1 className="text-2xl font-bold">إدارة الامتحانات</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    تصدير
                </span>
                </Button>
                <Button size="sm" className="h-8 gap-1" onClick={() => navigate('/teacher-dashboard/create-exam')}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    إنشاء امتحان
                </span>
                </Button>
            </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="active">نشط</TabsTrigger>
                <TabsTrigger value="scheduled">مجدول</TabsTrigger>
                <TabsTrigger value="completed">مكتمل</TabsTrigger>
            </TabsList>
        </Tabs>

        <Card>
            <CardHeader>
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="ابحث عن امتحان بالاسم, المادة, أو الكود..."
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
                    <TableHead>اسم الامتحان</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="hidden md:table-cell">عدد الأسئلة</TableHead>
                    <TableHead className="hidden md:table-cell">تاريخ البدء</TableHead>
                    <TableHead className="hidden md:table-cell">كود الامتحان</TableHead>
                    <TableHead><span className="sr-only">إجراءات</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderTableRows(displayedExams)}
                </TableBody>
              </Table>
            </CardContent>
        </Card>
    </TooltipProvider>
    </>
  );
};

export default ManageExams; 