import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AvailableExams = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingExamId, setStartingExamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableExams = async () => {
      if (!user || !userProfile) return;

      try {
        setLoading(true);
        console.log('Fetching available exams for student:', userProfile.id);
        
        const { data, error } = await supabase
          .from('exam_attempts')
          .select(`
            id,
            status,
            exam_id,
            exams (
              id,
              title,
              subject,
              start_time,
              end_time,
              exam_code
            )
          `)
          .eq('student_id', userProfile.id)
          .in('status', ['registered', 'in-progress']);

        if (error) {
          console.error('Error fetching exams:', error);
          throw error;
        }

        console.log('Raw exam registrations data:', data);

        const now = new Date();
        const available = data.filter(reg => {
            const exam = reg.exams as any;
            if (!exam) {
                console.log('Filtering out registration with no exam data:', reg);
                return false;
            }
            const startDate = new Date(exam.start_time);
            const endDate = new Date(exam.end_time);
            const isAvailable = now >= startDate && now <= endDate;
            console.log(`Exam ${exam.title} (${exam.id}): Start=${startDate.toLocaleString()}, End=${endDate.toLocaleString()}, Available=${isAvailable}`);
            return isAvailable;
        });

        console.log('Available exams after filtering:', available);
        setExams(available);
      } catch (error) {
        console.error('Error fetching available exams:', error);
        toast.error('حدث خطأ أثناء جلب الامتحانات المتاحة: ' + (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableExams();
  }, [user, userProfile]);

  const handleStartExam = async (studentExam: any) => {
    setStartingExamId(studentExam.id);
    try {
      console.log('Starting exam:', studentExam);
      
      if (studentExam.status !== 'in-progress') {
        console.log('Updating exam status to in-progress');
        const { error } = await supabase
          .from('exam_attempts')
          .update({ status: 'in-progress', started_at: new Date().toISOString() })
          .eq('id', studentExam.id);
        
        if (error) {
          console.error('Error updating exam status:', error);
          throw error;
        }
      }
      
      console.log('Navigating to exam page:', studentExam.exams.id);
      navigate(`/take-exam/${studentExam.exams.id}`);
    } catch (error) {
      console.error('Error starting exam:', error);
      toast.error("فشل في بدء الامتحان: " + (error as Error).message);
    } finally {
      setStartingExamId(null);
    }
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
        <CardTitle>الامتحانات المتاحة</CardTitle>
        <CardDescription>هنا قائمة بالامتحانات التي يمكنك بدؤها الآن.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الامتحان</TableHead>
              <TableHead>المادة</TableHead>
              <TableHead>المدة (دقائق)</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.length > 0 ? (
              exams.map((studentExam) => {
                const exam = studentExam.exams as any;
                if (!exam) return null; // Safety check
                return (
                    <TableRow key={studentExam.id}>
                        <TableCell className="font-medium">{exam.title}</TableCell>
                        <TableCell>{exam.subject || 'غير محدد'}</TableCell>
                        <TableCell>{exam.duration}</TableCell>
                        <TableCell>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            متاح
                            </span>
                        </TableCell>
                        <TableCell className="text-left">
                            <Button 
                                onClick={() => handleStartExam(studentExam)}
                                disabled={loading || startingExamId === studentExam.id}
                            >
                                {startingExamId === studentExam.id 
                                    ? <Loader2 className="h-4 w-4 animate-spin" /> 
                                    : (studentExam.status === 'in-progress' ? "متابعة الامتحان" : "بدء الامتحان")}
                            </Button>
                        </TableCell>
                    </TableRow>
                )
            })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  لا توجد امتحانات متاحة حاليًا.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AvailableExams;