// دالة إظهار وإخفاء الباسورد
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type = 'text';
        // شكل العين المشطوبة (إخفاء)
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>';
    } else {
        input.type = 'password';
        // شكل العين المفتوحة
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // تسجيل الدخول
    // ==========================================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // منع الريفريش

            const btn = loginForm.querySelector('button[type="submit"]');
            const errorMsg = document.getElementById('error-msg');
            
            btn.textContent = 'جاري الدخول...'; 
            btn.disabled = true;
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
                    errorMsg.textContent = data.error; 
                    errorMsg.classList.remove('hidden');
                    btn.textContent = 'دخول'; 
                    btn.disabled = false;
                }
            } catch (err) { 
                errorMsg.textContent = 'خطأ في الاتصال بالسيرفر'; 
                errorMsg.classList.remove('hidden');
                btn.textContent = 'دخول'; 
                btn.disabled = false;
            }
        });
    }

    // ==========================================
    // إنشاء حساب
    // ==========================================
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // منع الريفريش

            const btn = registerForm.querySelector('button[type="submit"]');
            const errorMsg = document.getElementById('error-msg');
            
            btn.textContent = 'جاري التسجيل...'; 
            btn.disabled = true;
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
                    errorMsg.textContent = data.error; 
                    errorMsg.classList.remove('hidden');
                    btn.textContent = 'إنشاء الحساب'; 
                    btn.disabled = false;
                }
            } catch (err) {
                errorMsg.textContent = 'خطأ في الاتصال بالسيرفر'; 
                errorMsg.classList.remove('hidden');
                btn.textContent = 'إنشاء الحساب'; 
                btn.disabled = false;
            }
        });
    }
});
