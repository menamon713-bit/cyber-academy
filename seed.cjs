const mongoose = require('mongoose');
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');

// ⚠️ حط اللينك بتاعك هنا
const MONGO_URI = "mongodb+srv://menaalmoshaks_db_user:HzB8jhAFfF5slU9v@cyberacademy.86qltgk.mongodb.net/cyber-academy?retryWrites=true&w=majority";

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ متصل بالداتابيز...');

        await Course.deleteMany({});
        await Quiz.deleteMany({});
        console.log('🗑️ تم مسح البيانات القديمة...');

        const paths = ['أساسيات الأمن السيبراني', 'الفريق الأحمر - Red Team', 'الفريق الأزرق - Blue Team'];
        const ytLinks = [
            'https://www.youtube.com/watch?v=3Kq1MIfTWCE', // فيديو أساسيات
            'https://www.youtube.com/watch?v=3Kq1MIfTWCE', // فيديو ريد تيم (مثال)
            'https://www.youtube.com/watch?v=3Kq1MIfTWCE'  // فيديو بلو تيم (مثال)
        ];

        let courseCount = 0;
        let quizCount = 0;

        for (let i = 0; i < 36; i++) {
            const pathIndex = Math.floor(i / 12); // 0, 1, 2
            const pathName = paths[pathIndex];
            const level = pathIndex === 0 ? 'Beginner' : 'Intermediate';

            const course = await Course.create({
                title: `${pathName} - الدرس ${i + 1}`,
                description: `درس شامل في مسار ${pathName} يغطي مفاهيم متقدمة وأدوات عملية.`,
                content: `مرحباً بك في الدرس رقم ${i + 1} من مسار ${pathName}.\n\nفي هذا الدرس سنتعلم:\n1. المفاهيم الأساسية والمصطلحات.\n2. التطبيق العملي والأدوات المستخدمة.\n3. كيفية الحماية والاستجابة.\n\n(يمكنك تعديل هذا النص في الداتابيز لاحقاً لوضع الشرح المفصل الخاص بك).`,
                videoUrl: ytLinks[pathIndex], // لينك اليوتيوب
                level: level,
                price: pathIndex === 0 ? 0 : 49
            });
            courseCount++;

            // إضافة سؤالين لكل كورس
            await Quiz.create([
                {
                    courseId: course._id,
                    question: `السؤال الأول في درس ${i + 1}: ما هو الهدف الأساسي من هذا الدرس؟`,
                    options: ['الفهم النظري', 'التطبيق العملي', 'الحفظ والتلقين', 'جميع ما سبق'],
                    correctOption: 3,
                    explanation: 'الهدف هو الجمع بين الفهم النظري والتطبيق العملي للوصول لاحتراف المجال.'
                },
                {
                    courseId: course._id,
                    question: `السؤال الثاني في درس ${i + 1}: كيف يمكن حماية النظام من الثغرات الشائعة؟`,
                    options: ['تجاهل التحديثات', 'استخدام كلمات مرور ضعيفة', 'تحديث الأنظمة وتطبيق المبادئ الأمنية', 'فتح كل المنافذ'],
                    correctOption: 2,
                    explanation: 'التحديث المستمر وتطبيق سياسات الأمان (مثل كلمات المرور القوية) هو خط الدفاع الأول.'
                }
            ]);
            quizCount += 2;
        }

        console.log(`🎉 تم إضافة ${courseCount} كورس و ${quizCount} سؤال بنجاح!`);
        process.exit();
    } catch (err) {
        console.error('❌ خطأ:', err.message);
        process.exit(1);
    }
};

seedData();
