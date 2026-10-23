var paths = [
{id:'basics',name:'أساسيات الأمن السيبراني',icon:'fa-shield-halved',level:'مبتدئ',desc:'المفاهيم الأساسية والتهديدات ومبادئ الحماية.',courses:['مقدمة الأمن السيبراني','إدارة الهوية وكلمات المرور','الخصوصية والأمان الرقمي']},
{id:'network',name:'أمن الشبكات',icon:'fa-network-wired',level:'مبتدئ — متوسط',desc:'تعلم الشبكات والبروتوكولات ومبادئ الدفاع.',courses:['أساسيات الشبكات','TCP/IP وDNS وHTTP','الجدران النارية ومراقبة الشبكات']},
{id:'web',name:'أمن تطبيقات الويب',icon:'fa-code',level:'متوسط',desc:'فهم جلسات الدخول والتحقق من المدخلات والثغرات الشائعة.',courses:['أساسيات HTTP وواجهات API','التحقق من المدخلات','مقدمة OWASP Top 10']},
{id:'ethical',name:'الاختراق الأخلاقي',icon:'fa-user-secret',level:'متوسط',desc:'منهجية اختبار مصرح بها وتوثيق النتائج وإصلاحها.',courses:['قواعد الاختبار المصرح','جمع المعلومات بشكل قانوني','كتابة تقرير الثغرات']},
{id:'defense',name:'الدفاع السيبراني وSOC',icon:'fa-binoculars',level:'متوسط',desc:'مراقبة الأحداث وتحليل السجلات والاستجابة للحوادث.',courses:['مقدمة SOC','قراءة سجلات الأنظمة','الاستجابة للحوادث']},
{id:'crypto',name:'التشفير وحماية البيانات',icon:'fa-key',level:'متوسط',desc:'التشفير والهاش والتوقيعات وإدارة المفاتيح.',courses:['مفاهيم التشفير','Hashing وDigital Signatures','إدارة المفاتيح']},
{id:'forensics',name:'التحليل الجنائي الرقمي',icon:'fa-magnifying-glass-chart',level:'متوسط',desc:'جمع الأدلة الرقمية وفهم الخط الزمني للحوادث.',courses:['مبادئ الأدلة الرقمية','تحليل السجلات','بناء خط زمني']},
{id:'cloud',name:'أمن السحابة وDevSecOps',icon:'fa-cloud',level:'متقدم',desc:'مبادئ تأمين الخدمات السحابية ودمج الأمن في التطوير.',courses:['مفاهيم أمن السحابة','إدارة الصلاحيات','مقدمة DevSecOps']},
{id:'malware',name:'تحليل البرمجيات الخبيثة',icon:'fa-bug',level:'متقدم',desc:'التعرف على السلوكيات الخطرة والتحليل النظري داخل بيئة معزولة.',courses:['أنواع البرمجيات الخبيثة','مؤشرات الاختراق','مبادئ التحليل الآمن']},
{id:'osint',name:'OSINT والاستخبارات المفتوحة',icon:'fa-magnifying-glass',level:'مبتدئ — متوسط',desc:'البحث والتحقق من المصادر العامة مع احترام الخصوصية والقانون.',courses:['تقييم المصادر','التحقق من المعلومات','أخلاقيات OSINT']},
{id:'linux',name:'Linux وPython للأمن',icon:'fa-terminal',level:'مبتدئ',desc:'أدوات أساسية لفهم الأنظمة والبرمجة وتحليل البيانات.',courses:['مقدمة Linux','أساسيات Python','معالجة النصوص والسجلات']},
{id:'incident',name:'إدارة المخاطر والاستجابة',icon:'fa-triangle-exclamation',level:'متوسط',desc:'تحديد المخاطر وترتيبها ووضع خطط الاستجابة والتعافي.',courses:['تقييم المخاطر','خطط الاستجابة','التعافي واستمرارية الأعمال']}
];

var courses = [];
var glossary = [ ['Asset','أصل رقمي','جهاز أو نظام أو بيانات لها قيمة وتحتاج إلى حماية.'],['Threat','تهديد','شيء قد يسبب ضررًا لأصل أو نظام.'],['Vulnerability','ثغرة','نقطة ضعف في تصميم أو تنفيذ أو إعداد.'],['Risk','مخاطر','احتمال وقوع ضرر مع مراعاة أثره.'],['Firewall','جدار ناري','نظام يراقب حركة الشبكة ويسمح بها أو يمنعها وفق قواعد.'],['Encryption','تشفير','تحويل البيانات إلى صيغة لا تُقرأ دون المفتاح المناسب.'],['Hash','بصمة رقمية','ناتج دالة أحادية الاتجاه يستخدم للتحقق أو المقارنة.'],['MFA','مصادقة متعددة العوامل','استخدام أكثر من عامل للتحقق من الهوية.'],['Phishing','تصيد احتيالي','خداع المستخدم لدفعه لكشف معلومات أو تنفيذ إجراء.'],['Patch','تحديث إصلاحي','تحديث يعالج مشكلة أو ثغرة أو خطأ.'],['SOC','مركز عمليات الأمن','فريق أو مركز يراقب التنبيهات والأحداث الأمنية.'],['SIEM','إدارة معلومات وأحداث الأمن','منصة تجمع السجلات وتربط الأحداث لإنتاج تنبيهات.'],['CTF','التقاط العلم','تحديات تدريبية لحل ألغاز أمنية ضمن نطاق محدد.'],['Least Privilege','أقل صلاحية','منح الحد الأدنى من الأذونات اللازمة.'],['Incident Response','الاستجابة للحوادث','خطوات منظمة لاحتواء حادث أمني وتحليله والتعافي منه.'],['Zero-day','ثغرة غير معروفة أو غير معالَجة','ثغرة لا يتوفر لها إصلاح مناسب وقت استغلالها أو اكتشافها.'] ];

// الـ 100 سؤال كاملين
var quizQuestions = [
{q:'ما هو اختصار CIA في الأمن السيبراني؟',a:['Central Intelligence Agency','Confidentiality, Integrity, Availability','Cyber Investigation Agency','Control, Integrity, Access'],correct:1,why:'هي ثلاثية الأمن السيبراني: السرية، السلامة، والتوافر.'},
{q:'ما هو "التصيد الاحتيالي" (Phishing)؟',a:['اختراق شبكة الواي فاي','خداع المستخدمين للحصول على بياناتهم عبر رسائل مزيفة','تدمير أجهزة الكمبيوتر عبر فيروس','سرقة الأجهزة المادية'],correct:1,why:'يعتمد على الهندسة الاجتماعية لخداع الضحايا.'},
{q:'أي مما يلي يعتبر من البرمجيات الخبيثة التي تطلب فدية لتشفير الملفات؟',a:['Trojan','Worm','Ransomware','Adware'],correct:2,why:'برامج الفدية (Ransomware) تقوم بتشفير البيانات وطلب دفع مقابل فك التشفير.'},
{q:'ما هي ثغرة SQL Injection؟',a:['حقن أكواد برمجية خبيثة في قاعدة البيانات عبر مدخلات غير آمنة','اختراق شبكة الإنترنت','سرقة كلمات المرور من المتصفح','تعطيل السيرفر عبر هجمات الحرمان من الخدمة'],correct:0,why:'تحدث عندما يمرر المهاجم أوامر SQL عبر حقول الإدخال لتنفيذها في قاعدة البيانات.'},
{q:'ما هو الجدار الناري (Firewall)؟',a:['برنامج لزيادة سرعة الإنترنت','جهاز أو برنامج يفلتر حركة الشبكة بناءً على قواعد أمنية','برنامج لمسح الفيروسات','أداة لاختراق الشبكات'],correct:1,why:'يعمل كحاجز أمني بين الشبكات الموثوقة وغير الموثوقة.'},
{q:'ما الفرق بين التشفير (Encryption) والهاش (Hashing)؟',a:['التشفير يمكن فكه بالمفتاح، والهاش اتجاه واحد لا يمكن فكه','لا يوجد فرق','الهاش يمكن فكه، والتشفير لا','التشفير أسرع من الهاش'],correct:0,why:'التشفير ثنائي الاتجاه، بينما الهاش أحادي الاتجاه يُستخدم للتحقق من السلامة.'},
{q:'ما هي هجمات XSS؟',a:['حقن أكواد جافا سكريبت خبيثة في صفحات الويب','هجوم على البريد الإلكتروني','سرقة الأجهزة','هجوم على قاعدة البيانات'],correct:0,why:'Cross-Site Scripting تحدث عند تنفيذ أكواد JS غير موثوقة في متصفح الضحية.'},
{q:'ما هو مبدأ "أقل صلاحية" (Least Privilege)؟',a:['إعطاء المستخدم كل الصلاحيات للسهولة','منح المستخدم الحد الأدنى من الصلاحيات اللازمة لعمله فقط','إلغاء كل الصلاحيات','استخدام كلمة مرور واحدة لكل شيء'],correct:1,why:'يقلل هذا المبدأ من الأضرار التي يمكن أن تحدث عند اختراق الحساب.'},
{q:'أي بروتوكول يستخدم لتأمين الاتصال بين المتصفح والسيرفر؟',a:['HTTP','FTP','HTTPS/TLS','SMTP'],correct:2,why:'HTTPS يستخدم تشفير TLS لحماية البيانات أثناء النقل.'},
{q:'ما هو هجوم DDoS؟',a:['سرقة كلمات المرور','إغراق السيرفر بطلبات وهمية لتعطيله','اختراق قاعدة البيانات','زرع فيروس في جهاز المستخدم'],correct:1,why:'هجوم الحرمان من الخدمة الموزع يهدف لتعطيل الخدمة عن المستخدمين الشرعيين.'},
{q:'ما هي الهندسة الاجتماعية (Social Engineering)؟',a:['بناء شبكات اجتماعية آمنة','التلاعب النفسي بالأشخاص للحصول على معلومات سرية','اختراق السيرفرات برمجياً','استخدام الذكاء الاصطناعي'],correct:1,why:'تعتمد على استغلال العامل البشري بدلاً من الثغرات التقنية.'},
{q:'ما هي ثغرة Zero-day؟',a:['ثغرة تم إصلاحها فوراً','ثغرة غير معروفة للمطورين وليس لها تحديث أمني','ثغرة في اليوم الأول من الشهر','ثغرة في نظام ويندوز فقط'],correct:1,why:'تكون خطيرة لأن المطور لا يعلم بها ولا يوجد لها تحديث بعد.'},
{q:'ما هو الـ VPN؟',a:['برنامج لمشاهدة الأفلام','شبكة افتراضية خاصة تشفر اتصالك وتعطي خصوصية','برنامج لتسريع الإنترنت','برنامج مضاد للفيروسات'],correct:1,why:'يقوم بإنشاء نفق مشفر بين جهازك والسيرفر المخفي لعنوانك.'},
{q:'أي مما يلي يعتبر مصادقة متعددة العوامل (MFA)؟',a:['استخدام كلمة مرور قوية فقط','استخدام كلمة مرور + بصمة الإصبع','استخدام اسم المستخدم فقط','استخدام نفس الباسورد للكل'],correct:1,why:'MFA تتطلب أكثر من عامل (شيء تعرفه، شيء تملكه، شيء أنت عليه).'},
{q:'ما هو الـ Trojan (حصان طروادة)؟',a:['فيروس ينتقل عبر الشبكة تلقائياً','برنامج خبيث يتخفى في هيئة برنامج شرعي','أداة لتشفير الملفات','برنامج لتنظيف النظام'],correct:1,why:'يخدع المستخدم ليتم تثبيته ظناً منه أنه برنامج مفيد.'},
{q:'ما هو الـ Worm (الديدان)؟',a:['برنامج خبيث ينتشر ذاتياً عبر الشبكة دون تدخل بشري','فيروس ينتقل عبر الفلاشة','برنامج للتجسس','برنامج لتسريع النت'],correct:0,why:'قدرته على الانتشار التلقائي عبر الثغرات تجعله خطيراً جداً.'},
{q:'ما هي وظيفة الـ Hashing في كلمات المرور؟',a:['تشفير الباسورد وفكه لاحقاً','تحويل الباسورد إلى بصمة لا يمكن عكسها للتحقق منه بأمان','إرسال الباسورد للإيميل','مسح الباسورد'],correct:1,why:'تخزن البصمة (Hash) فقط، وعند تسجيل الدخول يتم مقارنة البصمات.'},
{q:'ما هو هجوم MITM (رجل في المنتصف)؟',a:['اعتراض الاتصال بين طرفين للتجسس أو التعديل','سرقة جهاز الكمبيوتر','تعطيل الشبكة','إغراق السيرفر بالطلبات'],correct:0,why:'يضع المهاجم نفسه بين المرسل والمستقبل لاعتراض البيانات.'},
{q:'أي مما يلي يعتبر من أقوى كلمات المرور؟',a:['123456789','Password123','K9#mP2$vL8@q','اسمك وتاريخ ميلادك'],correct:2,why:'الطول والتعقيد (حروف كبيرة وصغيرة، أرقام، رموز) يجعله مستحيل التخمين تقريباً.'},
{q:'ما هو الـ Botnet؟',a:['شبكة من الأجهزة المخترقة يتم التحكم بها عن بعد','شبكة تواصل اجتماعي','برنامج مضاد للفيروسات','نظام تشغيل جديد'],correct:0,why:'تُستخدم هذه الأجهزة (Zombies) عادة في هجمات DDoS أو إرسال بريد مزعج.'},
{q:'ما هي ثغرة XSS المخزنة (Stored XSS)؟',a:['تحدث عند حفظ الكود الخبيث في قاعدة البيانات ويظهر لكل الزوار','تحدث في وقت واحد فقط','لا تؤثر على المستخدمين','تعتمد على إرسال إيميل'],correct:0,why:'الأخطر لأن الكود يبقى في السيرفر ويصيب كل من يفتح الصفحة المصابة.'},
{q:'ما هو الـ Rootkit؟',a:['برنامج يمنح المهاجم وصولاً خفياً بصلاحيات المدير','أداة لتصميم المواقع','برنامج لتنظيف الملفات','نظام حماية'],correct:0,why:'يخفي نفسه بعمق في النظام ليصعب اكتشافه أو إزالته.'},
{q:'ما هي أداة Wireshark؟',a:['أداة لتحليل حركة مرور الشبكة (Packet Sniffing)','برنامج لتصميم الجرافيك','متصفح إنترنت','برنامج محادثة'],correct:0,why:'تُستخدم لالتقاط وتحليل حزم البيانات في الشبكة.'},
{q:'ما هو الـ HTTPS Port الافتراضي؟',a:['80','21','443','22'],correct:2,why:'المنفذ 443 مخصص لاتصالات HTTPS المشفرة، بينما 80 لـ HTTP.'},
{q:'ما هو الـ DNS Spoofing؟',a:['تزوير استجابة خادم الأسماء لتوجيه المستخدم لموقع مزيف','سرقة اسم النطاق','إغلاق السيرفر','تشفير البيانات'],correct:0,why:'يتم إدخال سجلات DNS خبيثة في كاش السيرفر لتوجيه الزوار لمواقع الاحتيال.'},
{q:'ماذا يعني مصطلح Patch؟',a:['تحديث برمجي لسد ثغرة أمنية أو إصلاح خطأ','برنامج اختراق','فيروس','برنامج للحماية'],correct:0,why:'تحديث الأنظمة باستمرار يغلق الثغرات المعروفة.'},
{q:'ما هو الـ Spyware؟',a:['برنامج يتجسس على نشاط المستخدم ويسرق بياناته دون علمه','برنامج لتسريع الجهاز','لعبة إلكترونية','برنامج مضاد للفيروسات'],correct:0,why:'يعمل في الخفاء لمراقبة المفاتيح أو لقطات الشاشة أو المواقع.'},
{q:'ما هي ثغرة CSRF؟',a:['تزوير طلب من موقع آخر لتنفيذ إجراء باسم المستخدم المسجل','اختراق قاعدة البيانات','تعطيل السيرفر','سرقة كلمة المرور'],correct:0,why:'تستغل ثقة الموقع في متصفح المستخدم المسجل مسبقاً.'},
{q:'ما هو الـ Keylogger؟',a:['برنامج يسجل كل ضغطة زر يقوم بها المستخدم','برنامج لتسريع الإنترنت','برنامج للحماية','برنامج لتصميم الأزرار'],correct:0,why:'يستخدم لسرقة كلمات المرور وبيانات البطاقات الائتمانية.'},
{q:'ما الفرق بين IDS و IPS؟',a:['IDS يكتشف ويرسل تنبيه، IPS يكتشف ويمنع الهجوم','لا يوجد فرق','IDS يمنع، IPS يكتشف','كلاهما مضاد للفيروسات'],correct:0,why:'نظام كشف التسلل (IDS) يراقب ويحذر، بينما نظام منع التسلل (IPS) يتدخل ويحظر الهجوم.'},
{q:'ما هو الـ Honeypot؟',a:['نظام مصيدة لخداع المهاجمين وجمع معلومات عنهم','برنامج لصنع العسل','نظام حماية قوي','فيروس'],correct:0,why:'يُستخدم كطعم لجذب المهاجمين بعيداً عن الأنظمة الحقيقية.'},
{q:'ما هي أداة Nmap؟',a:['أداة لفحص الشبكات واكتشاف المنافذ المفتوحة (Port Scanning)','أداة لتصميم الخرائط','برنامج محادثة','متصفح'],correct:0,why:'أداة أساسية في مرحلة استطلاع الشبكات (Reconnaissance).'},
{q:'ما هي الهندسة العكسية (Reverse Engineering)؟',a:['تحليل برنامج جاهز لفهم كيفية عمله واستخراج الكود المصدري أو الثغرات','تصميم موقع من الصفر','بناء شبكة'],correct:0,why:'تُستخدم في تحليل البرمجيات الخبيثة وهندسة الأمن.'},
{q:'ما هو الـ OSINT؟',a:['جمع المعلومات من المصادر المفتوحة والمتاحة للعامة','اختراق السيرفرات','تشفير البيانات','برمجة'],correct:0,why:'Open Source Intelligence يعتمد على تحليل البيانات العامة لاستخراج معلومات.'},
{q:'ما هو التشفير المتماثل (Symmetric Encryption)؟',a:['استخدام نفس المفتاح للتشفير وفك التشفير','استخدام مفتاحين مختلفين','عدم استخدام مفاتيح','تشفير الصور فقط'],correct:0,why:'مثل AES، يكون سريعاً لكن التحدي هو تبادل المفتاح بأمان.'},
{q:'ما هو التشفير غير المتماثل (Asymmetric Encryption)؟',a:['استخدام مفتاح عام للتشفير ومفتاح خاص لفك التشفير','استخدام نفس المفتاح','لا يوجد تشفير','تشفير الملفات فقط'],correct:0,why:'مثل RSA، يحل مشكلة تبادل المفاتيح ويُستخدم في التوقيعات الرقمية.'},
{q:'ما هو الـ Digital Signature؟',a:['إثبات أصالة الرسالة وسلامتها باستخدام التشفير','توقيع بخط اليد على الشاشة','صورة شخصية','بصمة إصبع'],correct:0,why:'يضمن أن الرسالة لم يتم التلاعب بها وأنها من المرسل الحقيقي.'},
{q:'ما هو الـ SOC؟',a:['مركز عمليات الأمن الذي يراقب ويستجيب للتهديدات على مدار الساعة','شركة برمجة','نظام تشغيل','برنامج تصميم'],correct:0,why:'Security Operations Center هو خط الدفاع الأول في الشركات.'},
{q:'ما هو الـ SIEM؟',a:['نظام لإدارة معلومات وأحداث الأمن وجمع السجلات وتحليلها','برنامج لتحرير النصوص','نظام تشغيل','برنامج لتصميم الصور'],correct:0,why:'يجمع سجلات الشبكة والأجهزة في مكان واحد للكشف عن الأنماط المشبوهة.'},
{q:'ماذا يعني الـ Backup؟',a:['نسخة احتياطية من البيانات لاستعادتها في حال حدوث كارثة','مسح البيانات','تشفير البيانات','سرقة البيانات'],correct:0,why:'حماية أساسية ضد هجمات الفدية وأعطال الأجهزة.'},
{q:'ما هي أداة Metasploit؟',a:['إطار عمل لاختبار الاختراق واستغلال الثغرات','أداة لكتابة الأكواد','متصفح إنترنت','برنامج لتصميم الجرافيك'],correct:0,why:'تُستخدم في الاختبارات الأخلاقية لتجربة الثغرات وتقييم الأنظمة.'},
{q:'ما هو المصطلح الذي يصف اختبار الأنظمة بموافقة قانونية؟',a:['الاختراق الأخلاقي (Ethical Hacking)','الاختراق غير القانوني','الهاكر الأسود','الهاكر الرمادي'],correct:0,why:'يتم بموافقة صريحة لتحسين الأمان وليس للإضرار.'},
{q:'ما هو الـ Pharming؟',a:['توجيه المستخدمين لموقع مزيف عبر التلاعب في DNS','استخدام الهندسة الاجتماعية فقط','زرع فيروس في جهاز','تعطيل السيرفر'],correct:0,why:'لا يحتاج لخداع المستخدم للضغط على رابط، بل يتم توجيهه تلقائياً.'},
{q:'ما هو الـ Steganography؟',a:['إخفاء البيانات داخل ملفات أخرى مثل الصور أو الصوت','تشفير الملفات','سرقة البيانات','تعطيل الشبكة'],correct:0,why:'يخفي وجود الرسالة أساساً، بخلاف التشفير الذي يخفي معناها.'},
{q:'ما هي لوحة المفاتيح الافتراضية (Virtual Keyboard) المستخدمة لمواجهة؟',a:['برامج تسجيل ضغطات المفاتيح (Keyloggers)','الفيروسات','هجمات DDoS','سرقة الأجهزة'],correct:0,why:'تساعد في حماية كلمات المرور الحساسة من الاعتراض البرمجي.'},
{q:'ما هو الفرق بين الهاكر ذو القبعة البيضاء والسوداء؟',a:['الأبيض يخترق بإذن وقانوني، الأسود يخترق بدون إذن وللإضرار','لا يوجد فرق','الأسود يساعد الشركات','الأبيض يخترق البنوك'],correct:0,why:'القبعة البيضاء هم المختبرون الأخلاقيون، والسوداء هم المجرمون.'},
{q:'ما هي الثغرة التي تعتمد على تخمين كلمة المرور مراراً وتكراراً؟',a:['Brute Force Attack','Phishing','XSS','SQL Injection'],correct:0,why:'تستخدم القوة الغاشمة لتجربة كل الاحتمالات حتى النجاح.'},
{q:'كيف نحمي أنفسنا من هجمات Ransomware؟',a:['عمل نسخ احتياطية دورية وتحديث النظام وتجنب المرفقات المشبوهة','الدفع للمهاجم دائماً','إيقاف تشغيل الجهاز','حذف كل الملفات'],correct:0,why:'النسخ الاحتياطية تفصل البيانات عن الجهاز المصاب وتكون طوق النجاة.'},
{q:'ما هي أداة Burp Suite؟',a:['أداة لفحص واختبار أمن تطبيقات الويب','برنامج لتحرير الصوت','أداة لفحص الأجهزة','متصفح'],correct:0,why:'تستخدم لاعتراض وتعديل طلبات HTTP بين المتصفح والسيرفر لاختبار الثغرات.'},
{q:'ما هو الـ Zero Trust Architecture؟',a:['نموذج أمني لا يثق بأي مستخدم أو جهاز داخلي أو خارجي افتراضياً','نموذج يثق بكل من في الشبكة','إلغاء الحماية','الاعتماد على كلمة مرور واحدة'],correct:0,why:'يقوم على مبدأ "لا تثق أبداً، تحقق دائماً" لكل طلب وصول.'},
{q:'ماذا تعني كلمة Hashing في سياق التحقق من سلامة الملفات؟',a:['إنتاج بصمة فريدة للملف للتأكد من عدم تغييره','ضغط الملف','مسح الملف','إرسال الملف'],correct:0,why:'لو تغير بايت واحد في الملف سيتغير الـ Hash بالكامل.'},
{q:'ما هو المنفذ (Port) الافتراضي لبروتوكول SSH؟',a:['80','21','22','443'],correct:2,why:'المنفذ 22 هو المخصص للاتصال الآمن عن بعد (Secure Shell).'},
{q:'ما هو المنفذ الافتراضي لبروتوكول FTP؟',a:['21','22','80','443'],correct:0,why:'المنفذ 21 يستخدم لنقل الملفات (File Transfer Protocol).'},
{q:'ما هو الـ MAC Address؟',a:['عنوان فيزيائي فريد مخصص لكل كارت شبكة في العالم','عنوان IP المؤقت','برنامج لاختراق الشبكات','اسم السيرفر'],correct:0,why:'هو عنوان الجهاز الفيزيائي ولا يمكن تغييره (نظرياً) وهو فريد.'},
{q:'ماذا يعني اختصار IP؟',a:['Internet Protocol','Internal Program','Intranet Port','Internet Password'],correct:0,why:'هو بروتوكول الإنترنت المسؤول عن العنونة وتوجيه الحزم.'},
{q:'ما هو الـ TCP 3-way handshake؟',a:['عملية الاتصال بين جهازين (SYN, SYN-ACK, ACK) لبدء الاتصال','تشفير البيانات','نوع من الفيروسات','بروتوكول للبريد'],correct:0,why:'هي الخطوات التي يتم بها تأسيس اتصال موثوق عبر TCP.'},
{q:'ما هو الـ ARP Spoofing؟',a:['انتحال عنوان MAC لتوجيه حركة الشبكة للمهاجم','سرقة كلمة المرور','تشفير الشبكة','إغلاق السيرفر'],correct:0,why:'يُستخدم في هجمات MITM داخل الشبكة المحلية (LAN).'},
{q:'ما هو الـ VLAN؟',a:['شبكة محلية افتراضية تقسم الشبكة الكبيرة لعزل الأقسام','نوع من الفيروسات','بروتوكول بريد إلكتروني','برنامج للحماية'],correct:0,why:'تقسم الشبكة الفيزيائية لشبكات منطقية منفصلة لزيادة الأمان وتقليل الحركة.'},
{q:'ما هو الـ Proxy Server؟',a:['خادم وسيط يمر من خلاله الطلبات لإخفاء هوية العميل أو فلترة المحتوى','برنامج تصميم','متصفح إنترنت','نظام تشغيل'],correct:0,why:'يعمل كوسيط بين المستخدم والإنترنت لإخفاء الـ IP أو حجب مواقع.'},
{q:'ما هو الـ Sandbox (صندوق الرمل)؟',a:['بيئة معزولة لتشغيل الأكواد المشبوهة بأمان دون إصابة النظام الرئيسي','برنامج لتصميم الألعاب','متصفح إنترنت','نوع من الشبكات'],correct:0,why:'يُستخدم لتحليل البرمجيات الخبيثة ومعرفة سلوكها بأمان.'},
{q:'ما هي خوارزمية AES؟',a:['خوارزمية تشفير متماثل','خوارزمية هاش','بروتوكول شبكات','فيروس'],correct:0,why:'Advanced Encryption Standard هي المعيار الحالي لتشفير البيانات المتماثل.'},
{q:'ما هي خوارزمية RSA؟',a:['خوارزمية تشفير غير متماثل (مفتاح عام وخاص)','خوارزمية هاش','بروتوكول شبكات','فيروس'],correct:0,why:'تعتمد على صعوبة تحليل الأعداد الكبيرة وتُستخدم في تأمين الاتصالات.'},
{q:'ما هو الـ Salt في عملية الهاش (Hashing)؟',a:['بيانات عشوائية تضاف للباسورد قبل الهاش لمنع هجمات الجداول الجاهزة','ملح الطعام','برنامج لتسريع الهاش','نوع من التشفير'],correct:0,why:'يجعل كل بصمة (Hash) فريدة حتى لو كان الباسورد متطابق.'},
{q:'ما هو الـ Rainbow Table Attack؟',a:['استخدام جداول جاهزة للبصمات لفك تشفير كلمات المرور','هجوم على الشبكة','سرقة الأجهزة','برنامج تصميم'],correct:0,why:'يتم التصدي له باستخدام الـ Salt.'},
{q:'ما هو الـ Dictionary Attack؟',a:['تخمين الباسورد باستخدام قائمة كلمات شائعة','هجوم فيروسي','سرقة الملفات','تشفير البيانات'],correct:0,why:'يعتمد على أن المستخدمين يستخدمون كلمات سهلة وشائعة.'},
{q:'ما هو الـ WAF (Web Application Firewall)؟',a:['جدار حماية متخصص في حماية تطبيقات الويب من الهجمات','برنامج مضاد للفيروسات','نظام تشغيل','متصفح'],correct:0,why:'يقف أمام السيرفر ويفلتر الطلبات الخبيثة مثل SQLi و XSS.'},
{q:'ما هي ثغرة IDOR؟',a:['تعديل معرّف الوصول لعرض بيانات مستخدم آخر دون إذن','اختراق قاعدة البيانات','سرقة الباسورد','تعطيل السيرفر'],correct:0,why:'Insecure Direct Object Reference تحدث عند عدم التحقق من صلاحية المستخدم على المعرّف.'},
{q:'ما هي ثغرة Directory Traversal؟',a:['التلاعب بمسار الملفات للوصول لملفات حساسة في السيرفر','اختراق شبكة الواي فاي','سرقة الباسورد','هجوم فيروسي'],correct:0,why:'تستخدم رموز مثل ../ للخروج من المجلد المسموح به.'},
{q:'ما هي ثغرة Command Injection؟',a:['حقن أوامر نظام التشغيل عبر مدخلات التطبيق','تشفير الملفات','سرقة الجهاز','برنامج تصميم'],correct:0,why:'تحدث عندما يمرر التطبيق مدخلات المستخدم مباشرة لنظام التشغيل.'},
{q:'ما هو الـ Session Hijacking؟',a:['سرقة جلسة المستخدم (الكوكيز) للوصول لحسابه','سرقة الجهاز','اختراق السيرفر','برنامج تصميم'],correct:0,why:'تحدث عند اعتراض الـ Session Token وسرقة هوية المستخدم.'},
{q:'ما هو الكوكيز (Cookies)؟',a:['ملفات نصية صغيرة تحفظ حالة المستخدم في المتصفح','برنامج خبيث','ملفات فيروسات','برنامج تصميم'],correct:0,why:'تُستخدم لحفظ تسجيل الدخول وتفضيلات الموقع.'},
{q:'ما هو الـ JWT (JSON Web Token)؟',a:['طريقة لنقل بيانات التحقق من الهوية بين الأطراف بشكل آمن','برنامج تصميم','نوع من الفيروسات','شبكة افتراضية'],correct:0,why:'يُستخدم بشكل واسع في توثيق API وتبادل المعلومات المشفرة.'},
{q:'ما هو الـ OAuth؟',a:['بروتوكول للسماح لتطبيق بالوصول لبياناتك من تطبيق آخر دون كلمة مرور','برنامج تصميم','هجوم فيروسي','نظام تشغيل'],correct:0,why:'يُستخدم في أزرار "تسجيل الدخول بحساب جوجل أو فيسبوك".'},
{q:'ما هو الـ SSO (Single Sign-On)؟',a:['تسجيل الدخول مرة واحدة للوصول لعدة أنظمة','برنامج تصميم','هجوم فيروسي','شبكة افتراضية'],correct:0,why:'يوفر الوقت للمستخدمين ويقلل من عدد كلمات المرور.'},
{q:'ما هو بروتوكول Kerberos؟',a:['بروتوكول مصادقة شبكي يستخدم التذاكر للتحقق من الهوية','برنامج تصميم','هجوم فيروسي','نظام تشغيل'],correct:0,why:'يُستخدم بكثرة في بيئات Windows للتحقق من هوية المستخدمين.'},
{q:'ما هو الـ Logic Bomb؟',a:['كود خبيث ينفذ نفسه عند تحقق شرط معين (مثل تاريخ محدد)','برنامج لتصميم المواقع','هجوم شبكي','برنامج للحماية'],correct:0,why:'ينتظر حدثاً معيناً ليتفجر ويسبب ضرراً (مثل حذف الملفات).'},
{q:'ما هو الـ RAT (Remote Access Trojan)؟',a:['برنامج خبيث يمنح المهاجم تحكماً كاملاً في جهاز الضحية عن بعد','برنامج لتصميم المواقع','هجوم شبكي','برنامج للحماية'],correct:0,why:'يتيح للمهاجم رؤية الشاشة، الملفات، والكاميرا دون علم الضحية.'},
{q:'ما هو الـ Adware؟',a:['برنامج خبيث يعرض إعلانات مزعجة ويسرق بيانات التصفح','برنامج لتصميم المواقع','هجوم شبكي','برنامج للحماية'],correct:0,why:'غالباً ما يأتي مع برامج مجانية ويتسبب في إزعاج وتسريب بيانات.'},
{q:'ما هو الـ Botmaster؟',a:['الشخص الذي يتحكم في شبكة الـ Botnet','مدير السيرفر','مبرمج التطبيقات','هكر أخلاقي'],correct:0,why:'هو المسؤول عن إدارة وإصدار الأوامر للأجهزة المصابة.'},
{q:'ما هو الهاكر ذو القبعة الرمادية (Grey Hat)؟',a:['هاكر يخترق الأنظمة دون إذن لكنه يبلغ عن الثغرات بدلاً من إلحاق الضرر','هاكر أخلاقي','مجرم إلكتروني','مبرمج'],correct:0,why:'يتحرك بين القانونية واللامعقولية ولا يحصل دائماً على إذن مسبق.'},
{q:'ما هو الـ Bug Bounty؟',a:['مكافأة مالية تقدمها الشركات لاكتشاف الثغرات في أنظمتها','برنامج لتصميم المواقع','نظام تشغيل','هجوم فيروسي'],correct:0,why:'يحفز الهاكرز الأخلاقيين على الإبلاغ عن الثغرات بدلاً من استغلالها.'},
{q:'ما هو اختبار الاختراق (Penetration Testing)؟',a:['محاكاة هجمات حقيقية لتقييم أمان النظام','تشفير البيانات','تدمير الأنظمة','برمجة المواقع'],correct:0,why:'يتم بإذن لتحديد الثغرات وإصلاحها قبل استغلالها من المجرمين.'},
{q:'ما هو الفريق الأحمر (Red Teaming)؟',a:['فريق يحاكي المهاجمين لاختبار دفاعات المؤسسة','فريق الحماية والدفاع','فريق التطوير','فريق الموارد البشرية'],correct:0,why:'يعمل على اختراق المؤسسة أخلاقياً لكشف نقاط الضعف.'},
{q:'ما هو الفريق الأزرق (Blue Teaming)؟',a:['فريق الدفاع والمراقبة والرد على الهجمات','فريق الهجوم','فريق التطوير','فريق الموارد البشرية'],correct:0,why:'مسؤول عن حماية الأنظمة والكشف عن هجمات الفريق الأحمر.'},
{q:'ما هو الفريق البنفسجي (Purple Teaming)؟',a:['تعاون بين الفريق الأحمر والأزرق لتحسين الأمان','فريق الهجوم','فريق الدفاع','فريق التطوير'],correct:0,why:'يهدف لتبادل المعلومات بين الهجوم والدفاع لتقوية الأمان.'},
{q:'ما هو Threat Modeling؟',a:['عملية تحديد وتقييم التهديدات المحتملة للأنظمة','تشفير البيانات','تدمير الأنظمة','برمجة المواقع'],correct:0,why:'تُستخدم مبكراً في تصميم التطبيقات لبناء حماية قوية.'},
{q:'ما هو الـ CVE؟',a:['قاعدة بيانات للثغرات الأمنية المعروفة','برنامج تصميم','هجوم فيروسي','شبكة افتراضية'],correct:0,why:'Common Vulnerabilities and Exposures تعطي رقم تعريف لكل ثغرة معروفة.'},
{q:'ما هو الـ CVSS Score؟',a:['نظام لتقييم خطورة الثغرات من 0 إلى 10','برنامج تصميم','هجوم فيروسي','شبكة افتراضية'],correct:0,why:'يساعد المؤسسات على تحديد أولويات إصلاح الثغرات.'},
{q:'ما هو الـ Payload؟',a:['الكود الخبيث الذي يتم تنفيذه بعد نجاح الاختراق','برنامج لتصميم المواقع','هجوم شبكي','برنامج للحماية'],correct:0,why:'هو الجزء الذي يقوم بالفعل الضار (مثل فتح بوابة خلفية).'},
{q:'ما هو الـ Exploit؟',a:['كود أو أداة تستغل ثغرة معينة لتنفيذ هجوم','برنامج لتصميم المواقع','هجوم شبكي','برنامج للحماية'],correct:0,why:'الـ Exploit يستهدف الثغرة، والـ Payload هو ما يتم تنفيذه.'},
{q:'ما هو تقييم الثغرات (Vulnerability Assessment)؟',a:['فحص الأنظمة لاكتشاف نقاط الضعف دون استغلالها','تشفير البيانات','تدمير الأنظمة','برمجة المواقع'],correct:0,why:'يعطي تقريراً بالثغرات الموجودة بدون محاولة اختراقها.'},
{q:'ما هو تسريب البيانات (Data Breach)؟',a:['وصول غير مصرح به للبيانات الحساسة وسرقتها','تشفير البيانات','نسخ البيانات احتياطياً','برمجة المواقع'],correct:0,why:'حادث أمني خطير يؤثر على خصوصية المستخدمين.'},
{q:'ما هو الـ GDPR؟',a:['قانون أوروبي لحماية خصوصية البيانات','برنامج تصميم','هجوم فيروسي','شبكة افتراضية'],correct:0,why:'يفرض غرامات ضخمة على الشركات التي تسيء استخدام بيانات المستخدمين.'},
{q:'ما هو الـ PII (Personally Identifiable Information)؟',a:['أي بيانات يمكن استخدامها لتحديد هوية شخص (الاسم، الرقم القومي...)','برنامج تصميم','هجوم فيروسي','شبكة افتراضية'],correct:0,why:'حماية هذه البيانات هي أساس قوانين الخصوصية.'},
{q:'ما هو أمن نقاط النهاية (Endpoint Security)؟',a:['حماية الأجهزة (الكمبيوتر، الموبايل) من التهديدات','حماية الشبكات فقط','حماية السيرفرات فقط','حماية المواقع فقط'],correct:0,why:'يركز على تأمين الأجهزة التي يستخدمها الموظفون لمنع الاختراق.'},
{q:'ما هو الـ EDR (Endpoint Detection and Response)؟',a:['نظام يراقب ويكتشف ويستجيب للتهديدات على الأجهزة','برنامج تصميم','هجوم فيروسي','شبكة افتراضية'],correct:0,why:'يتجاوز مضاد الفيروسات التقليدي بقدرته على التحليل والاستجابة.'},
{q:'ما هي الشبكة المعزولة (Air-gapped Network)؟',a:['شبكة غير متصلة بالإنترنت نهائياً لحمايتها','شبكة لاسلكية','شبكة سريعة','شبكة افتراضية'],correct:0,why:'تُستخدم في الأنظمة الحساسة جداً (مثل المنشآت النووية) لمنع الاختراق عن بعد.'},
{q:'ما هو الـ DMZ في الشبكات؟',a:['منطقة منعزلة تستضيف السيرفرات العامة (مثل الويب) لفصلها عن الشبكة الداخلية','برنامج تصميم','هجوم فيروسي','شبكة افتراضية'],correct:0,why:'Demilitarized Zone تقلل المخاطر في حال اختراق السيرفرات العامة.'},
{q:'ما هو تقسيم الشبكة (Network Segmentation)؟',a:['تقسيم الشبكة الكبيرة لأجزاء صغيرة لعزل الاختراقات','تشفير البيانات','تدمير الأنظمة','برمجة المواقع'],correct:0,why:'يمنع انتشار الفيروسات من قسم لآخر في حال حدوث اختراق.'},
{q:'ما هو تصادم الهاش (Hash Collision)؟',a:['عندما تنتج مدخلات مختلفة نفس البصمة (Hash)','برنامج تصميم','هجوم فيروسي','شبكة افتراضية'],correct:0,why:'يعتبر ضعفاً في خوارزمية الهاش ويجب استخدام خوارزميات قوية مثل SHA-256.'}
];

// التحديات الستة CTF
var challenges = [
    { title: 'تحدي الهاش (Hash Cracking)', desc: 'أمامك هاش MD5: `5f4dcc3b5aa765d61d8327deb882cf99`. حاول تفك التشفير وتعرف الباسورد الأصلي.', hint: 'الباسورد من أشهر كلمات المرور في العالم (موجودة في ملف rockyou.txt).' },
    { title: 'تحليل سجل دخول (Log Analysis)', desc: 'في سجل السيرفر، وجدت 100 محاولة دخول فاشلة لنفس المستخدم في دقيقة واحدة. ما نوع هذا الهجوم؟', hint: 'هجوم يعتمد على تجربة كلمات مرور كثيرة بسرعة.' },
    { title: 'اكتشاف رابط مشبوه (Phishing)', desc: 'استلمت رسالة من `support@paypa1.com` تطلب تحديث بياناتك. ما هو الخطأ في هذا الرابط؟', hint: 'بص على اسم النطاق (Domain) كويس جداً.' },
    { title: 'شبكة معزولة (Network)', desc: 'جهازك لا يستطيع الوصول للإنترنت، لكنه يرى الأجهزة الأخرى في الشبكة المحلية. ما هو عنوان IP الذي يجب أن تفحصه أولاً؟', hint: 'الجهاز المسؤول عن توجيه الاتصال للخارج (Gateway).' },
    { title: 'كلمة سر مشفرة (Caesar Cipher)', desc: 'وجدت رسالة مشفرة: `Cyna Hnzore`. إذا علمت أن الحروف تم إزاحتها 13 حرفاً، ما هي الكلمة الأصلية؟', hint: 'الإزاحة 13 (ROT13) هي خدعة مشهورة جداً.' },
    { title: 'تحليل عنوان IP (OSINT)', desc: 'لديك عنوان IP: `8.8.8.8`. من هي الشركة التي تمتلك هذا العنوان؟', hint: 'هي شركة خدمات إنترنت شهيرة جداً وتمتلك محرك بحث.' }
];

var currentQuiz = 0, score = 0, answered = false, selectedPath = 'all';
var completed = new Set();

async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        if (response.ok) {
            courses = await response.json();
            renderPaths(); renderCourseTabs(); renderCourses(); renderFeatured();
        }
    } catch (error) { console.error("Error:", error); }
}

async function loadUserProgress() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    try {
        const res = await fetch(`/api/progress?email=${user.email}`);
        if (res.ok) {
            const data = await res.json();
            if (data.completed) {
                completed = new Set(data.completed);
                renderCourses(); renderFeatured();
                document.getElementById('statDone').textContent = Math.min(100, Math.round(completed.size/12*100)) + '%';
            }
        }
    } catch (e) {}
}

function pathCard(p) { return '<div class="path-card" data-path-id="' + p.id + '"><i class="fa-solid ' + p.icon + '"></i><b>' + p.name + '</b><small>' + p.level + '</small></div>'; }
function courseCard(c) {
    var pct = completed.has(c.id) ? 100 : 0;
    var cLevel = c.level || 'مبتدئ';
    var cPathId = c.pathId || 'all';
    var pathIcon = 'fa-shield-halved';
    for (var k = 0; k < paths.length; k++) { if (paths[k].id === cPathId) { pathIcon = paths[k].icon; break; } }
    return '<article class="card"><div class="course-icon"><i class="fa-solid ' + pathIcon + '"></i></div>' +
        '<div class="chips"><span class="chip">' + cLevel + '</span><span class="chip">كورس</span></div>' +
        '<h3>' + c.title + '</h3><p>' + (c.desc || 'لا يوجد وصف') + '</p>' +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<button class="primary" data-course-id="' + c.id + '">' + (pct ? 'مراجعة' : 'ابدأ التعلم') + ' <i class="fa-solid fa-arrow-left"></i></button></article>';
}

function renderPaths() { var h=''; for(var i=0;i<4;i++) h+=pathCard(paths[i]); document.getElementById('homePaths').innerHTML=h; var a=''; for(var i=0;i<paths.length;i++) a+=pathCard(paths[i]); document.getElementById('allPaths').innerHTML=a; }
function renderCourses() { var input=document.getElementById('courseSearch'); var q=input?input.value.trim().toLowerCase():''; var f=[]; for(var i=0;i<courses.length;i++){var c=courses[i]; if((selectedPath==='all'||c.pathId===selectedPath)&&(c.title+' '+c.desc).toLowerCase().indexOf(q)!==-1) f.push(c);} document.getElementById('courseGrid').innerHTML = f.length>0?f.map(courseCard).join(''):'<div class="empty">مفيش كورسات مطابقة.</div>'; }
function renderFeatured() { var h=''; for(var i=0;i<3&&i<courses.length;i++) h+=courseCard(courses[i]); document.getElementById('featuredCourses').innerHTML=h; }
function renderCourseTabs() { var h='<button class="tab '+(selectedPath==='all'?'active':'')+'" data-tab-path="all">الكل</button>'; for(var i=0;i<paths.length;i++) h+='<button class="tab '+(selectedPath===paths[i].id?'active':'')+'" data-tab-path="'+paths[i].id+'">'+paths[i].name+'</button>'; document.getElementById('courseTabs').innerHTML=h; }
function setCoursePath(id) { selectedPath=id; renderCourseTabs(); renderCourses(); }

function openPath(id) {
    var p=null; for(var i=0;i<paths.length;i++) if(paths[i].id===id) p=paths[i]; if(!p) return;
    showSection('paths'); var h=''; for(var i=0;i<courses.length;i++) if(courses[i].pathId===id) h+=courseCard(courses[i]);
    document.getElementById('pathDetails').innerHTML='<div class="section-head"><div><h2>'+p.name+'</h2><p>'+p.desc+'</p></div><span class="chip">'+p.level+'</span></div><div class="grid">'+h+'</div>';
    document.getElementById('pathDetails').scrollIntoView({behavior:'smooth',block:'start'});
}

async function openCourseModal(id) {
    const c = courses.find(x => x.id === id);
    if(!c) return;
    
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if(currentUser) {
        fetch('/api/progress', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:currentUser.email, courseId:id}) })
        .then(res => res.json()).then(data => {
             if(data.completed) { completed = new Set(data.completed); renderCourses(); renderFeatured(); }
        }).catch(e=>console.log(e));
    }

    document.getElementById('courseModalContent').innerHTML = `
        <div class="chip" style="margin:auto; margin-bottom:15px;">${c.level}</div>
        <h1 style="color:var(--red); font-size:24px;">${c.title}</h1>
        <p style="color:var(--muted); line-height:1.8;">${c.desc}</p>
        <a href="https://www.youtube.com/@SecureTheHumans" target="_blank" class="primary" style="display:inline-block; margin-top:20px; text-decoration:none;">شاهد الكورس على يوتيوب</a>
    `;
    document.getElementById('courseModal').classList.remove('hidden');
}
function closeCourseModal() { document.getElementById('courseModal').classList.add('hidden'); }
function openAuthModal(tab='login') { document.getElementById('authModal').classList.remove('hidden'); switchAuthTab(tab); }
function closeAuthModal() { document.getElementById('authModal').classList.add('hidden'); }
function switchAuthTab(tab) {
    document.getElementById('loginTab').classList.remove('active'); document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginForm').classList.add('hidden'); document.getElementById('registerForm').classList.add('hidden'); document.getElementById('resetForm').classList.add('hidden');
    document.getElementById('authMsgBox').className = 'auth-msg';
    if(tab==='login') { document.getElementById('loginTab').classList.add('active'); document.getElementById('loginForm').classList.remove('hidden'); }
    else { document.getElementById('registerTab').classList.add('active'); document.getElementById('registerForm').classList.remove('hidden'); }
}
function togglePass(id, btn) { const i=document.getElementById(id); if(i.type==='password'){i.type='text';btn.innerHTML='🙈';}else{i.type='password';btn.innerHTML='👁️';} }
function showAuthMsg(text, type) { const b=document.getElementById('authMsgBox'); b.innerText=text; b.className=`auth-msg ${type}`; }

async function handleLogin() {
    const email=document.getElementById('loginEmail').value, password=document.getElementById('loginPassword').value;
    if(!email||!password) return showAuthMsg("ملء الحقول","error");
    try {
        const res=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
        const data=await res.json();
        if(res.ok){ localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); showAuthMsg("تم الدخول!","success"); setTimeout(()=>location.reload(),1000); }
        else showAuthMsg(data.error,"error");
    } catch(e) { showAuthMsg("خطأ في الاتصال","error"); }
}
async function handleRegister() {
    const username=document.getElementById('regUsername').value, email=document.getElementById('regEmail').value, password=document.getElementById('regPassword').value;
    if(!username||!email||!password) return showAuthMsg("ملء الحقول","error");
    try {
        const res=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,email,password})});
        const data=await res.json();
        if(res.ok){ showAuthMsg("تم التسجيل!","success"); switchAuthTab('login'); document.getElementById('loginEmail').value=email; }
        else showAuthMsg(data.error,"error");
    } catch(e) { showAuthMsg("خطأ في الاتصال","error"); }
}
async function handleReset() {
    const email=document.getElementById('resetEmail').value, newPassword=document.getElementById('resetNewPassword').value;
    if(!email||!newPassword) return showAuthMsg("ملء الحقول","error");
    try {
        const res=await fetch('/api/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,newPassword})});
        const data=await res.json();
        if(res.ok){ showAuthMsg(data.message,"success"); setTimeout(()=>location.reload(),1500); }
        else showAuthMsg(data.error,"error");
    } catch(e) { showAuthMsg("خطأ في الاتصال","error"); }
}

function showSection(id) {
    var views=document.querySelectorAll('.view'); for(var i=0;i<views.length;i++){if(views[i].id===id)views[i].classList.remove('hidden');else views[i].classList.add('hidden');}
    var links=document.querySelectorAll('.side-link'); for(var i=0;i<links.length;i++){if(links[i].getAttribute('data-target')===id)links[i].classList.add('active');else links[i].classList.remove('active');}
    var navs=document.querySelectorAll('[data-nav]'); for(var i=0;i<navs.length;i++){if(navs[i].getAttribute('data-nav')===id)navs[i].classList.add('active');else navs[i].classList.remove('active');}
    document.getElementById('sidebar').classList.remove('open'); if(id==='quiz'&&!answered) renderQuiz(); window.scrollTo({top:0,behavior:'smooth'});
}
function toggleMenu(){ document.getElementById('sidebar').classList.toggle('open'); }

function renderQuiz() {
    var q = quizQuestions[currentQuiz], box = document.getElementById('quizBox'); answered = false;
    var answersH = ''; for (var i=0; i<q.a.length; i++) answersH += '<button class="answer" data-ans-index="' + i + '">' + ['أ','ب','ج','د'][i] + '. ' + q.a[i] + '</button>';
    box.innerHTML = '<div class="eyebrow">السؤال ' + (currentQuiz+1) + ' من ' + quizQuestions.length + '</div>' +
    '<div class="progress"><span style="width:' + ((currentQuiz+1)/quizQuestions.length*100) + '%"></span></div>' +
    '<div class="quiz-question">' + q.q + '</div><div class="answers">' + answersH + '</div><div id="quizFeedback"></div>' +
    '<div style="display:flex;justify-content:space-between;gap:10px;margin-top:15px"><span style="color:var(--muted);font-size:12px">النتيجة: ' + score + ' صحيحة</span><button id="nextQuizBtn" class="primary hidden">' + (currentQuiz===quizQuestions.length-1?'إنهاء الاختبار':'السؤال التالي') + ' ←</button></div>';
}
function answerQuiz(i) {
    if(answered) return; answered = true; var q = quizQuestions[currentQuiz];
    var buttons = document.querySelectorAll('.answer'); buttons[q.correct].classList.add('correct');
    if(i === q.correct) { score++; document.getElementById('statScore').textContent = score; } else { buttons[i].classList.add('wrong'); }
    document.getElementById('quizFeedback').innerHTML = '<div class="feedback">' + (i===q.correct?'إجابة صحيحة!':'الإجابة الصحيحة: ' + q.a[q.correct]) + '<br>' + q.why + '</div>';
    document.getElementById('nextQuizBtn').classList.remove('hidden');
}
function nextQuestion() {
    if(currentQuiz < quizQuestions.length-1) { currentQuiz++; renderQuiz(); }
    else { document.getElementById('quizBox').innerHTML = '<div class="course-icon"><i class="fa-solid fa-trophy"></i></div><h2>خلصت الاختبار!</h2><p>إجاباتك الصحيحة: ' + score + ' من ' + quizQuestions.length + '</p><div class="progress"><span style="width:' + (score/quizQuestions.length*100) + '%"></span></div><button id="restartQuizBtn" class="primary">إعادة الاختبار</button>'; }
}
function renderGlossary() {
    var input = document.getElementById('glossarySearch'); var q = input ? input.value.toLowerCase() : ''; var h = '';
    for(var i=0; i<glossary.length; i++) if (glossary[i].join(' ').toLowerCase().indexOf(q) !== -1) h += '<div class="card"><div class="eyebrow">' + glossary[i][0] + '</div><h3>' + glossary[i][1] + '</h3><p>' + glossary[i][2] + '</p></div>';
    document.getElementById('glossaryGrid').innerHTML = h || '<div class="empty">مفيش مصطلحات مطابقة.</div>';
}

function renderChallenges() { 
    var h = ''; 
    for(var i=0; i<challenges.length; i++) {
        h += '<div class="card"><div class="course-icon"><i class="fa-solid fa-flag"></i></div><h3>' + challenges[i].title + '</h3><p>' + challenges[i].desc + '</p><button class="secondary" data-hint-idx="' + i + '">عرض تلميح</button><p id="hint' + i + '" class="hidden" style="margin-top:12px;color:#ff9aa8">' + challenges[i].hint + '</p></div>'; 
    }
    document.getElementById('challengeGrid').innerHTML = h; 
}
function renderRoadmap() {
    var stages = [['1','الأساسيات','مفاهيم الأمن والخصوصية وأنظمة التشغيل'],['2','الشبكات','IP وDNS وHTTP ومبادئ TCP/IP'],['3','Linux وPython','الطرفية والبرمجة وتحليل النصوص'],['4','اختار تخصصًا','ويب أو دفاع سيبراني أو شبكات أو تحليل رقمي'],['5','تدريب آمن','مختبرات قانونية وتحديات CTF تعليمية'],['6','ملف أعمال','تقارير توثيقية ومشروعات دفاعية آمنة']];
    var h = ''; for(var i=0; i<stages.length; i++) h += '<div class="lesson"><div class="lesson-num">' + stages[i][0] + '</div><div><b>' + stages[i][1] + '</b><p>' + stages[i][2] + '</p></div></div>';
    document.getElementById('roadmapList').innerHTML = h;
}

document.addEventListener('DOMContentLoaded', async function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const profileName = document.getElementById('profileUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginNavBtn = document.getElementById('loginNavBtn');

    if(user) {
        if(profileName) profileName.textContent = user.username;
        if(logoutBtn) logoutBtn.style.display = 'block';
        if(loginNavBtn) loginNavBtn.style.display = 'none';
        await loadUserProgress(); 
    } else {
        if(profileName) profileName.textContent = 'متعلم سايبر';
        if(logoutBtn) logoutBtn.style.display = 'none';
        if(loginNavBtn) loginNavBtn.style.display = 'block';
    }

    if(logoutBtn) logoutBtn.addEventListener('click', () => { localStorage.clear(); location.reload(); });
    if(loginNavBtn) loginNavBtn.addEventListener('click', () => openAuthModal('login'));
    
    document.getElementById('closeAuthModal').addEventListener('click', closeAuthModal);
    document.getElementById('closeCourseModal').addEventListener('click', closeCourseModal);
    document.getElementById('loginTab').addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('registerTab').addEventListener('click', () => switchAuthTab('register'));
    document.getElementById('forgotPassLink').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('loginForm').classList.add('hidden'); document.getElementById('resetForm').classList.remove('hidden'); });
    document.getElementById('backToLoginLink').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('resetForm').classList.add('hidden'); document.getElementById('loginForm').classList.remove('hidden'); });

    document.getElementById('eyeLogin').addEventListener('click', function(){ togglePass('loginPassword', this); });
    document.getElementById('eyeReg').addEventListener('click', function(){ togglePass('regPassword', this); });
    document.getElementById('eyeReset').addEventListener('click', function(){ togglePass('resetNewPassword', this); });
    
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
    document.getElementById('resetBtn').addEventListener('click', handleReset);

    loadCourses();
    renderQuiz(); renderGlossary(); renderChallenges(); renderRoadmap(); 
    document.getElementById('statDone').textContent = Math.min(100, Math.round(completed.size/12*100)) + '%';

    document.body.addEventListener('click', function(e) {
        var target = e.target.closest('[data-target]');
        if (target) { e.preventDefault(); showSection(target.getAttribute('data-target')); return; }
        var urlTarget = e.target.closest('[data-url]');
        if (urlTarget) { window.open(urlTarget.getAttribute('data-url'), '_blank'); return; }
        var pathCard = e.target.closest('[data-path-id]');
        if (pathCard && !pathCard.hasAttribute('data-course-id')) { openPath(pathCard.getAttribute('data-path-id')); return; }
        var courseBtn = e.target.closest('[data-course-id]');
        if (courseBtn) { openCourseModal(courseBtn.getAttribute('data-course-id')); return; }
        var tabBtn = e.target.closest('[data-tab-path]');
        if (tabBtn) { setCoursePath(tabBtn.getAttribute('data-tab-path')); return; }
        var ansBtn = e.target.closest('[data-ans-index]');
        if (ansBtn) { answerQuiz(parseInt(ansBtn.getAttribute('data-ans-index'))); return; }
        if (e.target.id === 'nextQuizBtn') { nextQuestion(); return; }
        if (e.target.id === 'restartQuizBtn') { currentQuiz = 0; score = 0; renderQuiz(); return; }
        var hintBtn = e.target.closest('[data-hint-idx]');
        if (hintBtn) { document.getElementById('hint' + hintBtn.getAttribute('data-hint-idx')).classList.toggle('hidden'); return; }
        if (e.target.id === 'menuToggle') { toggleMenu(); return; }
    });

    var courseSearch = document.getElementById('courseSearch');
    if (courseSearch) courseSearch.addEventListener('input', renderCourses);
    var glossarySearch = document.getElementById('glossarySearch');
    if (glossarySearch) glossarySearch.addEventListener('input', renderGlossary);
});
