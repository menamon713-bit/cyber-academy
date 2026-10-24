document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('role', data.role);
            if (data.role === 'admin') window.location.href = '/admin.html';
            else window.location.href = '/dashboard.html';
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert("خطأ في الاتصال");
    }
});
