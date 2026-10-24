document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('coursesContainer');
    if (!container) return;

    try {
        // بنجيب الكورسات من السيرفر (الـ API بتاعنا)
        const response = await fetch('/api/courses');
        const courses = await response.json();

        // لو مفيش كورسات
        if (courses.length === 0) {
            container.innerHTML = '<p class="loading" style="grid-column: 1/-1;">لا توجد كورسات متاحة حالياً. عد قريباً!</p>';
            return;
        }

        // بنفضي المكان من كلمة "جاري التحميل"
        container.innerHTML = '';

        // بنلف على كل كورس ونعمله كارت
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            
            card.innerHTML = `
                <div>
                    <h3>${course.title}</h3>
                    <p>${course.desc}</p>
                </div>
                <div class="course-meta">
                    <span class="level-badge">${course.level}</span>
                    <button class="start-btn" onclick="startCourse('${course._id}', '${course.title}')">ابدأ التعلم</button>
                </div>
            `;
            
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching courses:", error);
        container.innerHTML = '<p class="loading" style="grid-column: 1/-1; color: #ff304b;">حدث خطأ في تحميل الكورسات. يرجى المحاولة لاحقاً.</p>';
    }
});

// دالة بتتنفذ لما الطالب يدوس "ابدأ التعلم"
function startCourse(courseId, courseTitle) {
    // هنا ممكن نوديه لصفحة الكورس نفسه، أو ننبهه
    // دلوقتي هنعمل تنبيه بسيط للتجربة
    alert(`أنت الآن على وشك بدء كورس: ${courseTitle}`);
    
    // ممكن تحفظ الكورس اللي اختاره في الـ sessionStorage
    sessionStorage.setItem('currentCourseId', courseId);
    
    // أو تحوله لصفحة تانية (لو موجودة عندك)
    // window.location.href = `/course-details.html?id=${courseId}`;
}
