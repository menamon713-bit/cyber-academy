const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');

const MONGO_URI = process.env.MONGO_URI || "حط_لينك_الداتابيز_بتاعتك_هنا_لو_مش_مستخدم_env";

const seedData = async () => {
    await mongoose.connect(MONGO_URI);
    await Course.deleteMany({});
    await Quiz.deleteMany({});

    // إضافة كورس
    const course = await Course.create({
        title: 'أساسيات الأمن السيبراني الشاملة',
        description: 'كورس شامل يبدأ معك من الصفر حتى الاحتراف في مجال الأمن السيبراني.',
        content: 'في هذا الكورس ستتعلم المفاهيم الأساسية للأمن السيبراني، كيفية عمل الشبكات، أنواع الهجمات، طرق الحماية، وأساسيات الاختراق الأخلاقي. الكورس مقسم إلى عدة أقسام تبدأ بالمبتدئين وتنتهي بالمواضيع المتقدمة.',
        level: 'Beginner',
        price: 0
    });

    // توليد 100 سؤال أوتوماتيك
    const questions = [];
    for (let i = 1; i <= 100; i++) {
        questions.push({
            courseId: course._id,
            question: `السؤال رقم ${i}: ما هو المصطلح الصحيح لوصف هذه الحالة في الأمن السيبراني؟`,
            options: ['الخيار الأول', 'الخيار الثاني (الصحيح)', 'الخيار الثالث', 'الخيار الرابع'],
            correctOption: 1 // الخيار التاني هو الصح
        });
    }

    await Quiz.insertMany(questions);
    console.log('✅ تم إضافة الكورس و 100 سؤال بنجاح!');
    process.exit();
};

seedData().catch(err => { console.error(err); process.exit(1); });
