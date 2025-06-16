
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if teacher account is pending approval
  if (userProfile?.role === 'teacher' && !userProfile?.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <AlertCircle className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">حساب في انتظار الموافقة</CardTitle>
            <CardDescription>لم يتم الموافقة على حساب المعلم بعد</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              حسابك كمعلم لا يزال قيد المراجعة من قبل المسؤول. 
              يرجى انتظار الموافقة قبل الوصول إلى لوحة التحكم.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role requirements
  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
