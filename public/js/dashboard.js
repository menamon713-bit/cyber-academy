document.addEventListener('DOMContentLoaded', async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth.html';
        return;
    }

    const container = document.getElementById('courses');
    if (!container) return;

    try {
        const res = await fetch('/api/courses');
        const courses = await res.json();

        container.innerHTML = ''; // تنظيف المكان الأول

        if (courses.length === 0) {
            container.innerHTML = '<p style="color: #9a9ba8;">لا توجد كورسات متاحة حالياً.</p>';
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'card';
            // ضفنا ستايل عشان يبان شيك
            card.style.cssText = 'background: #15161d; padding: 20px; margin-bottom: 15px; border-radius: 12px; border: 1px solid #282a34;';
            
            card.innerHTML = `
                <h3 style="color: #ff304b; margin-top: 0; margin-bottom: 10px;">${course.title}</h3>
                <p style="color: #9a9ba8; margin: 0; line-height: 1.6;">${course.desc}</p>
                <span style="display: inline-block; background: #282a34; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; margin-top: 15px;">${course.level}</span>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p style="color: #ff304b;">حدث خطأ أثناء تحميل الكورسات.</p>';
    }
});
