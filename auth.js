document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. تسجيل الدخول (Login)
    // ==========================================
    const loginForm = document.getElementById('loginForm'); // تأكد من اسم الفورم في HTML
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const errorMsg = document.getElementById('loginError'); // لو فيه مكان للخطأ

            if (!email || !password) return alert("يرجى إدخال الإيميل والباسورد");

            submitBtn.innerText = "جاري الدخول...";
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // حفظ التوكن والصلاحية في المتصفح
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('role', data.role);
                    
                    // لو الأدمن، خزنه في الاسم اللي صفحة admin.js بتدور عليه
                    if (data.role === 'admin') {
                        sessionStorage.setItem('adminToken', data.token);
                        window.location.href = '/admin.html'; // وديه للوحة التحكم
                    } else {
                        window.location.href = '/course.html'; // وديه للكورسات
                    }
                } else {
                    if (errorMsg) {
                        errorMsg.innerText = data.message || "بيانات غير صحيحة";
                        errorMsg.style.display = 'block';
                    } else {
                        alert(data.message || "بيانات غير صحيحة");
                    }
                }
            } catch (error) {
                alert("خطأ في الاتصال بالسيرفر");
            } finally {
                submitBtn.innerText = "تسجيل الدخول";
                submitBtn.disabled = false;
            }
        });
    }

    // ==========================================
    // 2. إنشاء حساب جديد (Register)
    // ==========================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            if (!username || !email || !password) return alert("يرجى ملء جميع الحقول");

            submitBtn.innerText = "جاري إنشاء الحساب...";
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.");
                    // ممكن تحوله لصفحة تسجيل الدخول لو حابب
                    window.location.href = '/auth.html'; 
                } else {
                    alert(data.message || "حدث خطأ أثناء التسجيل");
                }
            } catch (error) {
                alert("خطأ في الاتصال بالسيرفر");
            } finally {
                submitBtn.innerText = "إنشاء حساب";
                submitBtn.disabled = false;
            }
        });
    }
});
