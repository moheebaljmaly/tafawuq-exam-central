
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Clock, Mail } from "lucide-react";

const TeacherPendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">في انتظار الموافقة</CardTitle>
          <CardDescription>تم إنشاء حساب المعلم بنجاح</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <GraduationCap className="h-16 w-16 text-primary-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">تم إنشاء حسابك بنجاح!</h3>
              <p className="text-gray-600 leading-relaxed">
                سيتم مراجعة بياناتك من قبل المسؤول للتأكد من صحتها. 
                ستتلقى إشعاراً عبر البريد الإلكتروني عند الموافقة على حسابك.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Mail className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  سيتم إرسال رسالة تأكيد إلى بريدك الإلكتروني عند الموافقة
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                المدة المتوقعة للمراجعة: 24-48 ساعة
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/login">
                تسجيل الدخول لاحقاً
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                العودة للصفحة الرئيسية
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherPendingApproval;
