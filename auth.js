document.addEventListener('DOMContentLoaded', () => {
    
    // دالة ذكية بتدور على الحقول مهما كان شكلها
    const getField = (type, placeholder) => {
        return document.querySelector(`input[type="${type}"]`) || 
               document.querySelector(`input[placeholder*="${placeholder}"]`) || 
               document.querySelector(`#${type}`);
    };

    // 1. تسجيل الدخول
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = getField('email', 'الإلكتروني') || getField('text', 'الإيميل');
            const passwordInput = getField('password', 'المرور');
            
            const email = emailInput ? emailInput.value : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!email || !password) return alert("يرجى إدخال الإيميل والباسورد");

            const submitBtn = loginForm.querySelector('button');
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
                        window.location.href = '/admin.html'; // وديه للوحة التحكم
                    } else {
                        window.location.href = '/course.html'; // وديه للكورسات
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
