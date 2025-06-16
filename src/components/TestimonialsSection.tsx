
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "أحمد محمد",
      role: "طالب جامعي",
      content: "منصة تفوق غيرت طريقة دراستي تماماً. الاختبارات التفاعلية والتقارير المفصلة ساعدتني في تحسين أدائي بشكل ملحوظ.",
      rating: 5,
      avatar: "👨‍🎓"
    },
    {
      name: "فاطمة الأحمد",
      role: "معلمة رياضيات",
      content: "أستطيع الآن إنشاء امتحانات مخصصة لطلابي في دقائق معدودة، وتتبع تقدمهم بطريقة احترافية. منصة رائعة!",
      rating: 5,
      avatar: "👩‍🏫"
    },
    {
      name: "خالد العلي",
      role: "طالب ثانوية",
      content: "التصميم البسيط والواضح يجعل التركيز على الاختبار أسهل بكثير. النتائج الفورية تساعدني في معرفة نقاط ضعفي.",
      rating: 5,
      avatar: "👨‍💼"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ماذا يقول <span className="text-primary-600">مستخدمونا</span>؟
          </h2>
          <p className="text-xl text-gray-600">
            آراء وتجارب حقيقية من طلاب ومعلمين استخدموا منصة تفوق
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-right">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-end">
                  <div className="text-right ml-3">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                  <div className="text-3xl">{testimonial.avatar}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
