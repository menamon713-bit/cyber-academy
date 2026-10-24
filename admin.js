document.addEventListener('DOMContentLoaded', () => {
    
    // 1. حماية الصفحة: لو مفيش توكن، اطرد المستخدم بره
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/index.html'; 
        return;
    }

    // 2. عرض اللوحة
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
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
            
            const currentToken = sessionStorage.getItem('adminToken');
            if (!currentToken) return alert("انتهت الجلسة");

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
                        'Authorization': `Bearer ${currentToken}`
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
                    const currentToken = sessionStorage.getItem('adminToken');
                    if (!currentToken) return alert("غير مصرح");

                    try {
                        const response = await fetch(`/api/courses?id=${courseId}`, { 
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${currentToken}` }
                        });
                        if (response.ok) { 
                            alert("تم الحذف!"); 
                            loadAdminCourses(); 
                            loadAdminStats(); 
                        } else {
                            alert("فشل الحذف.");
                        }
                    } catch (error) { 
                        alert("خطأ في الاتصال."); 
                    }
                }
            }
        });
    }
});

// 5. جلب الإحصائيات
async function loadAdminStats() {
    const token = sessionStorage.getItem('adminToken');
    if(!token) return;

    try {
        const res = await fetch('/api/courses?admin_users=true', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if(res.ok) {
            const data = await res.json();
            document.getElementById('totalUsersCount').innerText = data.totalUsers || 0;
            document.getElementById('totalCoursesCount').innerText = data.totalCourses || 0;
            document.getElementById('totalCompletedCount').innerText = data.totalCompleted || 0;
            
            const userListContainer = document.getElementById('userListContainer');
            userListContainer.innerHTML = ''; 
            
            (data.users || []).forEach(u => { 
                const userDiv = document.createElement('div');
                userDiv.innerText = `👤 ${u.username} (${u.email})`;
                userDiv.style.color = "#777";
                userDiv.style.fontSize = "12px";
                userListContainer.appendChild(userDiv); 
            });
            
            if (!data.users || data.users.length === 0) {
                userListContainer.innerHTML = '<p style="color:#777; font-size:12px;">لا يوجد مستخدمين بعد.</p>';
            }
        } else if (res.status === 403) {
            alert("غير مصرح لك برؤية هذه البيانات.");
            sessionStorage.removeItem('adminToken');
            window.location.href = '/index.html';
        }
    } catch(e) { 
        console.log("Error loading stats", e); 
    }
}

// 6. جلب الكورسات
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
            const courseItem = document.createElement('div');
            courseItem.className = 'course-item';
            
            const titleStrong = document.createElement('strong');
            titleStrong.style.color = '#ff304b';
            titleStrong.innerText = course.title;
            
            const descSmall = document.createElement('small');
            descSmall.style.color = '#9a9ba8';
            descSmall.innerText = `${course.level} - ${course.desc}`;
            
            const btnContainer = document.createElement('div');
            btnContainer.className = 'action-btns';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerText = 'تعديل';
            editBtn.setAttribute('data-id', course._id);
            editBtn.setAttribute('data-title', course.title);
            editBtn.setAttribute('data-desc', course.desc);
            editBtn.setAttribute('data-level', course.level);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerText = 'حذف';
            deleteBtn.setAttribute('data-id', course._id);
            
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);
            
            courseItem.appendChild(titleStrong);
            courseItem.appendChild(document.createElement('br'));
            courseItem.appendChild(descSmall);
            courseItem.appendChild(btnContainer);
            
            list.appendChild(courseItem);
        });
    } catch (error) { 
        list.innerHTML = '<p style="color:red;">فشل الاتصال.</p>'; 
    }
}
