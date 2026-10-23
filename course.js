document.addEventListener('DOMContentLoaded', async () => {
    // بنجيب الـ ID من الرابط (مثلاً course.html?id=basics-0)
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    
    const container = document.getElementById('courseContent');

    if (!courseId) {
        container.innerHTML = '<h1>خطأ</h1><p>لم يتم تحديد كورس.</p><a href="/" class="back-btn">العودة للرئيسية</a>';
        return;
    }

    try {
        // بنجيب كل الكورسات وبعدين ندور على الكورس اللي ليه نفس الـ ID
        const response = await fetch('/api/courses');
        const courses = await response.json();
        
        const course = courses.find(c => c.id === courseId);

        if (!course) {
            container.innerHTML = '<h1>غير موجود</h1><p>هذا الكورس غير موجود أو تم حذفه.</p><a href="/" class="back-btn">العودة للرئيسية</a>';
            return;
        }

        // بنرسم الصفحة بالبيانات اللي لقيناها
        container.innerHTML = `
            <div class="chip">${course.level}</div>
            <h1>${course.title}</h1>
            <p>${course.desc}</p>
            
            <a href="https://www.youtube.com/@SecureTheHumans" target="_blank" class="video-btn">
                <i class="fa-brands fa-youtube"></i> شاهد محتوى الكورس على يوتيوب
            </a>
            
            <a href="/" class="back-btn">← العودة للصفحة الرئيسية</a>
        `;
        
    } catch (error) {
        container.innerHTML = '<h1>خطأ</h1><p>حدث خطأ أثناء تحميل البيانات.</p><a href="/" class="back-btn">العودة للرئيسية</a>';
    }
});
