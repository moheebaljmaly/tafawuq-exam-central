
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GraduationCap, User, Mail, Lock, UserCheck } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    agreeToTerms: false
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    
    if (!formData.agreeToTerms) {
      toast.error("يجب الموافقة على شروط الاستخدام");
      return;
    }

    // Mock registration - in real app, this would be an API call
    toast.success("تم إنشاء حسابك بنجاح! مرحباً بك في تفوق");
    navigate("/login");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-700 mr-2">تفوق</span>
            <GraduationCap className="h-8 w-8 text-primary-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">إنشاء حساب جديد</CardTitle>
          <p className="text-gray-600">انضم إلى منصة تفوق وابدأ رحلتك التعليمية</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-right block">الاسم الكامل</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="pl-10 text-right"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
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
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="أعد إدخال كلمة المرور"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-right block">نوع الحساب</Label>
              <RadioGroup 
                value={formData.role} 
                onValueChange={(value) => handleInputChange("role", value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <Label htmlFor="student" className="flex-1 text-right cursor-pointer">طالب</Label>
                  <RadioGroupItem value="student" id="student" />
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <Label htmlFor="teacher" className="flex-1 text-right cursor-pointer">معلم</Label>
                  <RadioGroupItem value="teacher" id="teacher" />
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                أوافق على{" "}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  شروط الاستخدام
                </Link>
                {" "}و{" "}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  سياسة الخصوصية
                </Link>
              </Label>
            </div>
            
            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" size="lg">
              إنشاء حساب
            </Button>
            
            <div className="text-center">
              <p className="text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
