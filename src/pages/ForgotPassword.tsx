
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }

    // Mock API call - in real app, this would send reset email
    setTimeout(() => {
      setIsSubmitted(true);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary-700 mr-2">تفوق</span>
              <GraduationCap className="h-8 w-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">تم الإرسال!</CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-secondary-600" />
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-700">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى:
              </p>
              <p className="font-medium text-gray-900" dir="ltr">{email}</p>
            </div>
            
            <p className="text-sm text-gray-600">
              يرجى التحقق من صندوق الوارد الخاص بك وصندوق الرسائل المرفوضة.
              الرابط صالح لمدة 24 ساعة.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setIsSubmitted(false)}
                variant="outline" 
                className="w-full"
              >
                إرسال مرة أخرى
              </Button>
              
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  العودة إلى تسجيل الدخول
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary-700 mr-2">تفوق</span>
            <GraduationCap className="h-8 w-8 text-primary-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">استعادة كلمة المرور</CardTitle>
          <p className="text-gray-600">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
          </p>
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
            
            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" size="lg">
              إرسال رابط إعادة التعيين
            </Button>
            
            <div className="text-center">
              <Link 
                to="/login"
                className="text-primary-600 hover:text-primary-700 text-sm flex items-center justify-center"
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
