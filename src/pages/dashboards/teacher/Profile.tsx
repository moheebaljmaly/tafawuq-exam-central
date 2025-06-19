import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
    const { userProfile } = useAuth();

    if (!userProfile) {
        return <div>جاري تحميل الملف الشخصي...</div>;
    }

     return (
        <div className="grid gap-6">
         <Card>
             <CardHeader>
                 <CardTitle>الملف الشخصي</CardTitle>
                    <CardDescription>عرض وتحديث معلومات ملفك الشخصي.</CardDescription>
             </CardHeader>
             <CardContent>
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="/avatars/01.png" alt={userProfile?.full_name} />
                            <AvatarFallback className="text-3xl">
                                {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'T'}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="outline">تغيير الصورة</Button>
                    </div>
                    <form className="grid gap-4 mt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name">الاسم الكامل</Label>
                                <Input id="full-name" defaultValue={userProfile?.full_name || ''} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input id="email" type="email" readOnly disabled defaultValue={userProfile?.email || ''} />
                            </div>
                        </div>
                        <Button>حفظ التغييرات</Button>
                    </form>
             </CardContent>
         </Card>
             <Card>
                <CardHeader>
                    <CardTitle>تغيير كلمة المرور</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                            <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                            <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                            <Input id="confirm-password" type="password" />
                        </div>
                         <Button>تحديث كلمة المرور</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Profile; 