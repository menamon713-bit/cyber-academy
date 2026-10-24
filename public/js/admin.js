const token = sessionStorage.getItem('token');
if (!token) window.location.href = '/auth.html';

document.getElementById('addBtn').addEventListener('click', async () => {
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
