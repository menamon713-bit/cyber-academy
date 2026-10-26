document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('token')) window.location.href = '/login.html';
    if (localStorage.getItem('role') === 'admin') document.getElementById('admin-btn').classList.remove('hidden');

    const container = document.getElementById('courses-container');
    try {
        const res = await fetch('/api/courses');
        const courses = await res.json();
        if (courses.length === 0) {
            container.innerHTML = '<p class="text-gray-400">لا توجد كورسات.</p>'; return;
        }
        container.innerHTML = courses.map(c => `
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-red-500 transition">
                <h3 class="text-xl font-bold text-red-400 mb-2">${c.title}</h3>
                <p class="text-gray-300 mb-4 text-sm">${c.description}</p>
                <a href="/course.html?id=${c._id}" class="block text-center bg-red-600 hover:bg-red-500 text-white py-2 rounded font-bold">دخول الكورس</a>
            </div>
        `).join('');
    } catch (e) { container.innerHTML = '<p class="text-red-500">فشل التحميل</p>'; }
});
