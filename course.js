document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('coursesContainer');
    const searchInput = document.getElementById('searchInput');
    let allCourses = []; // مصفوفة لحفظ الكورسات عشان البحث

    if (!container) return;

    // 1. جلب الكورسات من الـ API
    try {
        const response = await fetch('/api/courses');
        allCourses = await response.json();

        // لو مفيش كورسات
        if (allCourses.length === 0) {
            container.innerHTML = '<p class="loading">لا توجد كورسات متاحة حالياً. عد قريباً!</p>';
            return;
        }

        // عرض الكورسات أول مرة
        renderCourses(allCourses);

    } catch (error) {
        console.error("Error fetching courses:", error);
        container.innerHTML = '<p class="loading" style="color: #ff304b;">حدث خطأ في تحميل الكورسات. يرجى المحاولة لاحقاً.</p>';
    }

    // 2. دالة عرض الكورسات في الصفحة
    function renderCourses(coursesToRender) {
        container.innerHTML = ''; // مسح أي محتوى قديم

        if (coursesToRender.length === 0) {
            container.innerHTML = '<p class="loading">لا توجد نتائج مطابقة لبحثك.</p>';
            return;
        }

        coursesToRender.forEach(course => {
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
    }

    // 3. منطق البحث (Search)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            // بنفلتر الكورسات حسب الاسم أو الوصف
            const filteredCourses = allCourses.filter(course => 
                course.title.toLowerCase().includes(searchTerm) || 
                course.desc.toLowerCase().includes(searchTerm)
            );
            
            renderCourses(filteredCourses);
        });
    }

    // 4. دالة لما الطالب يدوس "ابدأ التعلم"
    window.startCourse = (courseId, courseTitle) => {
        // هنا ممكن ننقله لصفحة تفاصيل الكورس
        alert(`أنت الآن على وشك بدء كورس: ${courseTitle}`);
        
        // حفظ الكورس اللي اختاره في الـ sessionStorage
        sessionStorage.setItem('currentCourseId', courseId);
        
        // لو عندك صفحة اسمها course-details.html ممكن نستخدم السطر ده:
        // window.location.href = `/course-details.html?id=${courseId}`;
    };
});
