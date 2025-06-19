import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Settings = () => {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>إعدادات الحساب</CardTitle>
                    <CardDescription>
                        إدارة إعدادات حسابك وتفضيلات الإشعارات.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">الاسم</Label>
                            <Input id="name" placeholder="ادخل اسمك" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input id="email" type="email" placeholder="ادخل بريدك الإلكتروني" />
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button>حفظ التغييرات</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>الإشعارات</CardTitle>
                    <CardDescription>
                        اختر كيف تريد تلقي الإشعارات.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox id="email-notifications" defaultChecked />
                        <label
                            htmlFor="email-notifications"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            إشعارات البريد الإلكتروني
                        </label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox id="push-notifications" />
                        <label
                            htmlFor="push-notifications"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            إشعارات المتصفح
                        </label>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button>حفظ التفضيلات</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>اللغة والمنطقة</CardTitle>
                    <CardDescription>
                        إدارة اللغة والمنطقة الزمنية.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="language">اللغة</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر اللغة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ar">العربية</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button>حفظ</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Settings; 