document.addEventListener('DOMContentLoaded', () => {
    
    // 1. الحماية: لو مفيش توكن في المتصفح، اطرد المستخدم لصفحة تسجيل الدخول فوراً
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/auth.html'; // طرده لصفحة الدخول
        return; // وقف تنفيذ أي كود تاني
    }

    // 2. لو فيه توكن، ابدأ حمل البيانات
    loadAdminStats();
    loadAdminCourses();

    // 3. إضافة/تعديل كورس
    const addCourseBtn = document.getElementById('addCourseBtn');
    if(addCourseBtn) {
        addCourseBtn.addEventListener('click', async function() {
            let title = document.getElementById('courseTitle').value;
            let desc = document.getElementById('courseDesc').value;
            let level = document.getElementById('courseLevel').value;
            let idToEdit = document.getElementById('editCourseId').value;
            
            if (!title || !desc) return alert("يرجى ملء جميع الحقول!");
            
            this.innerText = "جاري الحفظ..."; 
            this.disabled = true;

            let courseData = { title, desc, level, pathId: "basics" };
            try {
                let url = idToEdit ? `/api/courses?id=${idToEdit}` : '/api/courses';
                let method = idToEdit ? 'PUT' : 'POST';
                
                const response = await fetch(url, { 
                    method: method, 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // بنبعت التوكن
                    }, 
                    body: JSON.stringify(courseData) 
                });
                
                if (response.ok) { 
                    resetForm(); 
                    alert(idToEdit ? "تم التعديل!" : "تمت الإضافة!"); 
                    loadAdminCourses(); 
                    loadAdminStats(); 
                } else {
                    alert("حدث خطأ أو غير مصرح.");
                }
            } catch (error) { 
                alert("خطأ في الاتصال."); 
            } finally { 
                this.disabled = false; 
                this.innerText = idToEdit ? "حفظ التعديلات" : "إضافة الكورس للموقع"; 
            }
        });
    }

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if(cancelEditBtn) cancelEditBtn.addEventListener('click', resetForm);

    function resetForm() {
        document.getElementById('courseTitle').value = ''; 
        document.getElementById('courseDesc').value = '';
        document.getElementById('editCourseId').value = '';
        document.getElementById('formTitle').innerText = "إضافة كورس جديد"; 
        document.getElementById('addCourseBtn').innerText = "إضافة الكورس للموقع"; 
        document.getElementById('cancelEditBtn').style.display = 'none';
    }

    // 4. أزرار التعديل والحذف
    const courseList = document.getElementById('courseList');
    if(courseList) {
        courseList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('edit-btn')) {
                document.getElementById('courseTitle').value = e.target.getAttribute('data-title');
                document.getElementById('courseDesc').value = e.target.getAttribute('data-desc');
                document.getElementById('courseLevel').value = e.target.getAttribute('data-level');
                document.getElementById('editCourseId').value = e.target.getAttribute('data-id');
                document.getElementById('formTitle').innerText = "تعديل الكورس"; 
                document.getElementById('addCourseBtn').innerText = "حفظ التعديلات"; 
                document.getElementById('cancelEditBtn').style.display = 'block';
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
            if (e.target.classList.contains('delete-btn')) {
                if(confirm("هل أنت متأكد من الحذف؟")) {
                    const courseId = e.target.getAttribute('data-id');
                    try {
                        const response = await fetch(`/api/courses?id=${courseId}`, { 
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (response.ok) { 
                            alert("تم الحذف!"); 
                            loadAdminCourses(); 
                            loadAdminStats(); 
                        }
                    } catch (error) { alert("خطأ في الاتصال."); }
                }
            }
        });
    }
});

// دوال جلب البيانات
async function loadAdminStats() {
    const token = sessionStorage.getItem('adminToken');
    if(!token) return;

    try {
        const res = await fetch('/api/courses?admin_users=true', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(res.ok) {
            const data = await res.json();
            document.getElementById('totalUsersCount').innerText = data.totalUsers || 0;
            document.getElementById('totalCoursesCount').innerText = data.totalCourses || 0;
            
            const userListContainer = document.getElementById('userListContainer');
            userListContainer.innerHTML = ''; 
            (data.users || []).forEach(u => { 
                const userDiv = document.createElement('div');
                userDiv.innerText = `👤 ${u.username} (${u.email})`;
                userListContainer.appendChild(userDiv); 
            });
        }
    } catch(e) { console.log(e); }
}

async function loadAdminCourses() {
    let list = document.getElementById('courseList');
    if(!list) return;
    
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        list.innerHTML = '';
        if(courses.length === 0) return list.innerHTML = '<p>لا توجد كورسات.</p>';
        
        courses.forEach((course) => {
            const courseItem = document.createElement('div');
            courseItem.className = 'course-item';
            courseItem.innerHTML = `
                <div>
                    <strong style="color:#ff304b;">${course.title}</strong> <br>
                    <small style="color:#9a9ba8;">${course.level} - ${course.desc}</small>
                </div>
                <div class="action-btns">
                    <button class="edit-btn" data-id="${course._id}" data-title="${course.title}" data-desc="${course.desc}" data-level="${course.level}">تعديل</button>
                    <button class="delete-btn" data-id="${course._id}">حذف</button>
                </div>
            `;
            list.appendChild(courseItem);
        });
    } catch (error) { list.innerHTML = '<p style="color:red;">فشل الاتصال.</p>'; }
}
