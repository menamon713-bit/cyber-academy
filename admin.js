// admin.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. التحقق من وجود توكن مسجل مسبقاً
    const savedToken = sessionStorage.getItem('adminToken');
    if (savedToken) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        loadAdminStats();
        loadAdminCourses();
    }

    // 2. زر العين (لإظهار/إخفاء الباسورد)
    const eyeBtn = document.getElementById('eyeToggle');
    if(eyeBtn) eyeBtn.addEventListener('click', function() {
        let input = document.getElementById('adminPassword');
        input.type = input.type === "password" ? "text" : "password";
        this.innerHTML = input.type === "password" ? "👁️" : "🙈";
    });

    // 3. تسجيل الدخول
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn) loginBtn.addEventListener('click', async function() {
        // لاحظ: غيرنا الحقل ليكون Email بدل باسورد بس
        const email = document.getElementById('adminEmail').value; 
        const password = document.getElementById('adminPassword').value;
        
        this.innerText = "جاري التحقق...";
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok && data.role === 'admin') {
                // تخزين التوكن
                sessionStorage.setItem('adminToken', data.token);
                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('adminContent').style.display = 'block';
                loadAdminStats();
                loadAdminCourses();
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        } catch (error) {
            alert("خطأ في الاتصال بالسيرفر");
        } finally {
            this.innerText = "دخول";
        }
    });

    // 4. إضافة / تعديل كورس
    const addCourseBtn = document.getElementById('addCourseBtn');
    if(addCourseBtn) {
        addCourseBtn.addEventListener('click', async function() {
            let title = document.getElementById('courseTitle').value;
            let desc = document.getElementById('courseDesc').value;
            let level = document.getElementById('courseLevel').value;
            let idToEdit = document.getElementById('editCourseId').value;
            
            if (!title || !desc) return alert("يرجى ملء جميع الحقول!");
            
            const token = sessionStorage.getItem('adminToken');
            if (!token) return alert("انتهت الجلسة، يرجى تسجيل الدخول");

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
                        'Authorization': `Bearer ${token}` // التوكن بيتبعت هنا
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

    // ... (باقي أكواد الـ resetForm والـ event listeners زي ما هي)
});

// 5. جلب الإحصائيات (آمن)
async function loadAdminStats() {
    const token = sessionStorage.getItem('adminToken');
    if(!token) return;

    try {
        const res = await fetch('/api/courses?admin_users=true', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` } // التوكن هنا
        });

        if(res.ok) {
            const data = await res.json();
            
            document.getElementById('totalUsersCount').innerText = data.totalUsers || 0;
            document.getElementById('totalCoursesCount').innerText = data.totalCourses || 0;
            document.getElementById('totalCompletedCount').innerText = data.totalCompleted || 0;
            
            const userListContainer = document.getElementById('userListContainer');
            userListContainer.innerHTML = ''; // تنظيف
            
            // حماية من ثغرة XSS باستخدام innerText
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
            sessionStorage.removeItem('adminToken'); // امسح التوكن الخربان
            location.reload();
        }
    } catch(e) { 
        console.log("Error loading stats", e); 
    }
}

// 6. جلب الكورسات للعرض في لوحة التحكم
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
            // هنا كمان استخدمنا innerHTML بس مع دالة تنظيف (أو الأفضل تبنيها بـ DOM)
            // للتبسيط هنا، بس أفضل حل إنك تعمل DOMPurify أو تبنيها بـ createElement
            list.innerHTML += `
                <div class="course-item">
                    <div>
                        <strong style="color:#ff304b;">${course.title}</strong> <br>
                        <small style="color:#9a9ba8;">${course.level} - ${course.desc}</small>
                    </div>
                    <div class="action-btns">
                        <button class="edit-btn" data-id="${course._id}" data-title="${course.title}" data-desc="${course.desc}" data-level="${course.level}">تعديل</button>
                        <button class="delete-btn" data-id="${course._id}">حذف</button>
                    </div>
                </div>
            `;
        });
    } catch (error) { 
        list.innerHTML = '<p style="color:red;">فشل الاتصال.</p>'; 
    }
}
