document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const eyeBtn = document.getElementById('eyeToggle');
    const passwordInput = document.getElementById('loginPassword');
    const emailInput = document.getElementById('loginEmail');

    if (eyeBtn && passwordInput) {
        eyeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            this.innerHTML = passwordInput.type === "password" ? '👁️' : '🙈';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) return alert("يرجى إدخال الإيميل والباسورد");

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
                    sessionStorage.setItem('adminToken', data.token);
                    sessionStorage.setItem('role', data.role);
                    if (data.role === 'admin') window.location.href = '/admin.html'; 
                    else window.location.href = '/course.html'; 
                } else {
                    alert(data.message || "بيانات غير صحيحة");
                    loginBtn.innerText = "دخول";
                    loginBtn.disabled = false;
                }
            } catch (error) {
                alert("خطأ في الاتصال");
                loginBtn.innerText = "دخول";
                loginBtn.disabled = false;
            }
        });
    }
});
