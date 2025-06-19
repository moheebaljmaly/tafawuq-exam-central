import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Award, User, Settings, LifeBuoy, LogOut, Home, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const StudentDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/logout');
  };

  const navLinks = [
    { to: "/student-dashboard", icon: Home, label: "نظرة عامة" },
    { to: "/student-dashboard/join-exam", icon: LogIn, label: "الانضمام لامتحان" },
    { to: "/student-dashboard/available-exams", icon: BookOpen, label: "الامتحانات المتاحة" },
    { to: "/student-dashboard/completed-exams", icon: Award, label: "الامتحانات المكتملة" },
  ];

  const secondaryNavLinks = [
    { to: "/student-dashboard/profile", icon: User, label: "الملف الشخصي" },
    { to: "/student-dashboard/settings", icon: Settings, label: "الإعدادات" },
    { to: "/student-dashboard/help", icon: LifeBuoy, label: "المساعدة" },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-background text-foreground" dir="rtl">
        <div className="w-64 flex-shrink-0 border-l bg-card">
          <Sidebar navLinks={navLinks} secondaryNavLinks={secondaryNavLinks} />
        </div>
        <div className="flex flex-col flex-1">
          <DashboardHeader userProfile={userProfile} onSignOut={handleSignOut} />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet /> 
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

const Sidebar = ({ navLinks, secondaryNavLinks }) => {
  const location = window.location;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex h-16 items-center justify-center rounded-lg bg-card">
        <GraduationCap className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-primary px-2">تفوق</h1>
      </div>
      <nav className="flex flex-col gap-1 text-base font-medium">
        {navLinks.map((link) => (
          <Tooltip key={link.to}>
            <TooltipTrigger asChild>
              <NavLink
                to={link.to}
                className={cn(
                  "flex items-center gap-4 rounded-lg px-4 py-2.5 transition-colors",
                  isActive(link.to)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-foreground text-background">
              {link.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col gap-1 text-base font-medium">
        {secondaryNavLinks.map((link) => (
          <Tooltip key={link.to}>
            <TooltipTrigger asChild>
              <NavLink
                to={link.to}
                className={cn(
                  "flex items-center gap-4 rounded-lg px-4 py-2.5 transition-colors",
                  isActive(link.to)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-foreground text-background">
              {link.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </div>
  );
}

const DashboardHeader = ({ userProfile, onSignOut }) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
       <h1 className="text-xl font-semibold flex-1">لوحة تحكم الطالب</h1>
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-sm font-medium">{userProfile?.full_name || 'طالب'}</p>
            <p className="text-xs text-muted-foreground">طالب</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
            {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-foreground text-background">
            <p>تسجيل الخروج</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

export default StudentDashboard; 