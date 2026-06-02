export function initCart() {
    const cartWrapper = document.getElementById('cartWrapper');
    if (!cartWrapper) return;

    const productsContainer = document.getElementById('cartProducts');
    const extraContainer = document.getElementById('cartExtra');
    const summaryRows = document.getElementById('summaryRows');
    const totalPriceSpan = document.getElementById('totalPrice');
    const emptyCartBlock = document.getElementById('emptyCartBlock');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Функция обновления итоговой суммы и детализации
    function updateTotals() {
        let total = 0;
        const rowsData = [];

        // Основные товары
        const mainItems = document.querySelectorAll('.cart-item[data-type="main"]:not(.removing)');
        mainItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const qtyInput = item.querySelector('[data-quantity-input]');
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
            const title = item.querySelector('.cart-item__title')?.innerText || 'Товар';
            const itemTotal = price * quantity;
            total += itemTotal;
            rowsData.push({ title, quantity, price, total: itemTotal, type: 'main' });
        });

        // Дополнительные товары
        const extraItems = document.querySelectorAll('.cart-item[data-type="extra"]:not(.removing)');
        extraItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const qtyInput = item.querySelector('[data-quantity-input]');
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
            const title = item.querySelector('.cart-item__title')?.innerText || 'Аксессуар';
            const itemTotal = price * quantity;
            total += itemTotal;
            rowsData.push({ title, quantity, price, total: itemTotal, type: 'extra' });
        });

        // Обновляем детализацию
        if (summaryRows) {
            summaryRows.innerHTML = rowsData.map(row => `
                <div class="cart-summary__row">
                    <span>${row.title} × ${row.quantity}</span>
                    <span>${row.total} руб.</span>
                </div>
            `).join('');
        }

        if (totalPriceSpan) totalPriceSpan.innerText = `${total} руб.`;

        // Проверка на пустую корзину
        const allItems = [...mainItems, ...extraItems];
        if (allItems.length === 0) {
            if (cartWrapper) cartWrapper.style.display = 'none';
            if (emptyCartBlock) emptyCartBlock.classList.remove('hidden');
        } else {
            if (cartWrapper) cartWrapper.style.display = 'flex';
            if (emptyCartBlock) emptyCartBlock.classList.add('hidden');
        }

        return total;
    }

    // Обновление количества товара
    function setupQuantityHandlers(container) {
        const minusBtns = container.querySelectorAll('.cart-item__minus');
        const plusBtns = container.querySelectorAll('.cart-item__plus');

        const handleQuantityChange = (input, delta) => {
            let val = parseInt(input.value) || 1;
            val = Math.max(1, val + delta);
            input.value = val;
            input.dispatchEvent(new Event('change'));
            updateTotals();
        };

        minusBtns.forEach(btn => {
            btn.removeEventListener('click', window._minusHandler);
            const input = btn.closest('.cart-item__quantity')?.querySelector('[data-quantity-input]');
            if (!input) return;
            const handler = () => handleQuantityChange(input, -1);
            btn.addEventListener('click', handler);
            btn._handler = handler;
        });

        plusBtns.forEach(btn => {
            btn.removeEventListener('click', window._plusHandler);
            const input = btn.closest('.cart-item__quantity')?.querySelector('[data-quantity-input]');
            if (!input) return;
            const handler = () => handleQuantityChange(input, 1);
            btn.addEventListener('click', handler);
            btn._handler = handler;
        });

        const quantityInputs = container.querySelectorAll('[data-quantity-input]');
        quantityInputs.forEach(input => {
            input.removeEventListener('change', window._inputChange);
            const handler = () => updateTotals();
            input.addEventListener('change', handler);
            input._handler = handler;
        });
    }

    // Удаление товара с анимацией
    function removeItem(btn) {
        const item = btn.closest('.cart-item');
        if (!item) return;
        item.classList.add('removing');
        setTimeout(() => {
            item.remove();
            updateTotals();
            setupQuantityHandlers(document.body); // переназначить обработчики
        }, 300);
    }

    // Установка обработчиков удаления
    function setupRemoveHandlers(container) {
        const removeBtns = container.querySelectorAll('.cart-item__remove');
        removeBtns.forEach(btn => {
            btn.removeEventListener('click', btn._removeHandler);
            const handler = () => removeItem(btn);
            btn.addEventListener('click', handler);
            btn._removeHandler = handler;
        });
    }

    // Инициализация всех обработчиков
    function bindEvents() {
        setupQuantityHandlers(document.body);
        setupRemoveHandlers(document.body);
    }

    // Переключение способа доставки (плавное)
    const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
    const courierBlock = document.querySelector('.cart-delivery__courier');
    function toggleDelivery() {
        const selected = document.querySelector('input[name="delivery"]:checked');
        if (!selected) return;
        if (selected.value === 'courier') {
            courierBlock.classList.remove('hidden');
        } else {
            courierBlock.classList.add('hidden');
        }
    }
    if (deliveryRadios.length && courierBlock) {
        deliveryRadios.forEach(radio => radio.addEventListener('change', toggleDelivery));
        toggleDelivery();
    }

    // Добавление аксессуаров (демо)
    const addButtons = document.querySelectorAll('.add-accessory');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Функция добавления откроется в ближайшее время', 2000);
        });
    });

    // Карта (демо)
    const mapBtn = document.querySelector('.show-map');
    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            alert('Здесь будет карта с точкой самовывоза (интеграция Google/Яндекс)');
        });
    }

    // Валидация и оформление заказа
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = document.getElementById('customerName')?.value.trim();
            const phone = document.getElementById('customerPhone')?.value.trim();
            if (!name || !phone) {
                showNotification('Пожалуйста, заполните имя и телефон', 3000);
                return;
            }

            const deliveryType = document.querySelector('input[name="delivery"]:checked')?.value;
            if (deliveryType === 'courier') {
                const street = document.getElementById('street')?.value.trim();
                const house = document.getElementById('house')?.value.trim();
                const recipientPhone = document.getElementById('recipientPhone')?.value.trim();
                if (!street || !house || !recipientPhone) {
                    showNotification('Для курьерской доставки заполните улицу, дом и телефон получателя', 3000);
                    return;
                }
            }

            const date = document.getElementById('deliveryDate')?.value;
            if (!date) {
                showNotification('Выберите дату доставки', 2000);
                return;
            }

            showNotification('Заказ успешно оформлен! С вами свяжется менеджер.', 4000);
            // Здесь можно отправить данные на сервер
        });
    }

    // Утилита для уведомлений
    function showNotification(text, duration = 2000) {
        const existingToast = document.querySelector('.notification-toast');
        if (existingToast) existingToast.remove();
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerText = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    // Первичный вызов
    updateTotals();
    bindEvents();
}
