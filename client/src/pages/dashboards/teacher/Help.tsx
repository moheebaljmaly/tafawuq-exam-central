import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
    {
        question: "كيف يمكنني إنشاء امتحان جديد؟",
        answer: "يمكنك إنشاء امتحان جديد بالانتقال إلى قسم 'إنشاء امتحان جديد' من القائمة الجانبية واتباع الخطوات الموضحة."
    },
    {
        question: "كيف أضيف طلاب إلى فصلي؟",
        answer: "من قسم 'إدارة الطلاب / الفصول'، يمكنك إضافة طلاب جدد بشكل فردي أو استيراد قائمة بالطلاب."
    },
    {
        question: "هل يمكنني إعادة استخدام الأسئلة من امتحانات سابقة؟",
        answer: "نعم، جميع الأسئلة التي تنشئها يتم حفظها في 'بنك الأسئلة' ويمكنك إضافتها بسهولة إلى أي امتحان جديد."
    }
]

const Help = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>مركز المساعدة والدعم</CardTitle>
                <CardDescription>
                    تجد هنا إجابات للأسئلة الأكثر شيوعًا.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold">{item.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    )
}

export default Help; 