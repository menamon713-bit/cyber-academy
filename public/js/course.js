const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) window.location.href = '/login.html';
    if (!courseId) window.location.href = '/dashboard.html';

    // 1. جلب بيانات الكورس
    const res = await fetch('/api/courses');
    const courses = await res.json();
    const course = courses.find(c => c._id === courseId);

    if (course) {
        document.getElementById('course-title').innerText = course.title;
        document.getElementById('course-content').innerText = course.content;
    }

    // 2. جلب الأسئلة
    const quizRes = await fetch(`/api/quizzes?courseId=${courseId}`);
    const quizzes = await quizRes.json();
    const quizContainer = document.getElementById('quiz-container');
    
    if (quizzes.length === 0) {
        quizContainer.innerHTML = '<p class="text-gray-400">لا يوجد أسئلة لهذا الكورس.</p>';
        return;
    }

    // 3. رسم الأسئلة
    quizContainer.innerHTML = quizzes.map((q, index) => `
        <div class="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <p class="font-bold mb-2 text-red-400">${index + 1}. ${q.question}</p>
            ${q.options.map((opt, i) => `
                <label class="block mb-1 cursor-pointer hover:text-green-400 transition">
                    <input type="radio" name="q${index}" value="${i}" class="mr-2"> ${opt}
                </label>
            `).join('')}
        </div>
    `).join('') + `
        <button onclick="submitQuiz(${JSON.stringify(quizzes.map(q => q.correctOption))}, ${JSON.stringify(quizzes.map(q => q.explanation || 'لا يوجد شرح متاح.'))})" class="w-full bg-green-600 hover:bg-green-500 py-3 rounded font-bold mt-4 transition text-white">إرسال الإجابات</button>
    `;
});

// 4. تصحيح الاختبار
function submitQuiz(correctOptions, explanations) {
    let score = 0;
    let resultHtml = '';

    correctOptions.forEach((correct, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const isCorrect = selected && parseInt(selected.value) === correct;
        
        if (isCorrect) score++;

        resultHtml += `
            <div class="mb-4 p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}">
                <p class="font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}">
                    السؤال ${index + 1}: ${isCorrect ? 'إجابة صحيحة ✅' : 'إجابة خاطئة ❌'}
                </p>
                <p class="text-sm text-gray-300 mt-2">
                    <strong>الشرح:</strong> ${explanations[index]}
                </p>
            </div>
        `;
    });

    const finalScoreHtml = `
        <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">نتيجتك النهائية</h2>
            <div class="text-5xl font-black ${score > correctOptions.length / 2 ? 'text-green-500' : 'text-red-500'}">
                ${score} / ${correctOptions.length}
            </div>
        </div>
    `;
    
    document.getElementById('quiz-container').innerHTML = `
        <div class="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-2xl">
            ${finalScoreHtml}
            ${resultHtml}
            <button onclick="window.location.reload()" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-bold mt-6 transition">إعادة المحاولة</button>
        </div>
    `;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
