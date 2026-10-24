const token = sessionStorage.getItem('token');
const role = sessionStorage.getItem('role');

if (!token || role !== 'admin') {
    document.documentElement.innerHTML = `<!DOCTYPE html><html><head><title>404</title></head><body style="background:#08090d; color:#ff304b; display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif;"><h1 style="font-size:100px;">404 Not Found</h1></body></html>`;
} else {
    document.getElementById('adminContent').style.display = 'block';
}

document.getElementById('addBtn')?.addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    
    const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, desc, level: 'مبتدئ' })
    });
    
    if (res.ok) alert('تمت إضافة الكورس!');
    else alert('فشل الإضافة');
});

function logout() {
    sessionStorage.clear();
    window.location.href = '/auth.html';
}
