import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // جلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    setIsLoading(true);
    if (user && userProfile) {
      setUserName(userProfile.full_name || "مستخدم");
      setUserEmail(user.email);
    }
    setIsLoading(false);
  }, [user, userProfile]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error during logout:", error);
      // في حالة فشل تسجيل الخروج، انتقل للصفحة الرئيسية
      window.location.href = "/";
    }
  };

  const handleDashboardClick = () => {
    // التحقق من دور المستخدم
    const userRole = userProfile?.role;
    
    if (userRole === 'teacher') {
      navigate('/teacher-dashboard');
    } else if (userRole === 'student') {
      navigate('/student-dashboard');
    } else if (userRole === 'admin') {
      // المسؤول لديه لوحة تحكم خاصة به
      navigate('/admin-dashboard');
    } else {
      // كحل بديل
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover-scale">
          <GraduationCap className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-primary-700 mr-2">تفوق</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user && !isLoading ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4 ml-1" />
                  <span className="hidden md:inline">{userName || "حسابي"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                {userName && (
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{userName}</p>
                    <p className="text-muted-foreground text-xs mt-1 truncate" dir="ltr">{userEmail}</p>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDashboardClick}>
                  <Settings className="ml-2 h-4 w-4" />
                  <span>لوحة التحكم</span>
                </DropdownMenuItem>
                {userProfile?.role === 'admin' && (
                  <DropdownMenuItem onClick={() => navigate('/admin-dashboard')}>
                    <User className="ml-2 h-4 w-4" />
                    <span>لوحة تحكم المسؤول</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-primary-600">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600">
                  إنشاء حساب
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
