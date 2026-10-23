// دالة إظهار وإخفاء الباسورد
function togglePassword() {
    let input = document.getElementById('adminPassword');
    let icon = document.getElementById('eyeToggle');
    
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash'); // شكل العين المشطوبة
    } else {
        input.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye'); // شكل العين المفتوحة
    }
}

// دالة التحقق من كلمة المرور
function checkPassword() {
    let pass = document.getElementById('adminPassword').value;
    
    // كلمة المرور الافتراضية
    if (pass === "MinaAdmin2026") {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        renderAdminList(); 
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

let localCourses = JSON.parse(localStorage.getItem('customCourses')) || [];

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
    
    document.getElementById('courseTitle').value = '';
    document.getElementById('courseDesc').value = '';
    
    renderAdminList();
    alert("تم إضافة الكورس بنجاح!");
}

function deleteCourse(index) {
    if(confirm("هل أنت متأكد من حذف هذا الكورس؟")) {
        localCourses.splice(index, 1);
        localStorage.setItem('customCourses', JSON.stringify(localCourses));
        renderAdminList();
    }
}
