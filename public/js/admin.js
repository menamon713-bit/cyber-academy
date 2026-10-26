document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-course-form');
    const messageBox = document.getElementById('message-box');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // منع الفورم من عمل ريفريش للصفحة

        // 1. نجمع البيانات من الفورم
        const courseData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            level: document.getElementById('level').value,
            price: parseFloat(document.getElementById('price').value) || 0
        };

        // 2. نغير شكل الزرار عشان اليوزر يعرف إن فيه لودينج
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Adding...';
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

        try {
            // 3. نبعت البيانات للـ API
            const response = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });

            const data = await response.json();

            if (response.ok) {
                // لو نجح
                showMessage('Course added successfully! 🎉', 'success');
                form.reset(); // تفريغ الفورم
            } else {
                // لو حصل خطأ من السيرفر
                showMessage(data.error || 'Failed to add course.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Network error. Please try again.', 'error');
        } finally {
            // 4. نرجع الزرار لشكله الطبيعي
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Add Course';
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });

    // دالة عشان تظهر رسالة نجاح أو خطأ
    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.classList.remove('hidden', 'bg-green-900', 'text-green-300', 'bg-red-900', 'text-red-300');
        
        if (type === 'success') {
            messageBox.classList.add('bg-green-900/50', 'text-green-400', 'border', 'border-green-700');
        } else {
            messageBox.classList.add('bg-red-900/50', 'text-red-400', 'border', 'border-red-700');
        }
    }
});
