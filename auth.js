document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. زرار العين (إظهار/إخفاء الباسورد)
    // ==========================================
    // بندور على زرار العين أو أي أيقونة عين في الصفحة
    const eyeBtn = document.getElementById('eyeToggle') || 
                   document.querySelector('.eye-btn') || 
                   document.querySelector('button[type="button"]');
    
    // بندور على حقل الباسورد
    const passwordInput = document.querySelector('input[type="password"]') || 
                          document.getElementById('loginPassword');

    if (eyeBtn && passwordInput) {
        eyeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // بنعكس النوع (لو باسورد يبقى نص والعكس)
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            // بنغير شكل الأيقونة
            this.innerHTML = type === 'password' ? '👁️' : '🙈';
        });
    }

    // ==========================================
    // 2. تسجيل الدخول
    // ==========================================
    // بندور على الفورم أو زرار الدخول
    const loginForm = document.querySelector('form') || document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn') || document.querySelector('button[type="submit"]');

    // دالة ذكية بتدور على حقل الإيميل
    const getEmailInput = () => {
        return document.querySelector('input[type="email"]') || 
               document.querySelector('input[placeholder*="الإلكتروني"]') || 
               document.querySelector('input[name="email"]') ||
               document.querySelector('input[placeholder*="البريد"]');
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault(); // بنمنع الصفحة إنها تعمل ريفريش

        const emailInput = getEmailInput();
        const email = emailInput ? emailInput.value : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!email || !password) return alert("يرجى إدخال الإيميل والباسورد");

        // تغيير شكل الزرار
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
                // حفظ التوكن
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('role', data.role);
                
                if (data.role === 'admin') {
                    sessionStorage.setItem('adminToken', data.token); // مهم جداً لصفحة الأدمن
                    window.location.href = '/admin.html'; 
                } else {
                    window.location.href = '/course.html'; 
                }
            } else {
                alert(data.message || "بيانات غير صحيحة");
            }
        } catch (error) {
            alert("خطأ في الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت.");
        } finally {
            if (loginBtn) { loginBtn.innerText = originalText; loginBtn.disabled = false; }
        }
    };

    // لو فيه فورم، نربط الدالة بـ submit
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } 
    // لو مفيش فورم بس فيه زرار، نربط الدالة بالكليك
    else if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }

});
