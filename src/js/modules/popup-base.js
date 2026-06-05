// Вычисляем ширину скроллбара один раз
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

let scrollbarWidth = 0;
let originalPaddingRight = '';

export function openPopup(popup) {
    if (!popup) return;

    // Сохраняем исходный padding-right body, если ещё не сохранили
    if (!originalPaddingRight) {
        originalPaddingRight = document.body.style.paddingRight || '';
    }

    // Вычисляем ширину скроллбара
    scrollbarWidth = getScrollbarWidth();

    if (scrollbarWidth > 0) {
        // Добавляем компенсирующий padding-right, чтобы контент не дёргался
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    popup.classList.add('active');
    document.body.classList.add('body--no-scroll');
}

export function closePopup(popup) {
    if (!popup) return;

    popup.classList.remove('active');
    document.body.classList.remove('body--no-scroll');

    // Убираем компенсирующий padding-right
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = originalPaddingRight;
    }
}

export function initGlobalPopups() {
    document.addEventListener('click', (e) => {
        const overlay = e.target.closest('.popup__overlay');
        if (overlay) {
            const popup = overlay.closest('.popup');
            closePopup(popup);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activePopup = document.querySelector('.popup.active');
            if (activePopup) {
                closePopup(activePopup);
            }
        }
    });

    document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.popup__close');
        if (closeBtn) {
            const popup = closeBtn.closest('.popup');
            closePopup(popup);
        }
    });
}
