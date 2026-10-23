document.addEventListener('DOMContentLoaded', () => {
    
    // 1. إظهار وإخفاء الباسورد
    const eyeBtn = document.getElementById('eyeToggle');
    if(eyeBtn) {
        eyeBtn.addEventListener('click', function() {
            let input = document.getElementById('adminPassword');
            if (input.type === "password") {
                input.type = "text";
                this.innerHTML = "🙈";
            } else {
                input.type = "password";
                this.innerHTML = "👁️";
            }
        });
    }

    // 2. تسجيل الدخول
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn) {
        loginBtn.addEventListener('click', function() {
            let pass = document.getElementById('adminPassword').value.trim();
            
            if (pass === "MinaAdmin2026") {
                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('adminContent').style.display = 'block';
                loadAdminCourses();
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        });
    }

    // 3. إضافة كورس جديد
    const addCourseBtn = document.getElementById('addCourseBtn');
    if(addCourseBtn) {
        addCourseBtn.addEventListener('click', async function() {
            let title = document.getElementById('courseTitle').value;
            let desc = document.getElementById('courseDesc').value;
            let level = document.getElementById('courseLevel').value;

            if (!title || !desc) {
                alert("يرجى ملء جميع الحقول!");
                return;
            }

            let newCourse = {
                id: "custom-" + Date.now(),
                title: title,
                desc: desc,
                level: level,
                pathId: "basics"
            };

            try {
                this.innerText = "جاري الإضافة...";
                this.disabled = true;
                
                const response = await fetch('/api/courses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCourse)
                });

                if (response.ok) {
                    document.getElementById('courseTitle').value = '';
                    document.getElementById('courseDesc').value = '';
                    alert("تم إضافة الكورس للسيرفر بنجاح!");
                    loadAdminCourses();
                } else {
                    alert("حدث خطأ أثناء الإضافة.");
                }
            } catch (error) {
                alert("خطأ في الاتصال بالسيرفر.");
            } finally {
                this.innerText = "إضافة الكورس للموقع";
                this.disabled = false;
            }
        });
    }
});

// دالة جلب الكورسات
async function loadAdminCourses() {
    let list = document.getElementById('courseList');
    if(!list) return;
    list.innerHTML = '<p style="color:#777;">جاري تحميل الكورسات...</p>';
    
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        
        list.innerHTML = '';
        if(courses.length === 0) {
            list.innerHTML = '<p style="color:#777;">لا توجد كورسات مضافة حتى الآن.</p>';
            return;
        }
        
        courses.forEach((course) => {
            // هنا بنبعت الـ ID بتاع الكورس للدالة عشان تمسحه
            list.innerHTML += `
                <div class="course-item">
                    <div>
                        <strong style="color:#ff304b;">${course.title}</strong> <br>
                        <small style="color:#9a9ba8;">${course.level} - ${course.desc}</small>
                    </div>
                    <button class="delete-btn" onclick="deleteCourse('${course.id}')">حذف</button>
                </div>
            `;
        });
    } catch (error) {
        list.innerHTML = '<p style="color:red;">فشل الاتصال بالسيرفر.</p>';
    }
}

// دالة الحذف الحقيقية (بتبعت طلب للسيرفر)
async function deleteCourse(courseId) {
    if(!confirm("هل أنت متأكد من حذف هذا الكورس نهائياً؟")) return;

    try {
        const response = await fetch(`/api/courses?id=${courseId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert("تم حذف الكورس بنجاح!");
            loadAdminCourses(); // تحديث القائمة
        } else {
            alert("فشل حذف الكورس من السيرفر.");
        }
    } catch (error) {
        alert("خطأ في الاتصال بالسيرفر.");
    }
}
