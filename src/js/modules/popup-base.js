// js/modules/popup-base.js

export function openPopup(popup) {
    if (!popup) return;
    popup.classList.add('active');
    document.body.classList.add('body--no-scroll');
}

export function closePopup(popup) {
    if (!popup) return;
    popup.classList.remove('active');
    document.body.classList.remove('body--no-scroll');
}

// Глобальная инициализация всех попапов (закрытие по оверлею и Escape)
export function initGlobalPopups() {
    // Закрытие по клику на оверлей
    document.addEventListener('click', (e) => {
        const overlay = e.target.closest('.popup__overlay');
        if (overlay) {
            const popup = overlay.closest('.popup');
            closePopup(popup);
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activePopup = document.querySelector('.popup.active');
            if (activePopup) {
                closePopup(activePopup);
            }
        }
    });

    // Закрытие по кнопке .popup__close (всплывающее событие)
    document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.popup__close');
        if (closeBtn) {
            const popup = closeBtn.closest('.popup');
            closePopup(popup);
        }
    });
}
