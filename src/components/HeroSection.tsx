
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Users, Target } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-right animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              اختبر ذكائك، حقق <span className="text-primary-600">تفوقك</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              تفوق: بوابتك للتميز الأكاديمي. منصة امتحانات إلكترونية متكاملة مصممة لتمكين الطلاب والمعلمين من تحقيق أقصى إمكاناتهم التعليمية. اختبر معلوماتك، تتبع تقدمك، وحقق النجاح بكل سهولة وأمان.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/register">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white group">
                  ابدأ رحلتك التعليمية الآن
                  <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-50">
                تعرف على المزيد
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-secondary-600 ml-2" />
                <span>آمن ومضمون</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-secondary-600 ml-2" />
                <span>للطلاب والمعلمين</span>
              </div>
              <div className="flex items-center">
                <Target className="h-5 w-5 text-secondary-600 ml-2" />
                <span>نتائج فورية</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-lg shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">السؤال 1 من 10</span>
                  <span className="text-sm font-medium text-primary-600">5:30</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">ما هي عاصمة المملكة العربية السعودية؟</h3>
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                    أ) جدة
                  </div>
                  <div className="p-3 bg-primary-100 border border-primary-300 rounded-lg">
                    ب) الرياض
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                    ج) الدمام
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg hover:bg-primary-50 cursor-pointer transition-colors">
                    د) مكة المكرمة
                  </div>
                </div>
                <Button className="w-full bg-secondary-600 hover:bg-secondary-700">
                  السؤال التالي
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
