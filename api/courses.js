export default function handler(req, res) {
    // نفس الكورسات الـ 36 اللي عملناها
    const courses = [
        { id: "basics-0", title: "مقدمة الأمن السيبراني", level: "مبتدئ", desc: "المفاهيم الأساسية والتهديدات ومبادئ الحماية.", pathId: "basics" },
        { id: "basics-1", title: "إدارة الهوية وكلمات المرور", level: "مبتدئ", desc: "المفاهيم الأساسية والتهديدات ومبادئ الحماية.", pathId: "basics" },
        { id: "basics-2", title: "الخصوصية والأمان الرقمي", level: "مبتدئ", desc: "المفاهيم الأساسية والتهديدات ومبادئ الحماية.", pathId: "basics" },
        { id: "network-0", title: "أساسيات الشبكات", level: "مبتدئ — متوسط", desc: "تعلم الشبكات والبروتوكولات ومبادئ الدفاع.", pathId: "network" },
        { id: "network-1", title: "TCP/IP وDNS وHTTP", level: "مبتدئ — متوسط", desc: "تعلم الشبكات والبروتوكولات ومبادئ الدفاع.", pathId: "network" },
        { id: "network-2", title: "الجدران النارية ومراقبة الشبكات", level: "مبتدئ — متوسط", desc: "تعلم الشبكات والبروتوكولات ومبادئ الدفاع.", pathId: "network" },
        { id: "web-0", title: "أساسيات HTTP وواجهات API", level: "متوسط", desc: "فهم جلسات الدخول والتحقق من المدخلات والثغرات الشائعة.", pathId: "web" },
        { id: "web-1", title: "التحقق من المدخلات", level: "متوسط", desc: "فهم جلسات الدخول والتحقق من المدخلات والثغرات الشائعة.", pathId: "web" },
        { id: "web-2", title: "مقدمة OWASP Top 10", level: "متوسط", desc: "فهم جلسات الدخول والتحقق من المدخلات والثغرات الشائعة.", pathId: "web" },
        { id: "ethical-0", title: "قواعد الاختبار المصرح", level: "متوسط", desc: "منهجية اختبار مصرح بها وتوثيق النتائج وإصلاحها.", pathId: "ethical" },
        { id: "ethical-1", title: "جمع المعلومات بشكل قانوني", level: "متوسط", desc: "منهجية اختبار مصرح بها وتوثيق النتائج وإصلاحها.", pathId: "ethical" },
        { id: "ethical-2", title: "كتابة تقرير الثغرات", level: "متوسط", desc: "منهجية اختبار مصرح بها وتوثيق النتائج وإصلاحها.", pathId: "ethical" },
        { id: "defense-0", title: "مقدمة SOC", level: "متوسط", desc: "مراقبة الأحداث وتحليل السجلات والاستجابة للحوادث.", pathId: "defense" },
        { id: "defense-1", title: "قراءة سجلات الأنظمة", level: "متوسط", desc: "مراقبة الأحداث وتحليل السجلات والاستجابة للحوادث.", pathId: "defense" },
        { id: "defense-2", title: "الاستجابة للحوادث", level: "متوسط", desc: "مراقبة الأحداث وتحليل السجلات والاستجابة للحوادث.", pathId: "defense" },
        { id: "crypto-0", title: "مفاهيم التشفير", level: "متوسط", desc: "التشفير والهاش والتوقيعات وإدارة المفاتيح.", pathId: "crypto" },
        { id: "crypto-1", title: "Hashing وDigital Signatures", level: "متوسط", desc: "التشفير والهاش والتوقيعات وإدارة المفاتيح.", pathId: "crypto" },
        { id: "crypto-2", title: "إدارة المفاتيح", level: "متوسط", desc: "التشفير والهاش والتوقيعات وإدارة المفاتيح.", pathId: "crypto" },
        { id: "forensics-0", title: "مبادئ الأدلة الرقمية", level: "متوسط", desc: "جمع الأدلة الرقمية وفهم الخط الزمني للحوادث.", pathId: "forensics" },
        { id: "forensics-1", title: "تحليل السجلات", level: "متوسط", desc: "جمع الأدلة الرقمية وفهم الخط الزمني للحوادث.", pathId: "forensics" },
        { id: "forensics-2", title: "بناء خط زمني", level: "متوسط", desc: "جمع الأدلة الرقمية وفهم الخط الزمني للحوادث.", pathId: "forensics" },
        { id: "cloud-0", title: "مفاهيم أمن السحابة", level: "متقدم", desc: "مبادئ تأمين الخدمات السحابية ودمج الأمن في التطوير.", pathId: "cloud" },
        { id: "cloud-1", title: "إدارة الصلاحيات", level: "متقدم", desc: "مبادئ تأمين الخدمات السحابية ودمج الأمن في التطوير.", pathId: "cloud" },
        { id: "cloud-2", title: "مقدمة DevSecOps", level: "متقدم", desc: "مبادئ تأمين الخدمات السحابية ودمج الأمن في التطوير.", pathId: "cloud" },
        { id: "malware-0", title: "أنواع البرمجيات الخبيثة", level: "متقدم", desc: "التعرف على السلوكيات الخطرة والتحليل النظري داخل بيئة معزولة.", pathId: "malware" },
        { id: "malware-1", title: "مؤشرات الاختراق", level: "متقدم", desc: "التعرف على السلوكيات الخطرة والتحليل النظري داخل بيئة معزولة.", pathId: "malware" },
        { id: "malware-2", title: "مبادئ التحليل الآمن", level: "متقدم", desc: "التعرف على السلوكيات الخطرة والتحليل النظري داخل بيئة معزولة.", pathId: "malware" },
        { id: "osint-0", title: "تقييم المصادر", level: "مبتدئ — متوسط", desc: "البحث والتحقق من المصادر العامة مع احترام الخصوصية والقانون.", pathId: "osint" },
        { id: "osint-1", title: "التحقق من المعلومات", level: "مبتدئ — متوسط", desc: "البحث والتحقق من المصادر العامة مع احترام الخصوصية والقانون.", pathId: "osint" },
        { id: "osint-2", title: "أخلاقيات OSINT", level: "مبتدئ — متوسط", desc: "البحث والتحقق من المصادر العامة مع احترام الخصوصية والقانون.", pathId: "osint" },
        { id: "linux-0", title: "مقدمة Linux", level: "مبتدئ", desc: "أدوات أساسية لفهم الأنظمة والبرمجة وتحليل البيانات.", pathId: "linux" },
        { id: "linux-1", title: "أساسيات Python", level: "مبتدئ", desc: "أدوات أساسية لفهم الأنظمة والبرمجة وتحليل البيانات.", pathId: "linux" },
        { id: "linux-2", title: "معالجة النصوص والسجلات", level: "مبتدئ", desc: "أدوات أساسية لفهم الأنظمة والبرمجة وتحليل البيانات.", pathId: "linux" },
        { id: "incident-0", title: "تقييم المخاطر", level: "متوسط", desc: "تحديد المخاطر وترتيبها ووضع خطط الاستجابة والتعافي.", pathId: "incident" },
        { id: "incident-1", title: "خطط الاستجابة", level: "متوسط", desc: "تحديد المخاطر وترتيبها ووضع خطط الاستجابة والتعافي.", pathId: "incident" },
        { id: "incident-2", title: "التعافي واستمرارية الأعمال", level: "متوسط", desc: "تحديد المخاطر وترتيبها ووضع خطط الاستجابة والتعافي.", pathId: "incident" }
    ];
    
    res.status(200).json(courses);
}
