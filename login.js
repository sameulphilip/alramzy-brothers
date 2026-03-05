(function() {
    var users = getStoredUsers();
    var isFirstTime = !users || users.length === 0;

    var title = document.getElementById('loginTitle');
    var rowDisplayName = document.getElementById('rowDisplayName');
    var rowPassword2 = document.getElementById('rowPassword2');
    var btnSubmit = document.getElementById('btnSubmit');
    var loginMsg = document.getElementById('loginMsg');

    function showMsg(text, isError) {
        loginMsg.textContent = text || '';
        loginMsg.style.color = isError ? '#dc2626' : '#16a34a';
    }

    if (isFirstTime) {
        title.textContent = 'إنشاء حساب المدير الأول';
        rowDisplayName.style.display = 'block';
        rowPassword2.style.display = 'block';
        document.getElementById('password').setAttribute('placeholder', 'اختر كلمة مرور');
        btnSubmit.textContent = 'إنشاء الحساب';
    }

    document.getElementById('formLogin').addEventListener('submit', function(e) {
        e.preventDefault();
        var username = (document.getElementById('username').value || '').trim();
        var password = document.getElementById('password').value;
        var displayName = (document.getElementById('displayName').value || '').trim() || username;

        if (!username) {
            showMsg('أدخل اسم المستخدم.', true);
            return;
        }

        if (isFirstTime) {
            var password2 = document.getElementById('password2').value;
            if (password.length < 4) {
                showMsg('كلمة المرور 4 أحرف على الأقل.', true);
                return;
            }
            if (password !== password2) {
                showMsg('كلمة المرور وتأكيدها غير متطابقتين.', true);
                return;
            }
            users = [{ id: 1, username: username, password: hashPassword(password), displayName: displayName }];
            saveUsers(users);
            setCurrentUser({ username: username, displayName: displayName });
            showMsg('تم إنشاء الحساب. جاري التحويل...', false);
            setTimeout(function() { window.location.href = 'admin.html'; }, 600);
            return;
        }

        var user = users.find(function(u) { return u.username === username; });
        if (!user || !verifyPassword(password, user.password)) {
            showMsg('اسم المستخدم أو كلمة المرور غير صحيحة.', true);
            return;
        }
        setCurrentUser({ username: user.username, displayName: user.displayName || user.username });
        window.location.href = 'admin.html';
    });
})();
