import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const StudentProfile = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الملف الشخصي</CardTitle>
        <CardDescription>
          سيتم بناء واجهة تعديل الملف الشخصي للطالب هنا قريبًا.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>محتوى الملف الشخصي سيظهر هنا.</p>
      </CardContent>
    </Card>
  );
};

export default StudentProfile; 