import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, BookOpen, Clock, TrendingUp, Award, KeyRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Active";
    if (now > end) return "Completed";
    return "Undefined";
}

const getStatusInfo = (status) => {
    switch (status) {
        case "Active":
            return { text: "نشط الآن", className: "bg-green-100 text-green-800" };
        case "Completed":
            return { text: "مكتمل", className: "bg-gray-100 text-gray-800" };
        case "Upcoming":
            return { text: "قادم", className: "bg-blue-100 text-blue-800" };
        default:
            return { text: "غير محدد", className: "bg-yellow-100 text-yellow-800" };
    }
};

const StudentOverview = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [examCode, setExamCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [registeredExams, setRegisteredExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  
  const userName = userProfile?.full_name || "الطالب";
  
  const fetchRegisteredExams = async () => {
    if (!user) return;
    setLoadingExams(true);
    try {
        const { data, error } = await supabase
            .from('student_exams')
            .select(`
                id,
                created_at,
                exams!inner (
                    id,
                    title,
                    description,
                    start_time,
                    end_time,
                    exam_code
                )
            `)
            .eq('student_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        const examsWithStatus = data.map(reg => ({
            ...reg.exams,
            status: getStatus(reg.exams.start_time, reg.exams.end_time),
            registered_at: reg.created_at,
            registrationId: reg.id // This is the registration ID
        }));

        setRegisteredExams(examsWithStatus);

    } catch (error) {
        toast.error("فشل في جلب الامتحانات المسجلة: " + error.message);
    } finally {
        setLoadingExams(false);
    }
  };

  useEffect(() => {
    if(user) {
        fetchRegisteredExams();
    }
  }, [user]);

  const handleJoinExam = async (e) => {
    e.preventDefault();
    if (!examCode.trim() || !user) return;

    setIsJoining(true);
    const formattedCode = examCode.trim().toUpperCase();
    try {
        const { data: exam, error: examError } = await supabase
            .from('exams')
            .select('id, end_time')
            .eq('exam_code', formattedCode)
            .single();

        if (examError || !exam) {
            throw new Error("كود الامتحان غير صالح أو لم يتم العثور عليه.");
        }
        
        if (new Date(exam.end_time) < new Date()) {
            throw new Error("لا يمكن الانضمام، هذا الامتحان قد انتهى بالفعل.");
        }

        const { error: registrationError } = await supabase
            .from('student_exams') // Corrected table name
            .insert({
                exam_id: exam.id,
                student_id: user.id,
            });

        if (registrationError) {
            if(registrationError.code === '23505') {
                throw new Error("أنت مسجل بالفعل في هذا الامتحان.");
            }
            throw registrationError;
        }

        toast.success(`تم الانضمام بنجاح إلى الامتحان!`);
        setExamCode('');
        fetchRegisteredExams();

    } catch (error) {
        toast.error(error.message);
    } finally {
        setIsJoining(false);
    }
  };

  const completedExamsCount = registeredExams.filter(e => e.status === 'Completed').length;
  const activeExamsCount = registeredExams.filter(e => e.status === 'Active' || e.status === 'Upcoming').length;

  return (
    <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك مجدداً، {userName}!</h2>
          <p className="text-gray-600">إليك نظرة عامة على امتحاناتك وأنشطتك.</p>
        </div>

        <Card className="bg-primary-50 border-primary-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyRound className="h-6 w-6 text-primary-700" />
                    الانضمام إلى امتحان
                </CardTitle>
                <CardDescription>أدخل الكود الذي استلمته من معلمك للانضمام إلى الامتحان.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleJoinExam} className="flex flex-col sm:flex-row gap-4">
                    <Input 
                        placeholder="ادخل كود الامتحان هنا..." 
                        className="flex-grow"
                        value={examCode}
                        onChange={(e) => setExamCode(e.target.value)}
                    />
                    <Button type="submit" disabled={isJoining}>
                        {isJoining ? "جاري الانضمام..." : "انضم الآن"}
                    </Button>
                </form>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">الامتحانات القادمة</CardTitle>
                <CardDescription className="text-3xl font-bold text-primary-600">{activeExamsCount}</CardDescription>
              </div>
              <BookOpen className="h-12 w-12 text-blue-500 opacity-20" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">امتحانات مكتملة</CardTitle>
                <CardDescription className="text-3xl font-bold text-green-500">{completedExamsCount}</CardDescription>
              </div>
              <Award className="h-12 w-12 text-green-500 opacity-20" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">متوسط الدرجات</CardTitle>
                <CardDescription className="text-3xl font-bold text-purple-500">N/A</CardDescription>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-500 opacity-20" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">قائمة امتحاناتي</CardTitle>
            <CardDescription>هنا تجد كل الامتحانات التي انضممت إليها.</CardDescription>
          </CardHeader>
          <CardContent>
             {loadingExams ? (
                <div className="text-center py-4">Loading...</div>
             ) : registeredExams.length > 0 ? (
               <div className="space-y-4">
                 {registeredExams.map(exam => {
                    const statusInfo = getStatusInfo(exam.status);
                    return (
                   <div key={exam.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
                     <div className="flex items-center space-x-4 flex-grow mb-4 sm:mb-0">
                       <div className={`p-3 rounded-full ${statusInfo.className}`}>
                         {exam.status === 'Active' ? <Clock className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                       </div>
                       <div>
                         <p className="font-semibold text-gray-900">{exam.title}</p>
                         <p className="text-sm text-gray-600">
                           الحالة: <span className="font-medium">{statusInfo.text}</span>
                         </p>
                       </div>
                     </div>
                     {exam.status === 'Active' && (
                       <Button 
                         variant="default" 
                         size="sm"
                         onClick={() => navigate(`/take-exam/${exam.id}`)}
                       >
                         <GraduationCap className="ml-2 h-4 w-4" />
                         بدء الامتحان
                       </Button>
                     )}
                      {exam.status === 'Completed' && (
                       <Button variant="outline" size="sm" onClick={() => navigate(`/exam-result/${exam.registrationId}`)}>
                         عرض النتيجة
                       </Button>
                     )}
                   </div>
                    )
                 })}
               </div>
             ) : (
                 <div className="text-center py-10 px-4">
                     <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                     <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد امتحانات مسجلة</h3>
                     <p className="mt-1 text-sm text-gray-500">استخدم النموذج أعلاه للانضمام إلى امتحان باستخدام الكود.</p>
                 </div>
             )}
           </CardContent>
        </Card>
    </div>
  );
};

export default StudentOverview; 