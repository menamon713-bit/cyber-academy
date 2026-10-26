document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-course-form');
    const messageBox = document.getElementById('message-box');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            level: document.getElementById('level').value,
            price: parseFloat(document.getElementById('price').value) || 0
        };

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'جاري الإضافة...';

        try {
            const token = localStorage.getItem('token');
            // اللينك الطبيعي بتاع Vercel
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseData)
            });

            const data = await response.json();
            messageBox.classList.remove('hidden');

            if (response.ok) {
                messageBox.textContent = 'تم إضافة الكورس بنجاح! 🎉';
                messageBox.className = 'mb-6 p-4 rounded-lg text-sm font-semibold text-center bg-green-900/50 text-green-400 border border-green-700';
                form.reset();
            } else {
                messageBox.textContent = data.error || 'فشل الإضافة';
                messageBox.className = 'mb-6 p-4 rounded-lg text-sm font-semibold text-center bg-red-900/50 text-red-400 border border-red-700';
            }
        } catch (error) {
            messageBox.textContent = 'السيرفر مش شغال!';
            messageBox.className = 'mb-6 p-4 rounded-lg text-sm font-semibold text-center bg-red-900/50 text-red-400 border border-red-700';
            messageBox.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'إضافة الكورس';
        }
    });
});
