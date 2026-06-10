export function initPasswordToggles() {
    const toggles = document.querySelectorAll('.password-toggle');
    toggles.forEach(btn => {
        // Убираем старые обработчики, чтобы не дублировать
        btn.removeEventListener('click', toggleHandler);
        btn.addEventListener('click', toggleHandler);
    });
}

function toggleHandler(e) {
    const btn = e.currentTarget;
    const wrapper = btn.closest('.password-wrapper');
    if (!wrapper) return;
    const input = wrapper.querySelector('input');
    if (!input) return;
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

export function initAuthForms() {
    // Обработка формы авторизации (демо)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Демо: вход выполнен. При интеграции с WordPress данные отправятся на сервер.');
        });
    }

    // Обработка формы регистрации (демо)
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = registerForm.querySelector('[name="password"]').value;
            const confirm = registerForm.querySelector('[name="confirm_password"]').value;
            if (password !== confirm) {
                alert('Пароли не совпадают');
                return;
            }
            if (password.length < 6) {
                alert('Пароль должен быть не менее 6 символов');
                return;
            }
            alert('Демо: регистрация выполнена. При интеграции с WordPress данные отправятся на сервер.');
        });
    }

    // Инициализация переключателей пароля
    initPasswordToggles();
}
