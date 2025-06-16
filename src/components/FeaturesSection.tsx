
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users2, TrendingUp, Shield, Clock, Award } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "للطلاب",
      items: [
        {
          icon: BookOpen,
          title: "اختبارات تفاعلية",
          description: "امتحانات متنوعة وتفاعلية تناسب جميع المستويات"
        },
        {
          icon: TrendingUp,
          title: "تتبع التقدم",
          description: "راقب أداءك وتقدمك عبر تقارير مفصلة"
        },
        {
          icon: Award,
          title: "شهادات إنجاز",
          description: "احصل على شهادات معتمدة لكل امتحان تجتازه"
        }
      ]
    },
    {
      title: "للمعلمين",
      items: [
        {
          icon: Users2,
          title: "إدارة الطلاب",
          description: "أدر طلابك وتتبع أداءهم بسهولة تامة"
        },
        {
          icon: Clock,
          title: "إنشاء سريع",
          description: "أنشئ امتحانات مخصصة في دقائق معدودة"
        },
        {
          icon: Shield,
          title: "أمان متقدم",
          description: "حماية فائقة للامتحانات ومنع الغش"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            لماذا تختار <span className="text-primary-600">تفوق</span>؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            منصة شاملة تلبي احتياجات الطلاب والمعلمين معاً، مع أحدث التقنيات والأدوات التعليمية
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8 border-b-2 border-primary-200 pb-4">
                {category.title}
              </h3>
              <div className="space-y-6">
                {category.items.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300 hover-scale">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-right">
                        <feature.icon className="h-6 w-6 text-primary-600 ml-3" />
                        <span className="text-lg">{feature.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-right leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
