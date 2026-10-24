document.addEventListener('DOMContentLoaded', () => {

    // 1. زرار العين
    const eyeBtn = document.getElementById('eyeToggle') || document.querySelector('.eye-btn') || document.querySelector('button[type="button"]');
    const passwordInput = document.querySelector('input[type="password"]') || document.getElementById('loginPassword');

    if (eyeBtn && passwordInput) {
        eyeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '👁️' : '🙈';
        });
    }

    // 2. تسجيل الدخول
    const loginForm = document.querySelector('form');
    const loginBtn = document.getElementById('loginBtn') || document.querySelector('button[type="submit"]') || document.querySelector('button');

    const getEmailInput = () => {
        return document.querySelector('input[type="email"]') || 
               document.querySelector('input[placeholder*="الإلكتروني"]') || 
               document.querySelector('input[name="email"]');
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        const emailInput = getEmailInput();
        const email = emailInput ? emailInput.value : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!email || !password) return alert("يرجى إدخال الإيميل والباسورد");

        const originalText = loginBtn ? loginBtn.innerText : 'دخول';
        if (loginBtn) { loginBtn.innerText = "جاري الدخول..."; loginBtn.disabled = true; }

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
                    window.location.href = '/admin.html'; 
                } else {
                    window.location.href = '/course.html'; 
                }
            } else {
                alert(data.message || "بيانات غير صحيحة");
            }
        } catch (error) {
            alert("خطأ في الاتصال بالسيرفر.");
        } finally {
            if (loginBtn) { loginBtn.innerText = originalText; loginBtn.disabled = false; }
        }
    };

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    else if (loginBtn) loginBtn.addEventListener('click', handleLogin);

});
