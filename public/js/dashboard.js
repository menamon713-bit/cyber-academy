document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('courses-container');
    try {
        // اللينك الطبيعي بتاع Vercel
        const response = await fetch('/api/courses');
        const courses = await response.json();

        if (courses.length === 0) {
            container.innerHTML = '<p class="text-gray-400">مفيش كورسات لسه.</p>';
            return;
        }

        container.innerHTML = courses.map(course => `
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-red-500 transition">
                <h3 class="text-xl font-bold text-red-400 mb-2">${course.title}</h3>
                <p class="text-gray-300 mb-4 text-sm line-clamp-3">${course.description}</p>
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                    <span class="text-lg font-bold text-white">${course.price === 0 ? 'مجاني' : '$' + course.price}</span>
                    <span class="text-xs bg-gray-700 px-2 py-1 rounded text-gray-200">${course.level}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<p class="text-red-500">فشل تحميل الكورسات.</p>';
    }
});
