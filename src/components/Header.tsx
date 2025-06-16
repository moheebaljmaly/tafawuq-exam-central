
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover-scale">
          <GraduationCap className="h-8 w-8 text-primary-600" />
          <span className="text-2xl font-bold text-primary-700 mr-2">تفوق</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-primary-600">
              تسجيل الدخول
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white">
              التسجيل
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
