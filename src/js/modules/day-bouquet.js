// day-bouquet.js
import { openPopup } from './popup-base.js';

function initBouquetTimer() {
    const hoursSpan = document.getElementById('timerHours');
    const minutesSpan = document.getElementById('timerMinutes');
    const secondsSpan = document.getElementById('timerSeconds');
    const timerContainer = document.getElementById('bouquetTimer');
    const expiredMsg = document.getElementById('timerExpiredMessage');
    const quickBtn = document.querySelector('.day-bouquet .quick-order-btn');

    if (!hoursSpan || !minutesSpan || !secondsSpan) return;

    function updateTimer() {
        const now = new Date();
        const deadline = new Date(now);
        deadline.setHours(21, 0, 0, 0);

        let diff = deadline - now;

        if (diff <= 0) {
            if (timerContainer) timerContainer.style.display = 'none';
            if (expiredMsg) expiredMsg.style.display = 'block';
            if (quickBtn) {
                quickBtn.disabled = true;
                quickBtn.style.opacity = '0.6';
                quickBtn.style.cursor = 'default';
            }
            return;
        }

        if (timerContainer) timerContainer.style.display = 'flex';
        if (expiredMsg) expiredMsg.style.display = 'none';
        if (quickBtn) {
            quickBtn.disabled = false;
            quickBtn.style.opacity = '1';
            quickBtn.style.cursor = 'pointer';
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (3600000)) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        hoursSpan.textContent = String(hours).padStart(2, '0');
        minutesSpan.textContent = String(minutes).padStart(2, '0');
        secondsSpan.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

function handleQuickOrder(event) {
    event.preventDefault();

    const popup = document.querySelector('#servicePopup');
    if (!popup) {
        console.error('Попап #servicePopup не найден');
        return;
    }

    const section = document.querySelector('.day-bouquet');
    if (!section) return;

    // --- Правильные селекторы под ваш HTML ---
    const title = section.querySelector('.day-bouquet__title')?.innerText.trim() || 'Букет дня';
    const slogan = section.querySelector('.day-bouquet__slogan')?.innerText.trim() || '';

    // Состав: ищем .composition-list li
    const paramItems = section.querySelectorAll('.composition-list li');
    const params = Array.from(paramItems).map(li => li.innerText.trim()).join(', ');

    // Цены: классы .old-price и .new-price (без префикса)
    const oldPrice = section.querySelector('.old-price')?.innerText.trim() || '';
    const newPrice = section.querySelector('.new-price')?.innerText.trim() || '';

    // Изображение: .day-bouquet__visual img
    const imgElement = section.querySelector('.day-bouquet__visual img');
    const imgSrc = imgElement ? imgElement.src : '';

    const description = `${slogan ? slogan + '\n' : ''}Состав: ${params}\nЦена: ${newPrice} (было ${oldPrice})`;

    // Заполняем попап
    const titleEl = popup.querySelector('#servicePopupTitle');
    const descEl = popup.querySelector('#servicePopupDescription');
    const imageEl = popup.querySelector('#servicePopupImage');

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;
    if (imageEl && imgSrc) {
        imageEl.src = imgSrc;
        imageEl.alt = title;
    } else {
        console.warn('Изображение не найдено или отсутствует элемент #servicePopupImage');
    }

    // Скрытые поля формы
    const form = popup.querySelector('.popup-service__form');
    if (form) {
        form.querySelectorAll('.hidden-product-field').forEach(field => field.remove());

        const hiddenFields = [
            { name: 'product_name', value: title },
            { name: 'product_price', value: newPrice.replace(/[^\d,]/g, '') },
            { name: 'product_old_price', value: oldPrice.replace(/[^\d,]/g, '') },
            { name: 'product_params', value: params },
            { name: 'product_image', value: imgSrc }
        ];

        hiddenFields.forEach(field => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = field.value;
            input.classList.add('hidden-product-field');
            form.appendChild(input);
        });
    }

    // Сброс полей ввода
    const inputs = popup.querySelectorAll('input[type="text"], input[type="tel"], textarea');
    inputs.forEach(input => {
        if (input.name !== 'contact_method') input.value = '';
    });

    // Сброс кастомного селекта, если есть
    const customSelect = popup.querySelector('.popup-service__custom-select');
    if (customSelect) {
        const textSpan = customSelect.querySelector('.popup-service__custom-select-text');
        const hiddenInput = customSelect.querySelector('input[type="hidden"]');
        if (textSpan) textSpan.textContent = 'Удобный способ связи';
        if (hiddenInput) hiddenInput.value = '';
        customSelect.classList.remove('open');
        const trigger = customSelect.querySelector('.popup-service__custom-select-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        customSelect.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
    }

    openPopup(popup);
}

export function initDayBouquet() {
    initBouquetTimer();

    const quickOrderBtn = document.querySelector('.day-bouquet .quick-order-btn');
    if (quickOrderBtn) {
        quickOrderBtn.removeEventListener('click', handleQuickOrder);
        quickOrderBtn.addEventListener('click', handleQuickOrder);
    }
}
