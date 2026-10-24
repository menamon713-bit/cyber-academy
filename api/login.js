<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول | Cyber Academy</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Cairo', sans-serif; background: #08090d; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .auth-box { background: #15161d; padding: 30px; border-radius: 15px; border: 1px solid #282a34; width: 90%; max-width: 400px; }
        h2 { color: #ff304b; text-align: center; }
        .tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #282a34; }
        .tab { flex: 1; text-align: center; padding: 10px; cursor: pointer; color: #9a9ba8; }
        .tab.active { color: #ff304b; border-bottom: 2px solid #ff304b; font-weight: bold; }
        .input-group { position: relative; margin-bottom: 15px; }
        input { width: 100%; padding: 12px; background: #101116; border: 1px solid #282a34; color: white; border-radius: 8px; box-sizing: border-box; }
        input:focus { outline: none; border-color: #ff304b; }
        .primary-btn { background: #ff304b; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: bold; font-size: 16px; }
        .form-container { display: none; }
        .form-container.active { display: block; }
    </style>
</head>
<body>
    <div class="auth-box">
        <h2>👑 Cyber Academy</h2>
        
        <div class="tabs">
            <div class="tab active" onclick="switchTab('login')">تسجيل الدخول</div>
            <div class="tab" onclick="switchTab('register')">حساب جديد</div>
        </div>

        <!-- فورم الدخول -->
        <div id="loginFormContainer" class="form-container active">
            <form id="loginForm">
                <div class="input-group"><input type="email" id="loginEmail" placeholder="البريد الإلكتروني" required></div>
                <div class="input-group"><input type="password" id="loginPassword" placeholder="كلمة المرور" required></div>
                <button type="submit" class="primary-btn" id="loginBtn">دخول</button>
            </form>
        </div>

        <!-- فورم التسجيل -->
        <div id="registerFormContainer" class="form-container">
            <form id="registerForm">
                <div class="input-group"><input type="text" id="regUsername" placeholder="اسم المستخدم" required></div>
                <div class="input-group"><input type="email" id="regEmail" placeholder="البريد الإلكتروني" required></div>
                <div class="input-group"><input type="password" id="regPassword" placeholder="كلمة المرور" required></div>
                <button type="submit" class="primary-btn" id="regBtn">إنشاء حساب</button>
            </form>
        </div>
    </div>
    <script src="js/auth.js"></script>
</body>
</html>
