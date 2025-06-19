import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Corrected import path
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const CompletedExams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedExams = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('student_exams')
          .select(`
            id,
            status,
            score,
            submitted_at,
            exams (
              id,
              title,
              subject
            )
          `)
          .eq('student_id', user.id)
          .eq('status', 'completed');

        if (error) {
          throw error;
        }

        setExams(data || []);
      } catch (error) {
        console.error('Error fetching completed exams:', error);
        toast.error('حدث خطأ أثناء جلب الامتحانات المكتملة.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedExams();
  }, [user]);

  const handleViewResults = (examId: string) => {
    toast.info('سيتم بناء صفحة عرض النتائج قريبًا.');
    // navigate(`/student-dashboard/results/${examId}`);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mr-4">جاري تحميل الامتحانات...</p>
        </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>الامتحانات المكتملة</CardTitle>
        <CardDescription>هنا قائمة بالامتحانات التي أتممتها.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الامتحان</TableHead>
              <TableHead>المادة</TableHead>
              <TableHead>تاريخ التسليم</TableHead>
              <TableHead>الدرجة</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length > 0 ? (
              exams.map((studentExam) => {
                const exam = studentExam.exams as any;
                if (!exam) return null; // Safety check in case of missing relation data
                
                return (
                  <TableRow key={studentExam.id}>
                    <TableCell className="font-medium">{exam.title}</TableCell>
                    <TableCell>{exam.subject || 'غير محدد'}</TableCell>
                    <TableCell>
                      {studentExam.submitted_at ? new Date(studentExam.submitted_at).toLocaleDateString('ar-EG') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {studentExam.score !== null ? `${studentExam.score}%` : 'قيد التصحيح'}
                    </TableCell>
                    <TableCell className="text-left">
                      <Button 
                        variant="outline"
                        onClick={() => handleViewResults(exam.id)}
                        disabled={studentExam.score === null}
                      >
                        عرض النتائج
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  لم تقم بإكمال أي امتحان بعد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CompletedExams;