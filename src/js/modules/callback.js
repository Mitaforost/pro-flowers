import { openPopup } from './popup-base.js';

export function initCallbackButton() {
    const callbackBtn = document.querySelector('.callback-btn');
    if (!callbackBtn) return;

    const SHOW_THRESHOLD = 300;

    const toggleVisibility = () => {
        if (window.scrollY > SHOW_THRESHOLD) {
            callbackBtn.classList.add('callback-btn--visible');
        } else {
            callbackBtn.classList.remove('callback-btn--visible');
        }
    };

    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();

    const button = callbackBtn.querySelector('.callback-btn__button');
    if (!button) return;

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const popup = document.getElementById('callbackPopup');
        if (popup) {
            openPopup(popup);
        } else {
            console.warn('Popup #callbackPopup not found');
        }
        button.blur();
    });

    // Обработка отправки формы внутри попапа
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(callbackForm);
            const data = {
                name: formData.get('callback_name'),
                phone: formData.get('callback_phone'),
                comment: formData.get('callback_comment'),
            };

            // Здесь отправка данных на сервер (AJAX) или просто вывод в консоль
            console.log('Форма обратного звонка:', data);

            // Закрыть попап после отправки (опционально)
            const popup = document.getElementById('callbackPopup');
            if (popup && popup.classList.contains('active')) {
                // Импортируем closePopup или вызываем глобально
                import('./popup-base.js').then(module => {
                    module.closePopup(popup);
                });
            }

            // Очистить форму
            callbackForm.reset();

            // Показать уведомление (можно реализовать через вашу систему уведомлений)
            alert('Спасибо! Мы скоро свяжемся с вами.');
        });
    }
}
