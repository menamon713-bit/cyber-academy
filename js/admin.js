document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    // 1. حماية الصفحة بـ 404
    if (!token || role !== 'admin') {
        document.documentElement.innerHTML = `
            <!DOCTYPE html><html><head><title>404</title></head>
            <body style="background:#08090d; color:#ff304b; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;">
                <h1 style="font-size:100px;">404 Not Found</h1>
            </body></html>
        `;
        return;
    }

    // 2. عرض المحتوى
    document.getElementById('adminContent').style.display = 'block';
    loadStats();
    loadCourses();

    // 3. إضافة كورس
    document.getElementById('addCourseBtn').addEventListener('click', async function() {
        const title = document.getElementById('courseTitle').value;
        const desc = document.getElementById('courseDesc').value;
        const level = document.getElementById('courseLevel').value;
        
        if (!title || !desc) return alert("املأ الحقول!");
        
        this.innerText = "جاري الإضافة..."; this.disabled = true;

        try {
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title, desc, level, pathId: "basics" })
            });
            if (response.ok) {
                alert("تمت الإضافة!"); 
                document.getElementById('courseTitle').value = '';
                document.getElementById('courseDesc').value = '';
                loadCourses(); loadStats();
            } else { alert("خطأ في الإضافة"); }
        } catch (e) { alert("خطأ في الاتصال"); }
        finally { this.innerText = "إضافة الكورس"; this.disabled = false; }
    });
});

async function loadStats() {
    const token = sessionStorage.getItem('token');
    try {
        const res = await fetch('/api/courses?admin_users=true', { headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) {
            const data = await res.json();
            document.getElementById('totalUsersCount').innerText = data.totalUsers;
            document.getElementById('totalCoursesCount').innerText = data.totalCourses;
            
            const list = document.getElementById('userListContainer');
            list.innerHTML = '<h4>الطلاب المسجلين:</h4>';
            data.users.forEach(u => { list.innerHTML += `<div>👤 ${u.username} (${u.email})</div>`; });
        }
    } catch(e) { console.log(e); }
}

async function loadCourses() {
    const token = sessionStorage.getItem('token');
    const list = document.getElementById('courseList');
    try {
        const res = await fetch('/api/courses', { headers: { 'Authorization': `Bearer ${token}` } });
        const courses = await res.json();
        list.innerHTML = courses.length === 0 ? '<p>لا توجد كورسات.</p>' : '';
        
        courses.forEach(course => {
            list.innerHTML += `
                <div class="course-item">
                    <div><strong>${course.title}</strong> - ${course.level}</div>
                    <button class="delete-btn" onclick="deleteCourse('${course._id}')">حذف</button>
                </div>
            `;
        });
    } catch(e) { console.log(e); }
}

window.deleteCourse = async (id) => {
    if(!confirm("تأكيد الحذف؟")) return;
    const token = sessionStorage.getItem('token');
    try {
        const res = await fetch(`/api/courses?id=${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) { loadCourses(); loadStats(); }
    } catch(e) { alert("خطأ"); }
};

window.logout = () => {
    sessionStorage.clear();
    window.location.href = '/login.html';
};
