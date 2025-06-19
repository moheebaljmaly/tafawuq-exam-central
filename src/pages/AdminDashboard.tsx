import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

interface PendingTeacher {
  id: string;
  full_name: string;
  email: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'pending_teacher';
}

const AdminDashboard = () => {
  const { user: adminUser } = useAuth();
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_pending_teachers');

      if (error) {
        throw error;
      }
      if (data) {
        setPendingTeachers(data);
      }
    } catch (error: any) {
      toast.error("فشل جلب المعلمين قيد الانتظار: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users_with_details');
      if (error) throw error;
      if (data) setUsers(data);
    } catch (error: any) {
      toast.error("فشل جلب المستخدمين: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTeachers();
    fetchAllUsers();
  }, []);

  const handleApproveTeacher = async (teacherId: string) => {
    try {
      const { error } = await supabase.rpc('approve_teacher', {
        user_id_to_approve: teacherId
      });

      if (error) {
        throw error;
      }

      toast.success("تمت الموافقة على المعلم بنجاح!");
      fetchPendingTeachers();
    } catch (error: any) {
      toast.error("فشلت عملية الموافقة: " + error.message);
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      const { error } = await supabase.rpc('update_user_role', { user_id_to_update: userId, new_role: newRole });
      if (error) throw error;
      toast.success("تم تحديث دور المستخدم بنجاح!");
      fetchAllUsers(); // Refresh the list
    } catch (error: any) {
      toast.error("فشل تحديث الدور: " + error.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('delete_user_by_admin', { user_id_to_delete: userId });
      if (error) throw error;
      toast.success("تم حذف المستخدم بنجاح!");
      fetchAllUsers(); // Refresh the list
    } catch (error: any) {
      toast.error("فشل حذف المستخدم: " + error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">لوحة تحكم المسؤول</h1>
          <p className="text-gray-500">إدارة شاملة للمنصة</p>
        </div>

        <Tabs defaultValue="approve-teachers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approve-teachers">موافقة المعلمين</TabsTrigger>
            <TabsTrigger value="manage-users">إدارة المستخدمين</TabsTrigger>
          </TabsList>

          <TabsContent value="approve-teachers">
            <Card>
              <CardHeader>
                <CardTitle>المعلمون قيد الانتظار</CardTitle>
                <CardDescription>مراجعة والموافقة على حسابات المعلمين الجدد</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>جاري تحميل قائمة المعلمين...</p>
                ) : pendingTeachers.length === 0 ? (
                  <p>لا يوجد معلمون في انتظار الموافقة حاليًا.</p>
                ) : (
                  <ul className="space-y-4">
                    {pendingTeachers.map((teacher) => (
                      <li key={teacher.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{teacher.full_name}</p>
                          <p className="text-sm text-gray-500">{teacher.email}</p>
                        </div>
                        <Button onClick={() => handleApproveTeacher(teacher.id)}>
                          موافقة
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-users">
            <Card>
              <CardHeader>
                <CardTitle>إدارة جميع المستخدمين</CardTitle>
                <CardDescription>تعديل الأدوار أو حذف المستخدمين من المنصة</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم الكامل</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الدور الحالي</TableHead>
                      <TableHead>تغيير الدور</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={user.role}
                            onValueChange={(newRole) => handleRoleChange(user.id, newRole as User['role'])}
                            disabled={user.id === adminUser?.id} // Disable changing own role
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">طالب</SelectItem>
                              <SelectItem value="teacher">معلم</SelectItem>
                              <SelectItem value="admin">مسؤول</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" disabled={user.id === adminUser?.id}>حذف</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف حساب المستخدم بشكل دائم.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                  نعم، قم بالحذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard; 