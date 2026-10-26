// عشان نجيب الكورسات من الـ API بتاعنا
async function fetchCourses() {
  try {
    // بنكتب /api/courses علطول لأننا على نفس الدومين
    const response = await fetch('/api/courses');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const courses = await response.json();
    displayCourses(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    document.getElementById('courses-container').innerHTML = 
      '<p class="text-red-500">Failed to load courses.</p>';
  }
}

// الدالة اللي بترسم الكروت في الـ HTML
function displayCourses(courses) {
  const container = document.getElementById('courses-container');
  
  if (courses.length === 0) {
    container.innerHTML = '<p class="text-gray-400">No courses available yet.</p>';
    return;
  }

  container.innerHTML = courses.map(course => `
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-green-500 transition">
      <h3 class="text-xl font-bold text-green-400 mb-2">${course.title}</h3>
      <p class="text-gray-300 mb-4 text-sm">${course.description}</p>
      <div class="flex justify-between items-center mt-4">
        <span class="text-xs bg-gray-700 px-2 py-1 rounded text-gray-200">${course.level}</span>
        <span class="text-lg font-bold text-white">${course.price === 0 ? 'Free' : '$' + course.price}</span>
      </div>
    </div>
  `).join('');
}

// تشغيل الدالة لما الصفحة تحمل
document.addEventListener('DOMContentLoaded', fetchCourses);
