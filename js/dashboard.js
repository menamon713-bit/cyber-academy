document.addEventListener('DOMContentLoaded', async () => {
    // 1. حماية الصفحة
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    
    if (!token) {
        window.location.href = '/login.html'; // لو مش مسجل يطرده
        return;
    }

    if (role === 'admin') {
        window.location.href = '/admin.html'; // لو أدمن يوديه لوحته
        return;
    }

    // 2. جلب الكورسات
    const container = document.getElementById('coursesContainer');
    try {
        const response = await fetch('/api/courses', {
            headers: { 'Authorization': `Bearer ${token}` } // بنبعت التوكن
        });
        const courses = await response.json();

        container.innerHTML = '';
        if (courses.length === 0) {
            container.innerHTML = '<p>لا توجد كورسات متاحة حالياً.</p>';
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <h3>${course.title}</h3>
                <p>${course.desc}</p>
                <div class="course-meta">
                    <span class="badge">${course.level}</span>
                    <button class="start-btn" onclick="startCourse('${course.title}')">ابدأ الكورس</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = '<p style="color:red;">فشل الاتصال بالسيرفر.</p>';
    }
});

// دالة وهمية عشان تظهر الدروس والأسئلة
window.startCourse = (title) => {
    const area = document.getElementById('lessonArea');
    area.style.display = 'block';
    document.getElementById('lessonTitle').innerText = `أنت الآن في: ${title}`;
    document.getElementById('lessonContent').innerText = "هنا سيتم عرض الدروس والفيديوهات والأسئلة الخاصة بهذا الكورس بعد ربطها بقاعدة البيانات.";
    window.scrollTo({ top: area.offsetTop, behavior: 'smooth' });
};

window.logout = () => {
    sessionStorage.clear();
    window.location.href = '/login.html';
};
