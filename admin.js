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

    // 3. إضافة أو تعديل كورس
    const addCourseBtn = document.getElementById('addCourseBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const formTitle = document.getElementById('formTitle');
    const editCourseId = document.getElementById('editCourseId');

    if(addCourseBtn) {
        addCourseBtn.addEventListener('click', async function() {
            let title = document.getElementById('courseTitle').value;
            let desc = document.getElementById('courseDesc').value;
            let level = document.getElementById('courseLevel').value;
            let idToEdit = editCourseId.value;

            if (!title || !desc) {
                alert("يرجى ملء جميع الحقول!");
                return;
            }

            let courseData = {
                title: title,
                desc: desc,
                level: level,
                pathId: "basics"
            };

            try {
                this.innerText = idToEdit ? "جاري الحفظ..." : "جاري الإضافة...";
                this.disabled = true;
                
                let url = '/api/courses';
                let method = 'POST';

                if (idToEdit) {
                    url = `/api/courses?id=${idToEdit}`;
                    method = 'PUT';
                }

                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(courseData)
                });

                if (response.ok) {
                    resetForm();
                    alert(idToEdit ? "تم تعديل الكورس بنجاح!" : "تم إضافة الكورس بنجاح!");
                    loadAdminCourses();
                } else {
                    alert("حدث خطأ.");
                }
            } catch (error) {
                alert("خطأ في الاتصال بالسيرفر.");
            } finally {
                this.disabled = false;
            }
        });
    }

    if(cancelEditBtn) {
        cancelEditBtn.addEventListener('click', resetForm);
    }

    function resetForm() {
        document.getElementById('courseTitle').value = '';
        document.getElementById('courseDesc').value = '';
        document.getElementById('editCourseId').value = '';
        formTitle.innerText = "إضافة كورس جديد";
        addCourseBtn.innerText = "إضافة الكورس للموقع";
        cancelEditBtn.style.display = 'none';
    }

    // 4. تفويض الأحداث لزرار الحذف والتعديل
    const courseList = document.getElementById('courseList');
    if(courseList) {
        courseList.addEventListener('click', async (e) => {
            
            // تعديل الكورس
            if (e.target.classList.contains('edit-btn')) {
                document.getElementById('courseTitle').value = e.target.getAttribute('data-title');
                document.getElementById('courseDesc').value = e.target.getAttribute('data-desc');
                document.getElementById('courseLevel').value = e.target.getAttribute('data-level');
                editCourseId.value = e.target.getAttribute('data-id');
                
                formTitle.innerText = "تعديل الكورس الحالي";
                addCourseBtn.innerText = "حفظ التعديلات";
                cancelEditBtn.style.display = 'block';
                window.scrollTo({top: 0, behavior: 'smooth'}); // نطلع فوق عشان نشوف الفورم
            }

            // حذف الكورس
            if (e.target.classList.contains('delete-btn')) {
                const courseId = e.target.getAttribute('data-id');
                
                if(confirm("هل أنت متأكد من حذف هذا الكورس نهائياً؟")) {
                    try {
                        e.target.innerText = "...";
                        e.target.disabled = true;

                        const response = await fetch(`/api/courses?id=${courseId}`, { method: 'DELETE' });

                        if (response.ok) {
                            alert("تم حذف الكورس بنجاح!");
                            loadAdminCourses();
                        } else {
                            alert("فشل الحذف.");
                            e.target.innerText = "حذف";
                            e.target.disabled = false;
                        }
                    } catch (error) {
                        alert("خطأ في الاتصال.");
                        e.target.innerText = "حذف";
                        e.target.disabled = false;
                    }
                }
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
            // بنبعت البيانات كـ data-attributes عشان الكود يقراها
            list.innerHTML += `
                <div class="course-item">
                    <div>
                        <strong style="color:#ff304b;">${course.title}</strong> <br>
                        <small style="color:#9a9ba8;">${course.level} - ${course.desc}</small>
                    </div>
                    <div class="action-btns">
                        <button class="edit-btn" data-id="${course.id}" data-title="${course.title}" data-desc="${course.desc}" data-level="${course.level}">تعديل</button>
                        <button class="delete-btn" data-id="${course.id}">حذف</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        list.innerHTML = '<p style="color:red;">فشل الاتصال بالسيرفر.</p>';
    }
}
