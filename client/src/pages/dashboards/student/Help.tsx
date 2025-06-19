import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const StudentHelp = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>المساعدة والدعم</CardTitle>
        <CardDescription>
            هل تحتاج إلى مساعدة؟ يمكنك إيجاد الأجوبة هنا.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>سيتم بناء قسم الأسئلة الشائعة ومعلومات التواصل مع الدعم الفني هنا.</p>
      </CardContent>
    </Card>
  );
};

export default StudentHelp; 