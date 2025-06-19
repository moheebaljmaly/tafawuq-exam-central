import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { HelpCircle, MessageCircle, Phone, Mail, Send, Book, AlertCircle } from "lucide-react";

const StudentHelp = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إرسال الرسالة",
      description: "سيتم الرد عليك خلال 24 ساعة"
    });
    setContactForm({ subject: "", message: "", priority: "medium" });
  };

  const faqItems = [
    {
      question: "كيف يمكنني الانضمام إلى امتحان؟",
      answer: "يمكنك الانضمام للامتحان بطريقتين: 1) من خلال قائمة الامتحانات المتاحة في لوحة التحكم، أو 2) باستخدام رمز الامتحان الذي حصلت عليه من المعلم في صفحة 'الانضمام لامتحان'."
    },
    {
      question: "ماذا أفعل إذا انقطع الإنترنت أثناء الامتحان؟",
      answer: "النظام يحفظ إجاباتك تلقائياً كل 30 ثانية. عند عودة الاتصال، سيتم استكمال الامتحان من النقطة التي توقفت عندها. تأكد من الاتصال بالإنترنت قبل انتهاء وقت الامتحان."
    },
    {
      question: "كيف أعرف نتيجة امتحاني؟",
      answer: "ستصلك إشعارات عند صدور النتائج. يمكنك أيضاً مراجعة نتائجك من خلال قسم 'الامتحانات المكتملة' في لوحة التحكم."
    },
    {
      question: "هل يمكنني مراجعة أجوبتي بعد تسليم الامتحان؟",
      answer: "نعم، بعد صدور النتائج، يمكنك مراجعة إجاباتك والإجابات الصحيحة من خلال تفاصيل النتيجة."
    },
    {
      question: "كيف أغير كلمة المرور الخاصة بي؟",
      answer: "اذهب إلى الملف الشخصي، ثم انقر على 'تغيير كلمة المرور' في قسم معلومات الحساب."
    },
    {
      question: "ماذا أفعل إذا لم أتمكن من تسجيل الدخول؟",
      answer: "تأكد من صحة البريد الإلكتروني وكلمة المرور. إذا نسيت كلمة المرور، استخدم خيار 'نسيت كلمة المرور' في صفحة تسجيل الدخول."
    }
  ];

  const contactOptions = [
    {
      title: "الدعم الفني",
      description: "مساعدة في المشاكل التقنية",
      icon: AlertCircle,
      contact: "support@examplatform.sa",
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "الاستفسارات الأكاديمية",
      description: "أسئلة حول الامتحانات والدرجات",
      icon: Book,
      contact: "academic@examplatform.sa",
      color: "text-green-600 bg-green-50"
    },
    {
      title: "الطوارئ",
      description: "للمساعدة العاجلة أثناء الامتحانات",
      icon: Phone,
      contact: "+966 11 123 4567",
      color: "text-red-600 bg-red-50"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">المساعدة والدعم</h2>
        <p className="text-muted-foreground">نحن هنا لمساعدتك في أي وقت</p>
      </div>

      {/* الأسئلة الشائعة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            الأسئلة الشائعة
          </CardTitle>
          <CardDescription>إجابات على الأسئلة الأكثر شيوعاً</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* خيارات التواصل */}
      <Card>
        <CardHeader>
          <CardTitle>طرق التواصل</CardTitle>
          <CardDescription>اختر الطريقة المناسبة للتواصل معنا</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {contactOptions.map((option, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className={`p-2 rounded-lg w-fit mb-3 ${option.color}`}>
                  <option.icon className="h-5 w-5" />
                </div>
                <h4 className="font-medium mb-2">{option.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                <div className="text-sm font-medium">{option.contact}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* نموذج التواصل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            إرسال رسالة
          </CardTitle>
          <CardDescription>تواصل معنا مباشرة وسنرد عليك قريباً</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">موضوع الرسالة</Label>
                <Input
                  id="subject"
                  placeholder="اكتب موضوع رسالتك"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">الأولوية</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={contactForm.priority}
                  onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">منخفضة</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية</option>
                  <option value="urgent">عاجلة</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">الرسالة</Label>
              <Textarea
                id="message"
                placeholder="اكتب رسالتك بالتفصيل..."
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                rows={5}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 ml-2" />
              إرسال الرسالة
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* أوقات الدعم */}
      <Card>
        <CardHeader>
          <CardTitle>أوقات الدعم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">الدعم الفني</h4>
              <p className="text-sm text-muted-foreground">الأحد - الخميس: 8:00 ص - 6:00 م</p>
              <p className="text-sm text-muted-foreground">الجمعة - السبت: 10:00 ص - 4:00 م</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">الطوارئ</h4>
              <p className="text-sm text-muted-foreground">متاح 24/7 أثناء فترات الامتحانات</p>
              <Badge variant="outline" className="mt-1">دعم مستمر</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نصائح مفيدة */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح مفيدة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              تأكد من استقرار اتصال الإنترنت قبل بدء أي امتحان
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              استخدم متصفح حديث (Chrome، Firefox، Safari)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              أغلق جميع التطبيقات الأخرى لضمان الأداء الأمثل
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              احفظ إجاباتك بانتظام باستخدام زر الحفظ
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              راجع جميع الأسئلة قبل التسليم النهائي
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentHelp;