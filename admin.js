// 1. دالة التحقق من كلمة المرور
function checkPassword() {
    let pass = document.getElementById('adminPassword').value;
    
    if (pass === "MinaAdmin2026") {
        // لو الباسورد صح: اخفي نافذة الدخول واظهر المحتوى
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        renderAdminList(); // تحميل الكورسات
    } else {
        // لو غلط: اظهر رسالة الخطأ
        document.getElementById('loginError').style.display = 'block';
    }
}

// 2. تحميل الكورسات من الذاكرة المحلية
let localCourses = JSON.parse(localStorage.getItem('customCourses')) || [];

// 3. دالة عرض الكورسات في القائمة
function renderAdminList() {
    let list = document.getElementById('courseList');
    if(!list) return;
    list.innerHTML = '';
    if(localCourses.length === 0) {
        list.innerHTML = '<p style="color:#777;">لا توجد كورسات مضافة حتى الآن.</p>';
        return;
    }
    localCourses.forEach((course, index) => {
        list.innerHTML += `
            <div class="course-item">
                <div>
                    <strong style="color:#ff304b;">${course.title}</strong> <br>
                    <small style="color:#9a9ba8;">${course.level} - ${course.desc}</small>
                </div>
                <button class="delete-btn" onclick="deleteCourse(${index})">حذف</button>
            </div>
        `;
    });
}

// 4. دالة إضافة كورس جديد
function addCourse() {
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

    localCourses.push(newCourse);
    localStorage.setItem('customCourses', JSON.stringify(localCourses));
    
    // تفريغ الخانات بعد الإضافة
    document.getElementById('courseTitle').value = '';
    document.getElementById('courseDesc').value = '';
    
    renderAdminList();
    alert("تم إضافة الكورس بنجاح!");
}

// 5. دالة الحذف
function deleteCourse(index) {
    if(confirm("هل أنت متأكد من حذف هذا الكورس؟")) {
        localCourses.splice(index, 1);
        localStorage.setItem('customCourses', JSON.stringify(localCourses));
        renderAdminList();
    }
}
