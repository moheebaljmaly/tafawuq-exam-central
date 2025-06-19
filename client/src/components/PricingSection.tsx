
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, X } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const plans = [
    {
      name: "مجاني",
      price: "0",
      period: "مدى الحياة",
      description: "مثالي للطلاب والمعلمين المبتدئين",
      features: [
        { name: "5 امتحانات شهرياً", included: true },
        { name: "حتى 20 طالب", included: true },
        { name: "تقارير أساسية", included: true },
        { name: "دعم فني عبر البريد", included: true },
        { name: "تقارير متقدمة", included: false },
        { name: "تحليلات مفصلة", included: false },
        { name: "دعم فني مباشر", included: false }
      ],
      recommended: false
    },
    {
      name: "احترافي",
      price: "99",
      period: "شهرياً",
      description: "للمعلمين والمؤسسات التعليمية",
      features: [
        { name: "امتحانات غير محدودة", included: true },
        { name: "طلاب غير محدود", included: true },
        { name: "تقارير متقدمة", included: true },
        { name: "تحليلات مفصلة", included: true },
        { name: "دعم فني مباشر", included: true },
        { name: "تخصيص كامل", included: true },
        { name: "تصدير البيانات", included: true }
      ],
      recommended: true
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            اختر الباقة المناسبة <span className="text-primary-600">لك</span>
          </h2>
          <p className="text-xl text-gray-600">
            باقات مرنة تناسب جميع الاحتياجات التعليمية
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-xl transition-all duration-300 hover-scale ${
                plan.recommended ? 'border-2 border-primary-600 shadow-lg' : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    الأكثر شيوعاً
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-primary-600">{plan.price}</span>
                  <span className="text-gray-600 mr-2">ريال {plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-end">
                      <span className={`text-right ml-3 ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                      {feature.included ? (
                        <CheckCircle className="h-5 w-5 text-secondary-600" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                    </li>
                  ))}
                </ul>
                
                <Link to="/register" className="block">
                  <Button 
                    className={`w-full ${
                      plan.recommended 
                        ? 'bg-primary-600 hover:bg-primary-700'
                        : 'bg-gray-800 hover:bg-gray-900'
                    }`}
                    size="lg"
                  >
                    {plan.price === "0" ? "ابدأ مجاناً" : "اشترك الآن"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
