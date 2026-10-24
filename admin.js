document.addEventListener('DOMContentLoaded', () => {
    
    // 1. لو المستخدم عنده توكن متسجل من قبل، يفتحله اللوحة على طول
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

    // 3. تسجيل الدخول (بياخد الإيميل والباسورد ويبعتهم للسيرفر)
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn) loginBtn.addEventListener('click', async function() {
        // ملاحظة: لازم تكون ضفت حقل إيميل في ملف admin.html بمعرف (id) اسمه adminEmail
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

            // لو السيرفر قال إنه أدمن وادانا توكن
            if (response.ok && data.role === 'admin') {
                sessionStorage.setItem('adminToken', data.token); // بنحفظ التوكن في المتصفح
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

    // 4. إضافة كورس جديد
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
                        'Authorization': `Bearer ${token}` // بنبعت التوكن هنا عشان السيرفر يتأكد
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
    
    // ... (باقي كود الـ resetForm والـ delete يفضل زي ما هو)
});

// 5. جلب الإحصائيات (محمي بالتوكن)
async function loadAdminStats() {
    const token = sessionStorage.getItem('adminToken');
    if(!token) return;

    try {
        // شيلنا الباسورد من اللينك، وحطينا التوكن في الهيدر
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
            userListContainer.innerHTML = ''; // تنظيف المكان
            
            // إصلاح ثغرة XSS: استخدمنا innerText بدل innerHTML
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
            sessionStorage.removeItem('adminToken'); // لو التوكن باظ امسحه
            location.reload(); // واعمل تحديث
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
            // هنا كمان استخدمنا innerHTML بس مع تنظيف بسيط (الأفضل استخدام مكتبة DOMPurify)
            // بس للتأمين السريع، هنستخدم النص المباشر بدل الـ HTML
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
