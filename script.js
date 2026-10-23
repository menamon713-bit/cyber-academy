// 1. تعريف المسارات (Hardcoded)
var paths = [
{id:'basics',name:'أساسيات الأمن السيبراني',icon:'fa-shield-halved',level:'مبتدئ',desc:'المفاهيم الأساسية والتهديدات ومبادئ الحماية.',courses:['مقدمة الأمن السيبراني','إدارة الهوية وكلمات المرور','الخصوصية والأمان الرقمي']},
{id:'network',name:'أمن الشبكات',icon:'fa-network-wired',level:'مبتدئ — متوسط',desc:'تعلم الشبكات والبروتوكولات ومبادئ الدفاع.',courses:['أساسيات الشبكات','TCP/IP وDNS وHTTP','الجدران النارية ومراقبة الشبكات']},
{id:'web',name:'أمن تطبيقات الويب',icon:'fa-code',level:'متوسط',desc:'فهم جلسات الدخول والتحقق من المدخلات والثغرات الشائعة.',courses:['أساسيات HTTP وواجهات API','التحقق من المدخلات','مقدمة OWASP Top 10']},
{id:'ethical',name:'الاختراق الأخلاقي',icon:'fa-user-secret',level:'متوسط',desc:'منهجية اختبار مصرح بها وتوثيق النتائج وإصلاحها.',courses:['قواعد الاختبار المصرح','جمع المعلومات بشكل قانوني','كتابة تقرير الثغرات']},
{id:'defense',name:'الدفاع السيبراني وSOC',icon:'fa-binoculars',level:'متوسط',desc:'مراقبة الأحداث وتحليل السجلات والاستجابة للحوادث.',courses:['مقدمة SOC','قراءة سجلات الأنظمة','الاستجابة للحوادث']},
{id:'crypto',name:'التشفير وحماية البيانات',icon:'fa-key',level:'متوسط',desc:'التشفير والهاش والتوقيعات وإدارة المفاتيح.',courses:['مفاهيم التشفير','Hashing وDigital Signatures','إدارة المفاتيح']},
{id:'forensics',name:'التحليل الجنائي الرقمي',icon:'fa-magnifying-glass-chart',level:'متوسط',desc:'جمع الأدلة الرقمية وفهم الخط الزمني للحوادث.',courses:['مبادئ الأدلة الرقمية','تحليل السجلات','بناء خط زمني']},
{id:'cloud',name:'أمن السحابة وDevSecOps',icon:'fa-cloud',level:'متقدم',desc:'مبادئ تأمين الخدمات السحابية ودمج الأمن في التطوير.',courses:['مفاهيم أمن السحابة','إدارة الصلاحيات','مقدمة DevSecOps']},
{id:'malware',name:'تحليل البرمجيات الخبيثة',icon:'fa-bug',level:'متقدم',desc:'التعرف على السلوكيات الخطرة والتحليل النظري داخل بيئة معزولة.',courses:['أنواع البرمجيات الخبيثة','مؤشرات الاختراق','مبادئ التحليل الآمن']},
{id:'osint',name:'OSINT والاستخبارات المفتوحة',icon:'fa-magnifying-glass',level:'مبتدئ — متوسط',desc:'البحث والتحقق من المصادر العامة مع احترام الخصوصية والقانون.',courses:['تقييم المصادر','التحقق من المعلومات','أخلاقيات OSINT']},
{id:'linux',name:'Linux وPython للأمن',icon:'fa-terminal',level:'مبتدئ',desc:'أدوات أساسية لفهم الأنظمة والبرمجة وتحليل البيانات.',courses:['مقدمة Linux','أساسيات Python','معالجة النصوص والسجلات']},
{id:'incident',name:'إدارة المخاطر والاستجابة',icon:'fa-triangle-exclamation',level:'متوسط',desc:'تحديد المخاطر وترتيبها ووضع خطط الاستجابة والتعافي.',courses:['تقييم المخاطر','خطط الاستجابة','التعافي واستمرارية الأعمال']}
];

// 2. متغير الكورسات (هيتملى من الـ API)
var courses = [];

// 3. دالة جلب الكورسات من الـ Backend
async function fetchCourses() {
    try {
        const response = await fetch('/api/courses');
        if (response.ok) {
            courses = await response.json();
            // بعد ما بنجيب البيانات، بنرسم الصفحات
            renderPaths();
            renderCourseTabs();
            renderCourses();
            renderFeatured();
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

var glossary = [
['Asset','أصل رقمي','جهاز أو نظام أو بيانات لها قيمة وتحتاج إلى حماية.'],['Threat','تهديد','شيء قد يسبب ضررًا لأصل أو نظام.'],['Vulnerability','ثغرة','نقطة ضعف في تصميم أو تنفيذ أو إعداد.'],['Risk','مخاطر','احتمال وقوع ضرر مع مراعاة أثره.'],['Firewall','جدار ناري','نظام يراقب حركة الشبكة ويسمح بها أو يمنعها وفق قواعد.'],['Encryption','تشفير','تحويل البيانات إلى صيغة لا تُقرأ دون المفتاح المناسب.'],['Hash','بصمة رقمية','ناتج دالة أحادية الاتجاه يستخدم للتحقق أو المقارنة.'],['MFA','مصادقة متعددة العوامل','استخدام أكثر من عامل للتحقق من الهوية.'],['Phishing','تصيد احتيالي','خداع المستخدم لدفعه لكشف معلومات أو تنفيذ إجراء.'],['Patch','تحديث إصلاحي','تحديث يعالج مشكلة أو ثغرة أو خطأ.'],['SOC','مركز عمليات الأمن','فريق أو مركز يراقب التنبيهات والأحداث الأمنية.'],['SIEM','إدارة معلومات وأحداث الأمن','منصة تجمع السجلات وتربط الأحداث لإنتاج تنبيهات.'],['CTF','التقاط العلم','تحديات تدريبية لحل ألغاز أمنية ضمن نطاق محدد.'],['Least Privilege','أقل صلاحية','منح الحد الأدنى من الأذونات اللازمة.'],['Incident Response','الاستجابة للحوادث','خطوات منظمة لاحتواء حادث أمني وتحليله والتعافي منه.'],['Zero-day','ثغرة غير معروفة أو غير معالَجة','ثغرة لا يتوفر لها إصلاح مناسب وقت استغلالها أو اكتشافها.']
];

var quizQuestions = [
{q:'ما هو اختصار CIA في الأمن السيبراني؟',a:['Central Intelligence Agency','Confidentiality, Integrity, Availability','Cyber Investigation Agency','Control, Integrity, Access'],correct:1,why:'هي ثلاثية الأمن السيبراني: السرية، السلامة، والتوافر.'},
{q:'ما هو "التصيد الاحتيالي" (Phishing)؟',a:['اختراق شبكة الواي فاي','خداع المستخدمين للحصول على بياناتهم عبر رسائل مزيفة','تدمير أجهزة الكمبيوتر عبر فيروس','سرقة الأجهزة المادية'],correct:1,why:'يعتمد على الهندسة الاجتماعية لخداع الضحايا.'},
{q:'أي مما يلي يعتبر من البرمجيات الخبيثة التي تطلب فدية لتشفير الملفات؟',a:['Trojan','Worm','Ransomware','Adware'],correct:2,why:'برامج الفدية (Ransomware) تقوم بتشفير البيانات وطلب دفع مقابل فك التشفير.'},
{q:'ما هي ثغرة SQL Injection؟',a:['حقن أكواد برمجية خبيثة في قاعدة البيانات عبر مدخلات غير آمنة','اختراق شبكة الإنترنت','سرقة كلمات المرور من المتصفح','تعطيل السيرفر عبر هجمات الحرمان من الخدمة'],correct:0,why:'تحدث عندما يمرر المهاجم أوامر SQL عبر حقول الإدخال لتنفيذها في قاعدة البيانات.'},
{q:'ما هو الجدار الناري (Firewall)؟',a:['برنامج لزيادة سرعة الإنترنت','جهاز أو برنامج يفلتر حركة الشبكة بناءً على قواعد أمنية','برنامج لمسح الفيروسات','أداة لاختراق الشبكات'],correct:1,why:'يعمل كحاجز أمني بين الشبكات الموثوقة وغير الموثوقة.'}
]; // تم اختصارها هنا للتوضيح، المفروض ترجع الأسئلة الـ 100 اللي كانت عندك

var currentQuiz = 0, score = 0, answered = false, selectedPath = 'all';
var completed = new Set(JSON.parse(localStorage.getItem('cyberCompleted') || '[]'));

function pathCard(p) {
    return '<div class="path-card" data-path-id="' + p.id + '"><i class="fa-solid ' + p.icon + '"></i><b>' + p.name + '</b><small>' + p.level + '</small></div>';
}

function courseCard(c) {
    var pct = completed.has(c.id) ? 100 : 0;
    var cLevel = c.level || 'مبتدئ';
    var cPathId = c.pathId || 'all';
    var pathIcon = 'fa-shield-halved';
    for (var k = 0; k < paths.length; k++) {
        if (paths[k].id === cPathId) { pathIcon = paths[k].icon; break; }
    }
    
    return '<article class="card"><div class="course-icon"><i class="fa-solid ' + pathIcon + '"></i></div>' +
        '<div class="chips"><span class="chip">' + cLevel + '</span><span class="chip">كورس</span></div>' +
        '<h3>' + c.title + '</h3><p>' + (c.desc || 'لا يوجد وصف') + '</p>' +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<button class="primary" data-course-id="' + c.id + '">' + (pct ? 'مراجعة' : 'ابدأ التعلم') + ' <i class="fa-solid fa-arrow-left"></i></button></article>';
}

function renderPaths() {
    var homeH = ''; for(var i=0; i<4; i++) homeH += pathCard(paths[i]);
    var elHome = document.getElementById('homePaths');
    if(elHome) elHome.innerHTML = homeH;
    
    var allH = ''; for(var i=0; i<paths.length; i++) allH += pathCard(paths[i]);
    var elAll = document.getElementById('allPaths');
    if(elAll) elAll.innerHTML = allH;
}

function renderCourses() {
    var input = document.getElementById('courseSearch');
    var q = input ? input.value.trim().toLowerCase() : '';
    var filtered = [];
    for (var i=0; i<courses.length; i++) {
        var c = courses[i];
        if ((selectedPath === 'all' || c.pathId === selectedPath) && (c.title + ' ' + c.desc).toLowerCase().indexOf(q) !== -1) {
            filtered.push(c);
        }
    }
    var h = filtered.length > 0 ? filtered.map(courseCard).join('') : '<div class="empty">مفيش كورسات مطابقة للبحث.</div>';
    var elGrid = document.getElementById('courseGrid');
    if(elGrid) elGrid.innerHTML = h;
}

function renderFeatured() {
    var h = ''; for(var i=0; i<3 && i<courses.length; i++) h += courseCard(courses[i]);
    var el = document.getElementById('featuredCourses');
    if(el) el.innerHTML = h;
}

function renderCourseTabs() {
    var h = '<button class="tab ' + (selectedPath==='all'?'active':'') + '" data-tab-path="all">الكل</button>';
    for (var i=0; i<paths.length; i++) {
        h += '<button class="tab ' + (selectedPath===paths[i].id?'active':'') + '" data-tab-path="' + paths[i].id + '">' + paths[i].name + '</button>';
    }
    var el = document.getElementById('courseTabs');
    if(el) el.innerHTML = h;
}

function setCoursePath(id) { selectedPath = id; renderCourseTabs(); renderCourses(); }

function openPath(id) {
    var p = null; for (var i=0; i<paths.length; i++) if (paths[i].id === id) p = paths[i];
    if(!p) return;
    showSection('paths');
    var h = ''; for (var i=0; i<courses.length; i++) if (courses[i].pathId === id) h += courseCard(courses[i]);
    var el = document.getElementById('pathDetails');
    if(el) {
        el.innerHTML = '<div class="section-head"><div><h2>' + p.name + '</h2><p>' + p.desc + '</p></div><span class="chip">' + p.level + '</span></div><div class="grid">' + h + '</div>';
        el.scrollIntoView({behavior:'smooth',block:'start'});
    }
}

function openCourse(id) { window.open('https://www.youtube.com/@SecureTheHumans', '_blank'); }

function renderQuiz() {
    var q = quizQuestions[currentQuiz], box = document.getElementById('quizBox'); 
    if(!box) return;
    answered = false;
    var answersH = ''; for (var i=0; i<q.a.length; i++) answersH += '<button class="answer" data-ans-index="' + i + '">' + ['أ','ب','ج','د'][i] + '. ' + q.a[i] + '</button>';
    box.innerHTML = '<div class="eyebrow">السؤال ' + (currentQuiz+1) + ' من ' + quizQuestions.length + '</div>' +
    '<div class="progress"><span style="width:' + ((currentQuiz+1)/quizQuestions.length*100) + '%"></span></div>' +
    '<div class="quiz-question">' + q.q + '</div><div class="answers">' + answersH + '</div><div id="quizFeedback"></div>' +
    '<div style="display:flex;justify-content:space-between;gap:10px;margin-top:15px"><span style="color:var(--muted);font-size:12px">النتيجة: ' + score + ' صحيحة</span><button id="nextQuizBtn" class="primary hidden">' + (currentQuiz===quizQuestions.length-1?'إنهاء الاختبار':'السؤال التالي') + ' ←</button></div>';
}

function answerQuiz(i) {
    if(answered) return; answered = true; var q = quizQuestions[currentQuiz];
    var buttons = document.querySelectorAll('.answer'); buttons[q.correct].classList.add('correct');
    if(i === q.correct) { score++; var stat = document.getElementById('statScore'); if(stat) stat.textContent = score; } else { buttons[i].classList.add('wrong'); }
    var fb = document.getElementById('quizFeedback');
    if(fb) fb.innerHTML = '<div class="feedback">' + (i===q.correct?'إجابة صحيحة!':'الإجابة الصحيحة: ' + q.a[q.correct]) + '<br>' + q.why + '</div>';
    var nextBtn = document.getElementById('nextQuizBtn');
    if(nextBtn) nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    if(currentQuiz < quizQuestions.length-1) { currentQuiz++; renderQuiz(); }
    else { 
        var box = document.getElementById('quizBox');
        if(box) box.innerHTML = '<div class="course-icon"><i class="fa-solid fa-trophy"></i></div><h2>خلصت الاختبار!</h2><p>إجاباتك الصحيحة: ' + score + ' من ' + quizQuestions.length + '</p><div class="progress"><span style="width:' + (score/quizQuestions.length*100) + '%"></span></div><button id="restartQuizBtn" class="primary">إعادة الاختبار</button>'; 
    }
}

function renderGlossary() {
    var input = document.getElementById('glossarySearch'); 
    var q = input ? input.value.toLowerCase() : ''; 
    var h = '';
    for(var i=0; i<glossary.length; i++) if (glossary[i].join(' ').toLowerCase().indexOf(q) !== -1) h += '<div class="card"><div class="eyebrow">' + glossary[i][0] + '</div><h3>' + glossary[i][1] + '</h3><p>' + glossary[i][2] + '</p></div>';
    var el = document.getElementById('glossaryGrid');
    if(el) el.innerHTML = h || '<div class="empty">مفيش مصطلحات مطابقة.</div>';
}

var challenges = [{title:'تحدي الهاش',desc:'حدد لماذا لا يُعد الهاش تشفيرًا قابلًا للفك.',hint:'فكر في الفرق بين دالة أحادية الاتجاه وخوارزمية تستخدم مفتاحًا.'},{title:'تحليل سجل دخول',desc:'راجع سجلًا تدريبيًا وحدد الحدث الذي يحتاج إلى مراجعة.',hint:'تكرار محاولات فاشلة في وقت قصير قد يستحق التحقيق، لكنه لا يثبت وحده وجود اختراق.'},{title:'اكتشاف رابط مشبوه',desc:'تعلم مؤشرات التصيد قبل فتح أي رابط.',hint:'افحص اسم النطاق، والسياق، والأخطاء الإملائية، واطلب تأكيدًا من مرسل موثوق.'}];

function renderChallenges() { 
    var h = ''; 
    for(var i=0; i<challenges.length; i++) {
        h += '<div class="card"><div class="course-icon"><i class="fa-solid fa-flag"></i></div><h3>' + challenges[i].title + '</h3><p>' + challenges[i].desc + '</p><button class="secondary" data-hint-idx="' + i + '">عرض تلميح</button><p id="hint' + i + '" class="hidden" style="margin-top:12px;color:#ff9aa8">' + challenges[i].hint + '</p></div>'; 
    }
    var el = document.getElementById('challengeGrid');
    if(el) el.innerHTML = h; 
}

function renderRoadmap() {
    var stages = [['1','الأساسيات','مفاهيم الأمن والخصوصية وأنظمة التشغيل'],['2','الشبكات','IP وDNS وHTTP ومبادئ TCP/IP'],['3','Linux وPython','الطرفية والبرمجة وتحليل النصوص'],['4','اختار تخصصًا','ويب أو دفاع سيبراني أو شبكات أو تحليل رقمي'],['5','تدريب آمن','مختبرات قانونية وتحديات CTF تعليمية'],['6','ملف أعمال','تقارير توثيقية ومشروعات دفاعية آمنة']];
    var h = ''; for(var i=0; i<stages.length; i++) h += '<div class="lesson"><div class="lesson-num">' + stages[i][0] + '</div><div><b>' + stages[i][1] + '</b><p>' + stages[i][2] + '</p></div></div>';
    var el = document.getElementById('roadmapList');
    if(el) el.innerHTML = h;
}

function showSection(id) {
    var views = document.querySelectorAll('.view'); for(var i=0; i<views.length; i++) { if(views[i].id === id) views[i].classList.remove('hidden'); else views[i].classList.add('hidden'); }
    var links = document.querySelectorAll('.side-link'); for(var i=0; i<links.length; i++) { if(links[i].getAttribute('data-target') === id) links[i].classList.add('active'); else links[i].classList.remove('active'); }
    var navs = document.querySelectorAll('[data-nav]'); for(var i=0; i<navs.length; i++) { if(navs[i].getAttribute('data-nav') === id) navs[i].classList.add('active'); else navs[i].classList.remove('active'); }
    var sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.remove('open'); 
    if(id === 'quiz' && !answered) renderQuiz(); 
    window.scrollTo({top:0,behavior:'smooth'});
}

function toggleMenu(){ var sb = document.getElementById('sidebar'); if(sb) sb.classList.toggle('open'); }

document.addEventListener('DOMContentLoaded', function() {
    // تشغيل الدوال الأساسية
    fetchCourses(); // <--- هنا بنشغل جلب البيانات من الـ API
    renderQuiz(); 
    renderGlossary(); 
    renderChallenges(); 
    renderRoadmap();
    
    var statDone = document.getElementById('statDone');
    if(statDone) statDone.textContent = Math.min(100, Math.round(completed.size/12*100)) + '%';

    document.body.addEventListener('click', function(e) {
        var target = e.target.closest('[data-target]');
        if (target) { e.preventDefault(); showSection(target.getAttribute('data-target')); return; }

        var urlTarget = e.target.closest('[data-url]');
        if (urlTarget) { window.open(urlTarget.getAttribute('data-url'), '_blank'); return; }

        var pathCard = e.target.closest('[data-path-id]');
        if (pathCard && !pathCard.hasAttribute('data-course-id')) { openPath(pathCard.getAttribute('data-path-id')); return; }

        var courseBtn = e.target.closest('[data-course-id]');
        if (courseBtn) { openCourse(courseBtn.getAttribute('data-course-id')); return; }

        var tabBtn = e.target.closest('[data-tab-path]');
        if (tabBtn) { setCoursePath(tabBtn.getAttribute('data-tab-path')); return; }

        var ansBtn = e.target.closest('[data-ans-index]');
        if (ansBtn) { answerQuiz(parseInt(ansBtn.getAttribute('data-ans-index'))); return; }

        if (e.target.id === 'nextQuizBtn') { nextQuestion(); return; }
        if (e.target.id === 'restartQuizBtn') { currentQuiz = 0; score = 0; renderQuiz(); return; }

        var hintBtn = e.target.closest('[data-hint-idx]');
        if (hintBtn) { document.getElementById('hint' + hintBtn.getAttribute('data-hint-idx')).classList.toggle('hidden'); return; }
        
        if (e.target.id === 'menuToggle') { toggleMenu(); return; }
    });

    var courseSearch = document.getElementById('courseSearch');
    if (courseSearch) courseSearch.addEventListener('input', renderCourses);

    var glossarySearch = document.getElementById('glossarySearch');
    if (glossarySearch) glossarySearch.addEventListener('input', renderGlossary);
});
