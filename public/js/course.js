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
        
        // عرض فيديو اليوتيوب لو موجود
        if (course.videoUrl) {
            const videoContainer = document.getElementById('video-container');
            const iframe = document.getElementById('course-video');
            
            // تحويل لينك اليوتيوب العادي لصيغة Embed
            let videoId = '';
            if (course.videoUrl.includes('v=')) {
                videoId = course.videoUrl.split('v=')[1].split('&')[0];
            } else if (course.videoUrl.includes('youtu.be/')) {
                videoId = course.videoUrl.split('youtu.be/')[1].split('?')[0];
            }
            
            if (videoId) {
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                videoContainer.classList.remove('hidden');
            }
        }
    }

    // 2. جلب الأسئلة
    const quizRes = await fetch(`/api/quizzes?courseId=${courseId}`);
    const quizzes = await quizRes.json();
    const quizContainer = document.getElementById('quiz-container');
    
    if (quizzes.length === 0) {
        quizContainer.innerHTML = '<p class="text-gray-400">لا يوجد أسئلة لهذا الكورس.</p>';
        return;
    }

    window.currentQuizzes = quizzes;

    let html = quizzes.map((q, index) => `
        <div class="bg-gray-800 p-4 md:p-6 rounded-lg mb-4 border border-gray-700 shadow-lg">
            <p class="font-bold mb-4 text-red-400 text-lg leading-relaxed">${index + 1}. ${q.question}</p>
            <div class="space-y-2">
                ${q.options.map((opt, i) => `
                    <label class="block p-3 rounded cursor-pointer hover:bg-gray-700 transition border border-gray-600 hover:border-green-500">
                        <input type="radio" name="q${index}" value="${i}" class="mr-2"> 
                        <span class="text-gray-200">${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    html += `<button onclick="submitQuiz()" class="w-full bg-green-600 hover:bg-green-500 py-4 rounded-lg font-bold mt-6 transition text-white text-lg shadow-lg">إرسال الإجابات</button>`;
    quizContainer.innerHTML = html;
});

window.submitQuiz = function() {
    const quizzes = window.currentQuizzes;
    let score = 0;
    let resultHtml = '';

    quizzes.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const isCorrect = selected && parseInt(selected.value) === q.correctOption;
        
        if (isCorrect) score++;

        resultHtml += `
            <div class="mb-4 p-5 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}">
                <p class="font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'} text-lg">
                    السؤال ${index + 1}: ${isCorrect ? 'إجابة صحيحة ✅' : 'إجابة خاطئة ❌'}
                </p>
                <p class="text-gray-300 mt-3 leading-relaxed text-sm md:text-base">
                    <strong>الشرح:</strong> ${q.explanation || 'لا يوجد شرح متاح.'}
                </p>
            </div>
        `;
    });

    const percentage = (score / quizzes.length) * 100;
    const colorClass = percentage >= 50 ? 'text-green-500' : 'text-red-500';

    document.getElementById('quiz-container').innerHTML = `
        <div class="w-full">
            <div class="text-center mb-8 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
                <h2 class="text-2xl font-bold text-white mb-2">نتيجتك النهائية</h2>
                <div class="text-6xl font-black ${colorClass}">${score} / ${quizzes.length}</div>
            </div>
            ${resultHtml}
            <button onclick="window.location.reload()" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-lg font-bold mt-6 transition text-lg">إعادة المحاولة</button>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
