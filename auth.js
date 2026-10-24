document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form') || document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.querySelector('input[type="email"]') || document.querySelector('input[placeholder*="الإلكتروني"]');
            const passwordInput = document.querySelector('input[type="password"]');
            
            const email = emailInput ? emailInput.value : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!email || !password) return alert("يرجى إدخال الإيميل والباسورد");

            const submitBtn = loginForm.querySelector('button[type="submit"]') || loginForm.querySelector('button');
            const originalText = submitBtn ? submitBtn.innerText : 'دخول';
            if (submitBtn) { submitBtn.innerText = "جاري الدخول..."; submitBtn.disabled = true; }

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
                    
                    if (data.role === 'admin') {
                        sessionStorage.setItem('adminToken', data.token);
                        window.location.href = '/admin.html'; // هيوديك للوحة التحكم
                    } else {
                        window.location.href = '/course.html'; // هيوديك للكورسات
                    }
                } else {
                    alert(data.message || "بيانات غير صحيحة");
                }
            } catch (error) {
                alert("خطأ في الاتصال بالسيرفر");
            } finally {
                if (submitBtn) { submitBtn.innerText = originalText; submitBtn.disabled = false; }
            }
        });
    }
});
