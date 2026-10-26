document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-course-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.textContent = 'جاري الإضافة...'; btn.disabled = true;
        
        const token = localStorage.getItem('token');
        const res = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                content: document.getElementById('content').value,
                level: document.getElementById('level').value,
                price: parseFloat(document.getElementById('price').value) || 0
            })
        });
        if (res.ok) {
            alert('تم إضافة الكورس!');
            form.reset();
        } else { alert('فشل الإضافة'); }
        btn.textContent = 'إضافة الكورس'; btn.disabled = false;
    });
});
