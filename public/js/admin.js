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
        submitBtn.innerHTML = 'Adding...';
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

        try {
            const token = localStorage.getItem('token');
            // تم تغيير اللينك هنا
            const response = await fetch('https://trailers-suzuki-mean-aug.trycloudflare.com/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Course added successfully! 🎉', 'success');
                form.reset();
            } else {
                showMessage(data.error || 'Failed to add course.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Network error. Check Termux connection.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Add Course';
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });

    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.classList.remove('hidden', 'bg-green-900/50', 'text-green-400', 'border-green-700', 'bg-red-900/50', 'text-red-400', 'border-red-700');
        
        if (type === 'success') {
            messageBox.classList.add('bg-green-900/50', 'text-green-400', 'border', 'border-green-700');
        } else {
            messageBox.classList.add('bg-red-900/50', 'text-red-400', 'border', 'border-red-700');
        }
    }
});
