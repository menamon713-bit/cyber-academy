document.addEventListener('DOMContentLoaded', () => {
    const eyeBtn = document.getElementById('eyeToggle');
    if(eyeBtn) eyeBtn.addEventListener('click', function() {
        let input = document.getElementById('adminPassword');
        input.type = input.type === "password" ? "text" : "password";
        this.innerHTML = input.type === "password" ? "👁️" : "🙈";
    });

    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn) loginBtn.addEventListener('click', function() {
        if (document.getElementById('adminPassword').value.trim() === "MinaAdmin2026") {
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            loadAdminStats(); // جلب إحصائيات المستخدمين
            loadAdminCourses();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    });

    // باقي كود الإضافة والتعديل والحذف زي ما هو
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
            if (!title || !desc) return alert("يرجى ملء جميع الحقول!");
            this.innerText = "جاري الحفظ..."; this.disabled = true;

            let courseData = { title, desc, level, pathId: "basics" };
            try {
                let url = idToEdit ? `/api/courses?id=${idToEdit}` : '/api/courses';
                let method = idToEdit ? 'PUT' : 'POST';
                const response = await fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(courseData) });
                if (response.ok) { resetForm(); alert(idToEdit ? "تم التعديل!" : "تمت الإضافة!"); loadAdminCourses(); }
                else alert("حدث خطأ.");
            } catch (error) { alert("خطأ في الاتصال."); } 
            finally { this.disabled = false; }
        });
    }
    if(cancelEditBtn) cancelEditBtn.addEventListener('click', resetForm);
    function resetForm() {
        document.getElementById('courseTitle').value = ''; document.getElementById('courseDesc').value = '';
        document.getElementById('editCourseId').value = '';
        formTitle.innerText = "إضافة كورس جديد"; addCourseBtn.innerText = "إضافة الكورس للموقع"; cancelEditBtn.style.display = 'none';
    }

    const courseList = document.getElementById('courseList');
    if(courseList) {
        courseList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('edit-btn')) {
                document.getElementById('courseTitle').value = e.target.getAttribute('data-title');
                document.getElementById('courseDesc').value = e.target.getAttribute('data-desc');
                document.getElementById('courseLevel').value = e.target.getAttribute('data-level');
                editCourseId.value = e.target.getAttribute('data-id');
                formTitle.innerText = "تعديل الكورس"; addCourseBtn.innerText = "حفظ التعديلات"; cancelEditBtn.style.display = 'block';
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
            if (e.target.classList.contains('delete-btn')) {
                if(confirm("هل أنت متأكد من الحذف؟")) {
                    const courseId = e.target.getAttribute('data-id');
                    try {
                        const response = await fetch(`/api/courses?id=${courseId}`, { method: 'DELETE' });
                        if (response.ok) { alert("تم الحذف!"); loadAdminCourses(); }
                    } catch (error) { alert("خطأ في الاتصال."); }
                }
            }
        });
    }
});

// دالة جلب الكورسات (زي ما هي)
async function loadAdminCourses() {
    let list = document.getElementById('courseList');
    if(!list) return;
    list.innerHTML = '<p style="color:#777;">جاري التحميل...</p>';
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        list.innerHTML = '';
        if(courses.length === 0) return list.innerHTML = '<p>لا توجد كورسات.</p>';
        courses.forEach((course) => {
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
    } catch (error) { list.innerHTML = '<p style="color:red;">فشل الاتصال.</p>'; }
}

// دالة جديدة لجلب إحصائيات المستخدمين
async function loadAdminStats() {
    try {
        const res = await fetch('/api/courses?admin_users=true&key=MinaAdmin2026');
        if(res.ok) {
            const data = await res.json();
            document.getElementById('totalUsersCount').innerText = data.totalUsers;
            
            let listHTML = '';
            // بنعرض آخر 10 مستخدمين سجلوا
            const recentUsers = data.users.slice(-10).reverse(); 
            recentUsers.forEach(u => {
                listHTML += `<div>👤 ${u.username} <span style="color:#777; font-size:11px;">(${u.email})</span></div>`;
            });
            document.getElementById('userListContainer').innerHTML = listHTML;
        }
    } catch(e) { console.log("Error loading stats", e); }
}
