document.addEventListener('DOMContentLoaded', () => {
    // التبويبات
    document.getElementById('loginTab').addEventListener('click', () => switchTab('login'));
    document.getElementById('registerTab').addEventListener('click', () => switchTab('register'));

    // زراير العين
    document.getElementById('eyeLogin').addEventListener('click', function() { togglePass('loginPassword', this); });
    document.getElementById('eyeReg').addEventListener('click', function() { togglePass('regPassword', this); });
    document.getElementById('eyeReset').addEventListener('click', function() { togglePass('resetNewPassword', this); });

    // زراير الدخول والتسجيل والاستعادة
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
    document.getElementById('resetBtn').addEventListener('click', handleReset);

    // التبديل بين فورم الاستعادة والدخول
    document.getElementById('forgotPassLink').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('resetForm').classList.remove('hidden');
        document.getElementById('msgBox').className = 'msg';
    });

    document.getElementById('backToLoginLink').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('resetForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('msgBox').className = 'msg';
    });
});

function togglePass(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = "🙈";
    } else {
        input.type = "password";
        btn.innerHTML = "👁️";
    }
}

function switchTab(tab) {
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('resetForm').classList.add('hidden');
    document.getElementById('msgBox').className = 'msg'; 

    if (tab === 'login') {
        document.getElementById('loginTab').classList.add('active');
        document.getElementById('loginForm').classList.remove('hidden');
    } else {
        document.getElementById('registerTab').classList.add('active');
        document.getElementById('registerForm').classList.remove('hidden');
    }
}

function showMsg(text, type) {
    const box = document.getElementById('msgBox');
    box.innerText = text;
    box.className = `msg ${type}`;
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) return showMsg("يرجى ملء جميع الحقول", "error");

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showMsg("تم الدخول بنجاح! جاري تحويلك...", "success");
            setTimeout(() => window.location.href = '/', 1500); 
        } else {
            showMsg(data.error || "حدث خطأ", "error");
        }
    } catch (error) {
        showMsg("فشل الاتصال بالسيرفر", "error");
    }
}

async function handleRegister() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    if (!username || !email || !password) return showMsg("يرجى ملء جميع الحقول", "error");

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if (res.ok) {
            showMsg("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.", "success");
            switchTab('login'); 
            document.getElementById('loginEmail').value = email; 
        } else {
            showMsg(data.error || "حدث خطأ", "error");
        }
    } catch (error) {
        showMsg("فشل الاتصال بالسيرفر", "error");
    }
}

async function handleReset() {
    const email = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('resetNewPassword').value;
    if (!email || !newPassword) return showMsg("يرجى ملء الحقول", "error");

    try {
        const res = await fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });
        const data = await res.json();
        if(res.ok) {
            showMsg(data.message, "success");
            setTimeout(() => { window.location.reload(); }, 2000);
        } else {
            showMsg(data.error, "error");
        }
    } catch(e) { showMsg("خطأ في الاتصال", "error"); }
}
