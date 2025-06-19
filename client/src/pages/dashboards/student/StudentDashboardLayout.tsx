import { Outlet, Link, useLocation } from 'react-router-dom';
import { Bell, BookOpen, CheckCircle, Award, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const SidebarNavItem = ({ to, icon: Icon, children, isExpanded }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/student-dashboard' && location.pathname.startsWith(to));


  return (
    <Link to={to}>
       <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start items-center gap-4 px-3"
              >
                <Icon className="h-5 w-5" />
                <span className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>{children}</span>
              </Button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right">
              <p>{children}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
};

const StudentDashboardLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Note: Replace with actual user data
  const student = {
    name: 'أحمد',
    avatarUrl: 'https://github.com/shadcn.png', 
  };

  const navItems = [
    { to: '/student-dashboard', icon: BookOpen, label: 'نظرة عامة' },
    { to: '/student-dashboard/available-exams', icon: CheckCircle, label: 'الامتحانات المتاحة' },
    { to: '/student-dashboard/completed-exams', icon: Award, label: 'الامتحانات المكتملة' },
    { to: '/student-dashboard/results', icon: Award, label: 'النتائج' },
    { to: '/student-dashboard/profile', icon: User, label: 'الملف الشخصي' },
    { to: '/student-dashboard/settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-muted/40" dir="rtl">
      <aside className={`flex flex-col border-l transition-all duration-300 ease-in-out bg-background ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
        <div className={`flex h-16 items-center border-b px-6 ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
          <Link to="/" className={`font-bold transition-all ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
            منصة تفوق
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
            {isSidebarExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} to={item.to} icon={item.icon} isExpanded={isSidebarExpanded}>
              {item.label}
            </SidebarNavItem>
          ))}
        </nav>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
           <div></div> {/* This div is for spacing */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span>{student.name}</span>
              <img src={student.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full" />
            </div>
             <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentDashboardLayout; 