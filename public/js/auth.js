document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            const errorMsg = document.getElementById('error-msg');
            btn.textContent = 'جاري الدخول...'; btn.disabled = true;
            errorMsg.classList.add('hidden');

            try {
                const res = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'login',
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    window.location.href = '/dashboard.html';
                } else {
                    errorMsg.textContent = data.error; errorMsg.classList.remove('hidden');
                    btn.textContent = 'دخول'; btn.disabled = false;
                }
            } catch (err) { 
                errorMsg.textContent = 'خطأ في الاتصال'; errorMsg.classList.remove('hidden');
                btn.textContent = 'دخول'; btn.disabled = false;
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = registerForm.querySelector('button[type="submit"]');
            const errorMsg = document.getElementById('error-msg');
            btn.textContent = 'جاري التسجيل...'; btn.disabled = true;
            errorMsg.classList.add('hidden');

            try {
                const res = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'register',
                        email: document.getElementById('email').value,
                        password: document.getElementById('password').value
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('تم إنشاء الحساب بنجاح!');
                    window.location.href = '/login.html';
                } else {
                    errorMsg.textContent = data.error; errorMsg.classList.remove('hidden');
                    btn.textContent = 'إنشاء الحساب'; btn.disabled = false;
                }
            } catch (err) {
                errorMsg.textContent = 'خطأ في الاتصال'; errorMsg.classList.remove('hidden');
                btn.textContent = 'إنشاء الحساب'; btn.disabled = false;
            }
        });
    }
});
