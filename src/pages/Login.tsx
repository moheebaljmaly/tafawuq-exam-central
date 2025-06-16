
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    // Mock authentication - in real app, this would be an API call
    if (email === "teacher@example.com" && password === "password") {
      toast.success("تم تسجيل الدخول بنجاح!");
      navigate("/teacher-dashboard");
    } else {
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-700 mr-2">تفوق</span>
            <GraduationCap className="h-8 w-8 text-primary-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">تسجيل الدخول</CardTitle>
          <p className="text-gray-600">أدخل بياناتك للوصول إلى حسابك</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  className="pl-10 text-right"
                  dir="ltr"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">تذكرني</span>
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" size="lg">
              تسجيل الدخول
            </Button>
            
            <div className="text-center">
              <p className="text-gray-600">
                ليس لديك حساب؟{" "}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  سجل الآن
                </Link>
              </p>
            </div>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>للتجربة:</strong> استخدم teacher@example.com / password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
