const token = sessionStorage.getItem('token');
if (!token) window.location.href = '/auth.html';

async function loadCourses() {
    const res = await fetch('/api/courses');
    const courses = await res.json();
    const container = document.getElementById('courses');
    
    courses.forEach(course => {
        container.innerHTML += `
            <div class="card">
                <h3 style="color: #ff304b; margin: 0;">${course.title}</h3>
                <p>${course.desc}</p>
            </div>
        `;
    });
}
loadCourses();
