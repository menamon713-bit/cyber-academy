const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) window.location.href = '/login.html';
    if (!courseId) window.location.href = '/dashboard.html';

    // جلب الكورس (من الـ API)
    const res = await fetch('/api/courses');
    const courses = await res.json();
    const course = courses.find(c => c._id === courseId);

    if (course) {
        document.getElementById('course-title').innerText = course.title;
        document.getElementById('course-content').innerText = course.content;
    }

    // جلب الأسئلة
    const quizRes = await fetch(`/api/quizzes?courseId=${courseId}`);
    const quizzes = await quizRes.json();
    const quizContainer = document.getElementById('quiz-container');
    
    if (quizzes.length === 0) {
        quizContainer.innerHTML = '<p>لا يوجد أسئلة لهذا الكورس.</p>';
        return;
    }

    quizContainer.innerHTML = quizzes.map((q, index) => `
        <div class="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <p class="font-bold mb-2 text-red-400">${index + 1}. ${q.question}</p>
            ${q.options.map((opt, i) => `
                <label class="block mb-1 cursor-pointer">
                    <input type="radio" name="q${index}" value="${i}" class="mr-2"> ${opt}
                </label>
            `).join('')}
        </div>
    `).join('') + `<button onclick="submitQuiz(${JSON.stringify(quizzes.map(q => q.correctOption))})" class="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-bold mt-4">إرسال الإجابات</button>`;
});

function submitQuiz(correctOptions) {
    let score = 0;
    correctOptions.forEach((correct, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && parseInt(selected.value) === correct) score++;
    });
    alert(`نتيجتك: ${score} من ${correctOptions.length}`);
}
