document.addEventListener('DOMContentLoaded', () => {
    // التبديل بين التابات
    window.switchTab = (tab) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.form-container').forEach(f => f.classList.remove('active'));
        if(tab === 'login') {
            document.querySelectorAll('.tab')[0].classList.add('active');
            document.getElementById('loginFormContainer').classList.add('active');
        } else {
            document.querySelectorAll('.tab')[1].classList.add('active');
            document.getElementById('registerFormContainer').classList.add('active');
        }
    };

    // 1. تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const btn = document.getElementById('loginBtn');
            
            btn.innerText = "جاري الدخول..."; btn.disabled = true;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();

                if (response.ok) {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('role', data.role);
                    
                    if (data.role === 'admin') window.location.href = '/admin.html';
                    else window.location.href = '/dashboard.html';
                } else {
                    alert(data.message || "بيانات غير صحيحة");
                }
            } catch (error) { alert("خطأ في الاتصال"); }
            finally { btn.innerText = "دخول"; btn.disabled = false; }
        });
    }

    // 2. إنشاء حساب
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const btn = document.getElementById('regBtn');
            
            btn.innerText = "جاري الإنشاء..."; btn.disabled = true;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();

                if (response.ok) {
                    alert("تم إنشاء الحساب بنجاح! يمكنك الدخول الآن.");
                    switchTab('login');
                } else {
                    alert(data.message || "حدث خطأ");
                }
            } catch (error) { alert("خطأ في الاتصال"); }
            finally { btn.innerText = "إنشاء حساب"; btn.disabled = false; }
        });
    }
});
