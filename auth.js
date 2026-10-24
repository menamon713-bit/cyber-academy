document.addEventListener('DOMContentLoaded', () => {
    // 1. زرار العين
    const eyeBtn = document.querySelector('.eye-btn') || document.getElementById('eyeToggle');
    const passwordInput = document.querySelector('input[type="password"]');
    if (eyeBtn && passwordInput) {
        eyeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            this.innerHTML = passwordInput.type === "password" ? '👁️' : '🙈';
        });
    }

    // 2. تسجيل الدخول
    const loginBtn = document.querySelector('button[type="submit"]') || document.getElementById('loginBtn');
    const emailInput = document.querySelector('input[type="email"]') || document.querySelector('input[placeholder*="الإلكتروني"]');

    if (loginBtn) {
        loginBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const email = emailInput ? emailInput.value : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!email || !password) return alert("يرجى إدخال الإيميل والباسورد");

            const originalText = this.innerText;
            this.innerText = "جاري الدخول...";
            this.disabled = true;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // حفظ التوكن باسم adminToken عشان صفحة الأدمن تلاقيه
                    sessionStorage.setItem('adminToken', data.token);
                    sessionStorage.setItem('role', data.role);
                    
                    if (data.role === 'admin') {
                        window.location.href = '/admin.html'; // التحويل للوحة
                    } else {
                        window.location.href = '/course.html'; // التحويل للطالب
                    }
                } else {
                    alert(data.message || "بيانات غير صحيحة");
                    this.innerText = originalText;
                    this.disabled = false;
                }
            } catch (error) {
                alert("خطأ في الاتصال بالسيرفر");
                this.innerText = originalText;
                this.disabled = false;
            }
        });
    }
});
