// admin.js
document.addEventListener('DOMContentLoaded', () => {
    // دالة تسجيل الدخول
    const loginBtn = document.getElementById('loginBtn');
    if(loginBtn) loginBtn.addEventListener('click', async function() {
        const email = document.getElementById('adminEmail').value; // غيرنا لـ Email
        const password = document.getElementById('adminPassword').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok && data.role === 'admin') {
                // تخزين التوكن الآمن في الجلسة (أو LocalStorage)
                sessionStorage.setItem('adminToken', data.token);
                document.getElementById('loginModal').style.display = 'none';
                document.getElementById('adminContent').style.display = 'block';
                loadAdminStats();
                loadAdminCourses();
            } else {
                alert("بيانات غير صحيحة أو ليس لديك صلاحيات");
            }
        } catch (error) {
            alert("خطأ في الاتصال بالسيرفر");
        }
    });

    // دالة إضافة كورس
    const addCourseBtn = document.getElementById('addCourseBtn');
    if(addCourseBtn) {
        addCourseBtn.addEventListener('click', async function() {
            // ... (نفس كود جمع البيانات)
            
            const token = sessionStorage.getItem('adminToken');
            if (!token) return alert("انتهت الجلسة، يرجى تسجيل الدخول");

            try {
                let url = idToEdit ? `/api/courses?id=${idToEdit}` : '/api/courses';
                let method = idToEdit ? 'PUT' : 'POST';
                
                const response = await fetch(url, { 
                    method: method, 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // هنا بنبعت التوكن
                    }, 
                    body: JSON.stringify(courseData) 
                });
                
                if (response.ok) { /* ... */ }
                else if (response.status === 403) { alert("غير مصرح"); }
            } catch (error) { /* ... */ }
        });
    }
});

async function loadAdminStats() {
    const token = sessionStorage.getItem('adminToken');
    if(!token) return;

    try {
        // شيلنا الباسورد من اللينك، وحطينا التوكن في الهيدر
        const res = await fetch('/api/courses?admin_users=true', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if(res.ok) {
            const data = await res.json();
            // ... (تحديث الواجهة)
            
            // إصلاح ثغرة XSS باستخدام innerText بدل innerHTML
            let listHTML = '';
            (data.users || []).forEach(u => { 
                const userDiv = document.createElement('div');
                userDiv.innerText = `👤 ${u.username} (${u.email})`;
                // ... 
            });
            document.getElementById('userListContainer').appendChild(userDiv);
        }
    } catch(e) { console.log("Error", e); }
}
