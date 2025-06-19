import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Shield, Palette, Globe, Download } from "lucide-react";

const StudentSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      examReminders: true,
      gradeUpdates: true,
      systemUpdates: false,
      emailNotifications: true
    },
    privacy: {
      shareProgress: false,
      publicProfile: false
    },
    preferences: {
      language: "ar",
      theme: "light",
      timezone: "Asia/Riyadh"
    }
  });

  const handleSwitchChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSelectChange = (category: string, setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الإعدادات بنجاح"
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الإعدادات</h2>
        <p className="text-muted-foreground">تخصيص تجربتك في المنصة</p>
      </div>

      {/* إعدادات الإشعارات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            الإشعارات
          </CardTitle>
          <CardDescription>إدارة الإشعارات والتنبيهات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="exam-reminders" className="text-sm font-medium">
                تذكير الامتحانات
              </Label>
              <p className="text-sm text-muted-foreground">
                تلقي تنبيهات قبل موعد الامتحانات
              </p>
            </div>
            <Switch
              id="exam-reminders"
              checked={settings.notifications.examReminders}
              onCheckedChange={(value) => handleSwitchChange("notifications", "examReminders", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="grade-updates" className="text-sm font-medium">
                تحديثات الدرجات
              </Label>
              <p className="text-sm text-muted-foreground">
                إشعار عند صدور نتائج الامتحانات
              </p>
            </div>
            <Switch
              id="grade-updates"
              checked={settings.notifications.gradeUpdates}
              onCheckedChange={(value) => handleSwitchChange("notifications", "gradeUpdates", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system-updates" className="text-sm font-medium">
                تحديثات النظام
              </Label>
              <p className="text-sm text-muted-foreground">
                إشعارات حول تحديثات وصيانة المنصة
              </p>
            </div>
            <Switch
              id="system-updates"
              checked={settings.notifications.systemUpdates}
              onCheckedChange={(value) => handleSwitchChange("notifications", "systemUpdates", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-sm font-medium">
                الإشعارات عبر البريد الإلكتروني
              </Label>
              <p className="text-sm text-muted-foreground">
                إرسال الإشعارات إلى بريدك الإلكتروني
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.notifications.emailNotifications}
              onCheckedChange={(value) => handleSwitchChange("notifications", "emailNotifications", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* إعدادات الخصوصية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            الخصوصية والأمان
          </CardTitle>
          <CardDescription>إعدادات الخصوصية وحماية البيانات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-progress" className="text-sm font-medium">
                مشاركة التقدم الأكاديمي
              </Label>
              <p className="text-sm text-muted-foreground">
                السماح للمعلمين برؤية تقدمك
              </p>
            </div>
            <Switch
              id="share-progress"
              checked={settings.privacy.shareProgress}
              onCheckedChange={(value) => handleSwitchChange("privacy", "shareProgress", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public-profile" className="text-sm font-medium">
                الملف الشخصي العام
              </Label>
              <p className="text-sm text-muted-foreground">
                إظهار ملفك الشخصي للطلاب الآخرين
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={settings.privacy.publicProfile}
              onCheckedChange={(value) => handleSwitchChange("privacy", "publicProfile", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* التفضيلات العامة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            التفضيلات العامة
          </CardTitle>
          <CardDescription>تخصيص واجهة المنصة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                اللغة
              </Label>
              <Select
                value={settings.preferences.language}
                onValueChange={(value) => handleSelectChange("preferences", "language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>المظهر</Label>
              <Select
                value={settings.preferences.theme}
                onValueChange={(value) => handleSelectChange("preferences", "theme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">فاتح</SelectItem>
                  <SelectItem value="dark">داكن</SelectItem>
                  <SelectItem value="system">نظام التشغيل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>المنطقة الزمنية</Label>
              <Select
                value={settings.preferences.timezone}
                onValueChange={(value) => handleSelectChange("preferences", "timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                  <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                  <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تصدير البيانات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تصدير البيانات
          </CardTitle>
          <CardDescription>تحميل نسخة من بياناتك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">تصدير سجل الامتحانات</h4>
              <p className="text-sm text-muted-foreground">
                تحميل ملف Excel يحتوي على جميع نتائج امتحاناتك
              </p>
            </div>
            <Button variant="outline">
              تحميل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* حفظ الإعدادات */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          حفظ جميع الإعدادات
        </Button>
      </div>
    </div>
  );
};

export default StudentSettings;