import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // استخدام دالة signIn من useAuth لتسجيل الدخول
    const { error, userProfile } = await signIn(formData.email, formData.password);

    setLoading(false);

    if (error) {
      if (error.message === 'ACCOUNT_PENDING_APPROVAL') {
        // إذا كان الحساب قيد الموافقة، قم بتوجيهه إلى صفحة الانتظار
        navigate('/teacher-pending-approval');
      }
      // بالنسبة للأخطاء الأخرى، سيتم عرض الرسالة من useAuth
      return;
    }

    if (userProfile) {
      toast.success("تم تسجيل الدخول بنجاح!");
      // توجيه المستخدم بناءً على دوره
      const userRole = userProfile.role || 'student';
      if (userRole === 'admin') {
        window.location.replace('/admin-dashboard');
      } else if (userRole === 'teacher') {
        window.location.replace('/teacher-dashboard');
      } else {
        window.location.replace('/student-dashboard');
      }
    } else {
      // حالة احتياطية إذا لم يتم تحميل الملف الشخصي
      toast.info("تم تسجيل الدخول، ولكن لم نتمكن من تحديد دورك. سيتم توجيهك الآن.");
      window.location.replace('/student-dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">تسجيل الدخول</CardTitle>
          <CardDescription>ادخل إلى حسابك في منصة تفوق</CardDescription>
          <div className="mt-2">
            <Link to="/" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="أدخل كلمة المرور"
                  required
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  تذكرني
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="default"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  إنشاء حساب جديد
                </Link>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
