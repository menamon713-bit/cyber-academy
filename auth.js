document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const eyeBtn = document.getElementById('eyeToggle');
    const passwordInput = document.getElementById('loginPassword');
    const emailInput = document.getElementById('loginEmail');

    // 1. زرار العين
    if (eyeBtn && passwordInput) {
        eyeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            this.innerHTML = passwordInput.type === "password" ? '👁️' : '🙈';
        });
    }

    // 2. تسجيل الدخول
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) return alert("يرجى إدخال الإيميل والباسورد");

            const originalText = loginBtn.innerText;
            loginBtn.innerText = "جاري الدخول...";
            loginBtn.disabled = true;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // حفظ التوكن
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('role', data.role);
                    
                    if (data.role === 'admin') {
                        sessionStorage.setItem('adminToken', data.token);
                        window.location.href = '/admin.html'; // توجيه للأدمن
                    } else {
                        window.location.href = '/course.html'; // توجيه للطالب
                    }
                } else {
                    alert(data.message || "بيانات غير صحيحة");
                    loginBtn.innerText = originalText;
                    loginBtn.disabled = false;
                }
            } catch (error) {
                alert("خطأ في الاتصال بالسيرفر");
                loginBtn.innerText = originalText;
                loginBtn.disabled = false;
            }
        });
    }
});
