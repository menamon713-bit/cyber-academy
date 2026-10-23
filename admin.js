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
                renderAdminList(); 
            } else {
                document.getElementById('loginError').style.display = 'block';
            }
        });
    }

    // 3. إدارة الكورسات
    let localCourses = [];
    try {
        localCourses = JSON.parse(localStorage.getItem('customCourses')) || [];
    } catch(e) {}

    const addCourseBtn = document.getElementById('addCourseBtn');
    if(addCourseBtn) {
        addCourseBtn.addEventListener('click', function() {
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
        });
    }
});

// دوال العرض (برة الـ DOMContentLoaded عشان تكون متاحة)
function renderAdminList() {
    let list = document.getElementById('courseList');
    if(!list) return;
    list.innerHTML = '';
    
    let localCourses = JSON.parse(localStorage.getItem('customCourses')) || [];
    
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

function deleteCourse(index) {
    if(confirm("هل أنت متأكد من حذف هذا الكورس؟")) {
        let localCourses = JSON.parse(localStorage.getItem('customCourses')) || [];
        localCourses.splice(index, 1);
        localStorage.setItem('customCourses', JSON.stringify(localCourses));
        renderAdminList();
    }
}
