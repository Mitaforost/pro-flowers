import { openPopup } from './popup-base.js';

export function initDayBouquetQuickOrder() {
    const button = document.querySelector('.day-bouquet .button--primary');
    if (!button) return;

    // Убираем предыдущий обработчик, если был
    button.removeEventListener('click', handleQuickOrderClick);
    button.addEventListener('click', handleQuickOrderClick);
}

function handleQuickOrderClick(event) {
    event.preventDefault();

    const popup = document.querySelector('#servicePopup');
    if (!popup) {
        console.error('Попап #servicePopup не найден');
        return;
    }

    const titleEl = popup.querySelector('#servicePopupTitle');
    const descEl = popup.querySelector('#servicePopupDescription');
    const imageEl = popup.querySelector('#servicePopupImage');

    const section = document.querySelector('.day-bouquet');
    if (!section) return;

    const bouquetTitle = section.querySelector('h2')?.innerText || 'Букет дня';
    const slogan = section.querySelector('.day-bouquet__slogan')?.innerText || '';
    const oldPrice = section.querySelector('.day-bouquet__old-price')?.innerText || '';
    const newPrice = section.querySelector('.day-bouquet__new-price')?.innerText || '';
    const imgSrc = section.querySelector('.day-bouquet__image')?.src || '';

    const paramItems = section.querySelectorAll('.day-bouquet__param-list li');
    const params = Array.from(paramItems).map(li => li.innerText.trim()).join(', ');
    const description = `${slogan}\nСостав: ${params}\nЦена: ${newPrice} (было ${oldPrice})`;

    if (titleEl) titleEl.textContent = bouquetTitle;
    if (descEl) descEl.textContent = description;
    if (imageEl) {
        imageEl.src = imgSrc;
        imageEl.alt = bouquetTitle;
    }

    const form = popup.querySelector('.popup-service__form');
    if (form) {
        form.querySelectorAll('.hidden-product-field').forEach(field => field.remove());

        const hiddenFields = [
            { name: 'product_name', value: bouquetTitle },
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

    // Сброс полей
    const inputs = popup.querySelectorAll('input[type="text"], input[type="tel"], textarea');
    inputs.forEach(input => {
        if (input.name !== 'contact_method') input.value = '';
    });

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
