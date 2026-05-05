// js/modules/popup-product.js

import { openPopup, closePopup } from './popup-base';

export function initProductPopup() {
    const popup = document.getElementById('productPopup');
    if (!popup) return;

    const imgEl = document.getElementById('popupProductImage');
    const titleEl = document.getElementById('popupProductTitle');
    const priceEl = document.getElementById('popupProductPrice');
    const descEl = document.getElementById('popupProductDescription');

    // Вешаем обработчик на все карточки товаров
    document.querySelectorAll('.product-card[data-product-name]').forEach(card => {
        card.addEventListener('click', (e) => {
            // Не открываем попап, если клик был по кнопке «В корзину» или другому интерактивному элементу
            if (e.target.closest('button, a, input')) return;

            const image = card.dataset.productImage;
            const name = card.dataset.productName;
            const price = card.dataset.productPrice;
            const description = card.dataset.productDescription || '';

            // Заполняем попап
            if (imgEl) {
                imgEl.src = image;
                imgEl.alt = name;
            }
            if (titleEl) titleEl.textContent = name;
            if (priceEl) priceEl.textContent = price;
            if (descEl) descEl.textContent = description;

            openPopup(popup);
        });
    });
}
