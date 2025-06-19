import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const getStatusTextAndVariant = (status) => {
    switch(status) {
        case 'completed':
            return { text: 'مكتمل', variant: 'success' };
        case 'in_progress':
            return { text: 'قيد التقدم', variant: 'warning' };
        case 'not_started':
            return { text: 'لم يبدأ', variant: 'secondary' };
        default:
            return { text: status, variant: 'outline' };
    }
}

const ExamDetails = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExamDetails = async () => {
            setLoading(true);
            try {
                // Fetch exam info
                const { data: examData, error: examError } = await supabase
                    .from('exams')
                    .select('*')
                    .eq('id', examId)
                    .single();

                if (examError) throw examError;
                setExam(examData);

                // Fetch student registrations for this exam
                const { data: registrationData, error: registrationError } = await supabase
                    .from('exam_registrations')
                    .select(`
                        registered_at,
                        status,
                        score,
                        submitted_at,
                        profiles ( full_name, email )
                    `)
                    .eq('exam_id', examId);
                
                if (registrationError) throw registrationError;
                setRegistrations(registrationData);

            } catch (error) {
                toast.error("فشل في جلب تفاصيل الامتحان: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        if (examId) {
            fetchExamDetails();
        }
    }, [examId]);

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-6 w-80 mb-8" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-48" />
                    </CardHeader>
                    <CardContent>
                       <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (!exam) {
        return <div className="text-center py-10">لم يتم العثور على الامتحان.</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
               <div>
                    <div className="flex items-center gap-4">
                        <Link to="/teacher-dashboard/manage-exams">
                            <Button variant="outline" size="icon">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">{exam.title}</h1>
                    </div>
                    <p className="text-muted-foreground mt-2">{exam.description}</p>
               </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>الطلاب المسجلون ({registrations.length})</CardTitle>
                    <CardDescription>قائمة الطلاب الذين انضموا إلى هذا الامتحان باستخدام الكود.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>اسم الطالب</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead>الدرجة</TableHead>
                                <TableHead>وقت التسليم</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrations.length > 0 ? (
                                registrations.map(reg => {
                                    const {text, variant} = getStatusTextAndVariant(reg.status);
                                    return (
                                        <TableRow key={reg.profiles.email}>
                                            <TableCell className="font-medium">{reg.profiles.full_name || reg.profiles.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={variant}>{text}</Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {reg.status === 'completed' ? `${reg.score?.toFixed(1) || 0}%` : '—'}
                                            </TableCell>
                                            <TableCell>
                                                {reg.submitted_at ? new Date(reg.submitted_at).toLocaleString('ar-SA') : '—'}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center h-24">
                                        لم يقم أي طالب بالتسجيل في هذا الامتحان بعد.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExamDetails; 