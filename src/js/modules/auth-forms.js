/**
 * auth-forms.js – обработка форм авторизации, регистрации, восстановления пароля
 *
 * ВНИМАНИЕ: переключение видимости пароля (глазки) вынесено в отдельный модуль
 * (например, account.js или общий модуль для всех форм).
 * Здесь этой логики нет, чтобы избежать конфликта обработчиков.
 */

/**
 * Обработка формы восстановления пароля
 */
export function initForgotForm() {
    const forgotForm = document.getElementById('forgotForm');
    if (!forgotForm) return;

    forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const login = forgotForm.querySelector('[name="login"]')?.value.trim();
        const newPassword = forgotForm.querySelector('[name="new_password"]')?.value;
        const confirmPassword = forgotForm.querySelector('[name="confirm_password"]')?.value;

        if (!login) {
            alert('Пожалуйста, укажите email или номер телефона');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            alert('Пароль должен содержать минимум 6 символов');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        alert('Демо: запрос на восстановление пароля отправлен. При интеграции с WordPress данные уйдут на сервер.');
        // forgotForm.submit(); // раскомментировать при реальной отправке
    });
}

/**
 * Инициализация всех форм (авторизация, регистрация, восстановление)
 */
export function initAllForms() {
    // Форма авторизации
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = loginForm.querySelector('[name="phone"]')?.value;
            if (!phone || phone.trim() === '') {
                alert('Пожалуйста, введите номер телефона');
                return;
            }
            alert('Демо: вход выполнен. При интеграции с WordPress данные отправятся на сервер.');
        });
    }

    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const password = registerForm.querySelector('[name="password"]')?.value;
            const confirm = registerForm.querySelector('[name="confirm_password"]')?.value;
            const phone = registerForm.querySelector('[name="phone"]')?.value;
            const privacyConsent = registerForm.querySelector('[name="privacy_consent"]')?.checked;

            if (!phone || phone.trim() === '') {
                alert('Пожалуйста, введите номер телефона');
                return;
            }
            if (!password || password.length < 6) {
                alert('Пароль должен содержать минимум 6 символов');
                return;
            }
            if (password !== confirm) {
                alert('Пароли не совпадают');
                return;
            }
            if (!privacyConsent) {
                alert('Необходимо согласие на обработку персональных данных');
                return;
            }

            alert('Демо: регистрация выполнена. При интеграции с WordPress данные отправятся на сервер.');
        });
    }

    // Восстановление пароля
    initForgotForm();

    // Переключение видимости пароля здесь НЕ вызывается – используйте отдельную функцию
}
