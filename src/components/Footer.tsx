
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-right">
            <div className="flex items-center justify-end mb-4">
              <span className="text-2xl font-bold mr-2">تفوق</span>
              <GraduationCap className="h-8 w-8 text-primary-400" />
            </div>
            <p className="text-gray-400 leading-relaxed">
              منصة امتحانات إلكترونية متكاملة تهدف إلى تمكين الطلاب والمعلمين من تحقيق أقصى إمكاناتهم التعليمية.
            </p>
          </div>
          
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">من نحن</Link></li>
              <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">الميزات</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">الأسعار</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>
          
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-4">الدعم</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">مركز المساعدة</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">شروط الاستخدام</Link></li>
            </ul>
          </div>
          
          <div className="text-right">
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-end">
                <span className="text-gray-400 mr-3">info@tafawuq.com</span>
                <Mail className="h-5 w-5 text-primary-400" />
              </div>
              <div className="flex items-center justify-end">
                <span className="text-gray-400 mr-3">+966 50 123 4567</span>
                <Phone className="h-5 w-5 text-primary-400" />
              </div>
              <div className="flex items-center justify-end">
                <span className="text-gray-400 mr-3">الرياض، السعودية</span>
                <MapPin className="h-5 w-5 text-primary-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 منصة تفوق. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
