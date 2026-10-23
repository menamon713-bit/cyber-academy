function switchTab(tab) {
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('msgBox').className = 'msg'; // اخفاء الرسائل

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
            // حفظ التوكن وبيانات المستخدم في المتصفح
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showMsg("تم الدخول بنجاح! جاري تحويلك...", "success");
            setTimeout(() => window.location.href = '/', 1500); // تحويل للرئيسية
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
            switchTab('login'); // تحويله لصفحة الدخول
            document.getElementById('loginEmail').value = email; // تعبئة الايميل تلقائياً
        } else {
            showMsg(data.error || "حدث خطأ", "error");
        }
    } catch (error) {
        showMsg("فشل الاتصال بالسيرفر", "error");
    }
}
