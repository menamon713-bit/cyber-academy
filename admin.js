// 1. كلمة سر بسيطة (مؤقتة) لحماية الصفحة
let password = prompt("أدخل كلمة مرور المدير:");
if (password !== "MinaAdmin2026") {
    document.body.innerHTML = "<h1 style='color:red;text-align:center;margin-top:50px;'>ممنوع الدخول! أنت لست المدير.</h1>";
    throw new Error("Unauthorized");
}

// 2. تحميل الكورسات المضافة من ذاكرة المتصفح
let localCourses = JSON.parse(localStorage.getItem('customCourses')) || [];

// 3. دالة عرض الكورسات في القائمة
function renderAdminList() {
    let list = document.getElementById('courseList');
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
    alert("تم إضافة الكورس بنجاح! (محفوظ في متصفحك مؤقتاً)");
}

// 5. دالة الحذف
function deleteCourse(index) {
    if(confirm("هل أنت متأكد من حذف هذا الكورس؟")) {
        localCourses.splice(index, 1);
        localStorage.setItem('customCourses', JSON.stringify(localCourses));
        renderAdminList();
    }
}

// تشغيل الدالة أول ما الصفحة تفتح
renderAdminList();
