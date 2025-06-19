import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  File,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AddQuestionDialog } from "./components/AddQuestionDialog";
import { EditQuestionDialog } from "./components/EditQuestionDialog";
import { ViewQuestionDialog } from "./components/ViewQuestionDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

const getDifficultyVariant = (difficulty) => {
    switch (difficulty) {
      case "easy": return "default";
      case "medium": return "secondary";
      case "hard": return "destructive";
      default: return "outline";
    }
};
const getQuestionTypeText = (type) => {
    switch (type) {
        case "multiple_choice": return "اختيار من متعدد";
        case "essay": return "مقالي";
        case "short_answer": return "إجابة قصيرة";
        default: return type;
    }
}

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const { user } = useAuth();

  const fetchQuestions = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq('teacher_id', user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ في جلب الأسئلة: " + error.message);
    } else {
      setQuestions(data);
    }
    setLoading(false);
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setViewDialogOpen(false);
  }, [user]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;

    const { error } = await supabase
        .from('questions')
        .delete()
        .match({ id: questionToDelete.id });
    
    if (error) {
        toast.error("فشل حذف السؤال: " + error.message);
    } else {
        toast.success("تم حذف السؤال بنجاح.");
        fetchQuestions();
    }
    setQuestionToDelete(null);
  }

  const handleEditClick = (question) => {
    setSelectedQuestion(question);
    setEditDialogOpen(true);
  }

  const handleViewClick = (question) => {
    setSelectedQuestion(question);
    setViewDialogOpen(true);
  }

  const filteredQuestions = questions.filter((question) =>
    question.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (question.subject && question.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <AddQuestionDialog 
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onQuestionAdded={fetchQuestions}
      />
      <EditQuestionDialog
        open={isEditDialogOpen}
        onOpenChange={setEditDialogOpen}
        onQuestionUpdated={fetchQuestions}
        question={selectedQuestion}
      />
      <ViewQuestionDialog
        open={isViewDialogOpen}
        onOpenChange={setViewDialogOpen}
        question={selectedQuestion}
      />
      <AlertDialog open={!!questionToDelete} onOpenChange={() => setQuestionToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
            <AlertDialogDescription>
                هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف السؤال بشكل دائم من قاعدة البيانات.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuestion}>متابعة الحذف</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

     <Card>
       <CardHeader>
         <CardTitle>بنك الأسئلة</CardTitle>
              <div className="flex items-center justify-between pt-4">
                  <div className="relative w-1/2">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ابحث عن سؤال بالنص أو المادة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 w-full"
                      dir="rtl"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <File className="h-3.5 w-3.5 ml-1" />
                        استيراد
                      </Button>
                      <Button size="sm" onClick={() => setAddDialogOpen(true)}>
                        <PlusCircle className="h-3.5 w-3.5 ml-1" />
                        إضافة سؤال جديد
                      </Button>
                  </div>
              </div>
       </CardHeader>
       <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نص السؤال</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>المادة</TableHead>
                  <TableHead>مستوى الصعوبة</TableHead>
                  <TableHead>
                    <span className="sr-only">إجراءات</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                        </TableRow>
                    ))
                ) : filteredQuestions.length > 0 ? (
                  filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium max-w-sm truncate">{question.question_text}</TableCell>
                      <TableCell>{getQuestionTypeText(question.question_type)}</TableCell>
                      <TableCell>
                        {question.subject ? <Badge variant="outline">{question.subject}</Badge> : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getDifficultyVariant(question.difficulty)}>{question.difficulty}</Badge>
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
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(question)}>تعديل</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewClick(question)}>معاينة</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => setQuestionToDelete(question)}>
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-24">
                            لم يتم العثور على أسئلة. ابدأ بإضافة سؤال جديد.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
       </CardContent>
     </Card>
    </>
  );
};

export default QuestionBank; 