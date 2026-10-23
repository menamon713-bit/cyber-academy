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

var courses = [];
var glossary = [ ['Asset','أصل رقمي','جهاز أو نظام أو بيانات لها قيمة وتحتاج إلى حماية.'],['Threat','تهديد','شيء قد يسبب ضررًا لأصل أو نظام.'],['Vulnerability','ثغرة','نقطة ضعف في تصميم أو تنفيذ أو إعداد.'],['Risk','مخاطر','احتمال وقوع ضرر مع مراعاة أثره.'],['Firewall','جدار ناري','نظام يراقب حركة الشبكة ويسمح بها أو يمنعها وفق قواعد.'],['Encryption','تشفير','تحويل البيانات إلى صيغة لا تُقرأ دون المفتاح المناسب.'],['Hash','بصمة رقمية','ناتج دالة أحادية الاتجاه يستخدم للتحقق أو المقارنة.'],['MFA','مصادقة متعددة العوامل','استخدام أكثر من عامل للتحقق من الهوية.'],['Phishing','تصيد احتيالي','خداع المستخدم لدفعه لكشف معلومات أو تنفيذ إجراء.'],['Patch','تحديث إصلاحي','تحديث يعالج مشكلة أو ثغرة أو خطأ.'],['SOC','مركز عمليات الأمن','فريق أو مركز يراقب التنبيهات والأحداث الأمنية.'],['SIEM','إدارة معلومات وأحداث الأمن','منصة تجمع السجلات وتربط الأحداث لإنتاج تنبيهات.'],['CTF','التقاط العلم','تحديات تدريبية لحل ألغاز أمنية ضمن نطاق محدد.'],['Least Privilege','أقل صلاحية','منح الحد الأدنى من الأذونات اللازمة.'],['Incident Response','الاستجابة للحوادث','خطوات منظمة لاحتواء حادث أمني وتحليله والتعافي منه.'],['Zero-day','ثغرة غير معروفة أو غير معالَجة','ثغرة لا يتوفر لها إصلاح مناسب وقت استغلالها أو اكتشافها.'] ];

// اختصرنا الأسئلة هنا عشان الموقع يبقى سريع جداً
var quizQuestions = [
{q:'ما هو اختصار CIA في الأمن السيبراني؟',a:['Central Intelligence Agency','Confidentiality, Integrity, Availability','Cyber Investigation Agency','Control, Integrity, Access'],correct:1,why:'هي ثلاثية الأمن السيبراني.'},
{q:'ما هو "التصيد الاحتيالي" (Phishing)؟',a:['اختراق شبكة الواي فاي','خداع المستخدمين للحصول على بياناتهم عبر رسائل مزيفة','تدمير أجهزة الكمبيوتر','سرقة الأجهزة'],correct:1,why:'يعتمد على الهندسة الاجتماعية.'},
{q:'أي مما يلي يعتبر من البرمجيات الخبيثة التي تطلب فدية؟',a:['Trojan','Worm','Ransomware','Adware'],correct:2,why:'برامج الفدية تشفر البيانات.'},
{q:'ما هي ثغرة SQL Injection؟',a:['حقن أكواد برمجية خبيثة في قاعدة البيانات','اختراق شبكة الإنترنت','سرقة كلمات المرور','تعطيل السيرفر'],correct:0,why:'تحدث عبر حقول الإدخال.'},
{q:'ما هو الجدار الناري (Firewall)؟',a:['برنامج لزيادة السرعة','جهاز أو برنامج يفلتر حركة الشبكة','برنامج لمسح الفيروسات','أداة اختراق'],correct:1,why:'يعمل كحاجز أمني.'}
];

var currentQuiz = 0, score = 0, answered = false, selectedPath = 'all';
var completed = new Set();

// دالة سريعة وخفيفة لجلب الكورسات
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        if (response.ok) {
            courses = await response.json();
            renderPaths(); renderCourseTabs(); renderCourses(); renderFeatured();
        }
    } catch (error) { console.error("Error:", error); }
}

async function loadUserProgress() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    try {
        const res = await fetch(`/api/progress?email=${user.email}`);
        if (res.ok) {
            const data = await res.json();
            if (data.completed) {
                completed = new Set(data.completed);
                renderCourses(); renderFeatured();
                document.getElementById('statDone').textContent = Math.min(100, Math.round(completed.size/12*100)) + '%';
            }
        }
    } catch (e) {}
}

function pathCard(p) { return '<div class="path-card" data-path-id="' + p.id + '"><i class="fa-solid ' + p.icon + '"></i><b>' + p.name + '</b><small>' + p.level + '</small></div>'; }
function courseCard(c) {
    var pct = completed.has(c.id) ? 100 : 0;
    var cLevel = c.level || 'مبتدئ';
    var cPathId = c.pathId || 'all';
    var pathIcon = 'fa-shield-halved';
    for (var k = 0; k < paths.length; k++) { if (paths[k].id === cPathId) { pathIcon = paths[k].icon; break; } }
    return '<article class="card"><div class="course-icon"><i class="fa-solid ' + pathIcon + '"></i></div>' +
        '<div class="chips"><span class="chip">' + cLevel + '</span><span class="chip">كورس</span></div>' +
        '<h3>' + c.title + '</h3><p>' + (c.desc || 'لا يوجد وصف') + '</p>' +
        '<div class="progress"><span style="width:' + pct + '%"></span></div>' +
        '<button class="primary" data-course-id="' + c.id + '">' + (pct ? 'مراجعة' : 'ابدأ التعلم') + ' <i class="fa-solid fa-arrow-left"></i></button></article>';
}

function renderPaths() { var h=''; for(var i=0;i<4;i++) h+=pathCard(paths[i]); document.getElementById('homePaths').innerHTML=h; var a=''; for(var i=0;i<paths.length;i++) a+=pathCard(paths[i]); document.getElementById('allPaths').innerHTML=a; }
function renderCourses() { var input=document.getElementById('courseSearch'); var q=input?input.value.trim().toLowerCase():''; var f=[]; for(var i=0;i<courses.length;i++){var c=courses[i]; if((selectedPath==='all'||c.pathId===selectedPath)&&(c.title+' '+c.desc).toLowerCase().indexOf(q)!==-1) f.push(c);} document.getElementById('courseGrid').innerHTML = f.length>0?f.map(courseCard).join(''):'<div class="empty">مفيش كورسات مطابقة.</div>'; }
function renderFeatured() { var h=''; for(var i=0;i<3&&i<courses.length;i++) h+=courseCard(courses[i]); document.getElementById('featuredCourses').innerHTML=h; }
function renderCourseTabs() { var h='<button class="tab '+(selectedPath==='all'?'active':'')+'" data-tab-path="all">الكل</button>'; for(var i=0;i<paths.length;i++) h+='<button class="tab '+(selectedPath===paths[i].id?'active':'')+'" data-tab-path="'+paths[i].id+'">'+paths[i].name+'</button>'; document.getElementById('courseTabs').innerHTML=h; }
function setCoursePath(id) { selectedPath=id; renderCourseTabs(); renderCourses(); }

function openPath(id) {
    var p=null; for(var i=0;i<paths.length;i++) if(paths[i].id===id) p=paths[i]; if(!p) return;
    showSection('paths'); var h=''; for(var i=0;i<courses.length;i++) if(courses[i].pathId===id) h+=courseCard(courses[i]);
    document.getElementById('pathDetails').innerHTML='<div class="section-head"><div><h2>'+p.name+'</h2><p>'+p.desc+'</p></div><span class="chip">'+p.level+'</span></div><div class="grid">'+h+'</div>';
    document.getElementById('pathDetails').scrollIntoView({behavior:'smooth',block:'start'});
}

async function openCourseModal(id) {
    const c = courses.find(x => x.id === id);
    if(!c) return;
    
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if(currentUser) {
        fetch('/api/progress', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:currentUser.email, courseId:id}) })
        .then(res => res.json()).then(data => {
             if(data.completed) { completed = new Set(data.completed); renderCourses(); renderFeatured(); }
        }).catch(e=>console.log(e));
    }

    document.getElementById('courseModalContent').innerHTML = `
        <div class="chip" style="margin:auto; margin-bottom:15px;">${c.level}</div>
        <h1 style="color:var(--red); font-size:24px;">${c.title}</h1>
        <p style="color:var(--muted); line-height:1.8;">${c.desc}</p>
        <a href="https://www.youtube.com/@SecureTheHumans" target="_blank" class="primary" style="display:inline-block; margin-top:20px; text-decoration:none;">شاهد الكورس على يوتيوب</a>
    `;
    document.getElementById('courseModal').classList.remove('hidden');
}
function closeCourseModal() { document.getElementById('courseModal').classList.add('hidden'); }
function openAuthModal(tab='login') { document.getElementById('authModal').classList.remove('hidden'); switchAuthTab(tab); }
function closeAuthModal() { document.getElementById('authModal').classList.add('hidden'); }
function switchAuthTab(tab) {
    document.getElementById('loginTab').classList.remove('active'); document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginForm').classList.add('hidden'); document.getElementById('registerForm').classList.add('hidden'); document.getElementById('resetForm').classList.add('hidden');
    document.getElementById('authMsgBox').className = 'auth-msg';
    if(tab==='login') { document.getElementById('loginTab').classList.add('active'); document.getElementById('loginForm').classList.remove('hidden'); }
    else { document.getElementById('registerTab').classList.add('active'); document.getElementById('registerForm').classList.remove('hidden'); }
}
function togglePass(id, btn) { const i=document.getElementById(id); if(i.type==='password'){i.type='text';btn.innerHTML='🙈';}else{i.type='password';btn.innerHTML='👁️';} }
function showAuthMsg(text, type) { const b=document.getElementById('authMsgBox'); b.innerText=text; b.className=`auth-msg ${type}`; }

async function handleLogin() {
    const email=document.getElementById('loginEmail').value, password=document.getElementById('loginPassword').value;
    if(!email||!password) return showAuthMsg("ملء الحقول","error");
    try {
        const res=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
        const data=await res.json();
        if(res.ok){ localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); showAuthMsg("تم الدخول!","success"); setTimeout(()=>location.reload(),1000); }
        else showAuthMsg(data.error,"error");
    } catch(e) { showAuthMsg("خطأ في الاتصال","error"); }
}
async function handleRegister() {
    const username=document.getElementById('regUsername').value, email=document.getElementById('regEmail').value, password=document.getElementById('regPassword').value;
    if(!username||!email||!password) return showAuthMsg("ملء الحقول","error");
    try {
        const res=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,email,password})});
        const data=await res.json();
        if(res.ok){ showAuthMsg("تم التسجيل!","success"); switchAuthTab('login'); document.getElementById('loginEmail').value=email; }
        else showAuthMsg(data.error,"error");
    } catch(e) { showAuthMsg("خطأ في الاتصال","error"); }
}
async function handleReset() {
    const email=document.getElementById('resetEmail').value, newPassword=document.getElementById('resetNewPassword').value;
    if(!email||!newPassword) return showAuthMsg("ملء الحقول","error");
    try {
        const res=await fetch('/api/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,newPassword})});
        const data=await res.json();
        if(res.ok){ showAuthMsg(data.message,"success"); setTimeout(()=>location.reload(),1500); }
        else showAuthMsg(data.error,"error");
    } catch(e) { showAuthMsg("خطأ في الاتصال","error"); }
}

function showSection(id) {
    var views=document.querySelectorAll('.view'); for(var i=0;i<views.length;i++){if(views[i].id===id)views[i].classList.remove('hidden');else views[i].classList.add('hidden');}
    var links=document.querySelectorAll('.side-link'); for(var i=0;i<links.length;i++){if(links[i].getAttribute('data-target')===id)links[i].classList.add('active');else links[i].classList.remove('active');}
    var navs=document.querySelectorAll('[data-nav]'); for(var i=0;i<navs.length;i++){if(navs[i].getAttribute('data-nav')===id)navs[i].classList.add('active');else navs[i].classList.remove('active');}
    document.getElementById('sidebar').classList.remove('open'); if(id==='quiz'&&!answered) renderQuiz(); window.scrollTo({top:0,behavior:'smooth'});
}
function toggleMenu(){ document.getElementById('sidebar').classList.toggle('open'); }

function renderQuiz() {
    var q = quizQuestions[currentQuiz], box = document.getElementById('quizBox'); answered = false;
    var answersH = ''; for (var i=0; i<q.a.length; i++) answersH += '<button class="answer" data-ans-index="' + i + '">' + ['أ','ب','ج','د'][i] + '. ' + q.a[i] + '</button>';
    box.innerHTML = '<div class="eyebrow">السؤال ' + (currentQuiz+1) + ' من ' + quizQuestions.length + '</div><div class="quiz-question">' + q.q + '</div><div class="answers">' + answersH + '</div><div id="quizFeedback"></div><div style="display:flex;justify-content:space-between;margin-top:15px"><span style="font-size:12px">النتيجة: ' + score + '</span><button id="nextQuizBtn" class="primary hidden">التالي ←</button></div>';
}
function answerQuiz(i) {
    if(answered) return; answered = true; var q = quizQuestions[currentQuiz];
    var buttons = document.querySelectorAll('.answer'); buttons[q.correct].classList.add('correct');
    if(i === q.correct) { score++; document.getElementById('statScore').textContent = score; } else { buttons[i].classList.add('wrong'); }
    document.getElementById('quizFeedback').innerHTML = '<div class="feedback">' + (i===q.correct?'إجابة صحيحة!':'الإجابة الصحيحة: ' + q.a[q.correct]) + '<br>' + q.why + '</div>';
    document.getElementById('nextQuizBtn').classList.remove('hidden');
}
function nextQuestion() { if(currentQuiz < quizQuestions.length-1) { currentQuiz++; renderQuiz(); } else { document.getElementById('quizBox').innerHTML = '<h2>خلصت الاختبار!</h2>'; } }
function renderGlossary() { var input = document.getElementById('glossarySearch'); var q = input ? input.value.toLowerCase() : ''; var h = ''; for(var i=0; i<glossary.length; i++) if (glossary[i].join(' ').toLowerCase().indexOf(q) !== -1) h += '<div class="card"><h3>' + glossary[i][1] + '</h3><p>' + glossary[i][2] + '</p></div>'; document.getElementById('glossaryGrid').innerHTML = h || '<div class="empty">مفيش مصطلحات.</div>'; }
var challenges = [{title:'تحدي الهاش',desc:'...',hint:'...'},{title:'تحليل سجل',desc:'...',hint:'...'}];
function renderChallenges() { var h = ''; for(var i=0; i<challenges.length; i++) { h += '<div class="card"><h3>' + challenges[i].title + '</h3><p>' + challenges[i].desc + '</p></div>'; } document.getElementById('challengeGrid').innerHTML = h; }
function renderRoadmap() { var h = '<div class="lesson"><div class="lesson-num">1</div><div><b>الأساسيات</b></div></div>'; document.getElementById('roadmapList').innerHTML = h; }

document.addEventListener('DOMContentLoaded', async function() {
    const user = JSON.parse(localStorage.getItem('user'));
    const profileName = document.getElementById('profileUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginNavBtn = document.getElementById('loginNavBtn');

    if(user) {
        if(profileName) profileName.textContent = user.username;
        if(logoutBtn) logoutBtn.style.display = 'block';
        if(loginNavBtn) loginNavBtn.style.display = 'none';
        await loadUserProgress(); 
    } else {
        if(profileName) profileName.textContent = 'متعلم سايبر';
        if(logoutBtn) logoutBtn.style.display = 'none';
        if(loginNavBtn) loginNavBtn.style.display = 'block';
    }

    if(logoutBtn) logoutBtn.addEventListener('click', () => { localStorage.clear(); location.reload(); });
    if(loginNavBtn) loginNavBtn.addEventListener('click', () => openAuthModal('login'));
    
    document.getElementById('closeAuthModal').addEventListener('click', closeAuthModal);
    document.getElementById('closeCourseModal').addEventListener('click', closeCourseModal);
    document.getElementById('loginTab').addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('registerTab').addEventListener('click', () => switchAuthTab('register'));
    document.getElementById('forgotPassLink').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('loginForm').classList.add('hidden'); document.getElementById('resetForm').classList.remove('hidden'); });
    document.getElementById('backToLoginLink').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('resetForm').classList.add('hidden'); document.getElementById('loginForm').classList.remove('hidden'); });

    document.getElementById('eyeLogin').addEventListener('click', function(){ togglePass('loginPassword', this); });
    document.getElementById('eyeReg').addEventListener('click', function(){ togglePass('regPassword', this); });
    document.getElementById('eyeReset').addEventListener('click', function(){ togglePass('resetNewPassword', this); });
    
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('registerBtn').addEventListener('click', handleRegister);
    document.getElementById('resetBtn').addEventListener('click', handleReset);

    loadCourses();
    renderQuiz(); renderGlossary(); renderChallenges(); renderRoadmap(); 
    document.getElementById('statDone').textContent = Math.min(100, Math.round(completed.size/12*100)) + '%';

    document.body.addEventListener('click', function(e) {
        var target = e.target.closest('[data-target]');
        if (target) { e.preventDefault(); showSection(target.getAttribute('data-target')); return; }
        var urlTarget = e.target.closest('[data-url]');
        if (urlTarget) { window.open(urlTarget.getAttribute('data-url'), '_blank'); return; }
        var pathCard = e.target.closest('[data-path-id]');
        if (pathCard && !pathCard.hasAttribute('data-course-id')) { openPath(pathCard.getAttribute('data-path-id')); return; }
        var courseBtn = e.target.closest('[data-course-id]');
        if (courseBtn) { openCourseModal(courseBtn.getAttribute('data-course-id')); return; }
        var tabBtn = e.target.closest('[data-tab-path]');
        if (tabBtn) { setCoursePath(tabBtn.getAttribute('data-tab-path')); return; }
        var ansBtn = e.target.closest('[data-ans-index]');
        if (ansBtn) { answerQuiz(parseInt(ansBtn.getAttribute('data-ans-index'))); return; }
        if (e.target.id === 'nextQuizBtn') { nextQuestion(); return; }
        if (e.target.id === 'menuToggle') { toggleMenu(); return; }
    });

    var courseSearch = document.getElementById('courseSearch');
    if (courseSearch) courseSearch.addEventListener('input', renderCourses);
    var glossarySearch = document.getElementById('glossarySearch');
    if (glossarySearch) glossarySearch.addEventListener('input', renderGlossary);
});
