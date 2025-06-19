import {
  Bell,
  BookOpen,
  FilePlus2,
  Home,
  LifeBuoy,
  ListChecks,
  Monitor,
  PieChart,
  Settings,
  User,
  Users,
  LogOut,
  GraduationCap
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const TeacherDashboard = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/logout');
  };

  const navLinks = [
    { to: "/teacher-dashboard", icon: Home, label: "نظرة عامة" },
    { to: "/teacher-dashboard/create-exam", icon: FilePlus2, label: "إنشاء امتحان جديد" },
    { to: "/teacher-dashboard/manage-exams", icon: ListChecks, label: "إدارة الامتحانات" },
    { to: "/teacher-dashboard/question-bank", icon: BookOpen, label: "بنك الأسئلة" },
    { to: "/teacher-dashboard/manage-students", icon: Users, label: "إدارة الطلاب / الفصول" },
    { to: "/teacher-dashboard/live-proctoring", icon: Monitor, label: "مراقبة الامتحانات" },
    { to: "/teacher-dashboard/results-analysis", icon: PieChart, label: "تحليل النتائج" },
  ];

  const secondaryNavLinks = [
    { to: "/teacher-dashboard/profile", icon: User, label: "الملف الشخصي" },
    { to: "/teacher-dashboard/settings", icon: Settings, label: "الإعدادات" },
    { to: "/teacher-dashboard/help", icon: LifeBuoy, label: "المساعدة" },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen w-full bg-background text-foreground" dir="rtl">
        <ResizablePanelGroup direction="horizontal" className="h-full max-w-full rounded-lg border">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="!overflow-y-auto">
            <Sidebar navLinks={navLinks} secondaryNavLinks={secondaryNavLinks} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} className="!overflow-y-auto">
            <div className="flex flex-col h-full">
              <DashboardHeader userProfile={userProfile} onSignOut={handleSignOut} />
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  );
};

const Sidebar = ({ navLinks, secondaryNavLinks }) => {
  const location = useLocation();

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
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'teacher-dashboard': return 'لوحة تحكم المعلم';
      case 'overview': return 'نظرة عامة';
      case 'create-exam': return 'إنشاء امتحان جديد';
      case 'manage-exams': return 'إدارة الامتحانات';
      case 'question-bank': return 'بنك الأسئلة';
      case 'manage-students': return 'إدارة الطلاب / الفصول';
      case 'live-proctoring': return 'مراقبة الامتحانات';
      case 'results-analysis': return 'تحليل النتائج';
      case 'profile': return 'الملف الشخصي';
      case 'settings': return 'الإعدادات';
      case 'help': return 'المساعدة';
      default: return getPageTitleFromPath(path);
    }
  };

  const getPageTitleFromPath = (path) => {
    const segments = path.split('/').filter(Boolean); // Filter out empty strings
    if (segments.length > 1) {
        const lastSegment = segments[segments.length - 1];
        // Convert kebab-case or snake_case to Title Case
        return lastSegment.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    }
    return 'لوحة تحكم المعلم'; // Default title
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
      <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </Button>
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="text-sm font-medium">{userProfile?.full_name || 'معلم'}</p>
            <p className="text-xs text-muted-foreground">معلم</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
            {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'T'}
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

export default TeacherDashboard;
