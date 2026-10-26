document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('courses-container');
    
    try {
        // تم تغيير اللينك هنا
        const response = await fetch('https://trailers-suzuki-mean-aug.trycloudflare.com/api/courses');
        const courses = await response.json();

        if (courses.length === 0) {
            container.innerHTML = '<p class="text-gray-400">No courses available yet.</p>';
            return;
        }

        container.innerHTML = courses.map(course => `
            <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 transition">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-green-400">${course.title}</h3>
                    <span class="text-xs bg-gray-700 px-2 py-1 rounded text-gray-200">${course.level}</span>
                </div>
                <p class="text-gray-300 mb-4 text-sm line-clamp-3">${course.description}</p>
                <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                    <span class="text-lg font-bold text-white">${course.price === 0 ? 'Free' : '$' + course.price}</span>
                    <button class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-semibold transition">Start Now</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching courses:', error);
        container.innerHTML = '<p class="text-red-500">Failed to load courses. Check if Termux is running.</p>';
    }
});
