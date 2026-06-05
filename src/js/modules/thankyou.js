export function initThankyou() {
    const orderContainer = document.getElementById('orderDetails');
    if (!orderContainer) return;

    // Пытаемся получить реальный заказ
    const orderDataRaw = sessionStorage.getItem('lastOrder');
    let order = null;
    let isDemo = false;

    if (orderDataRaw) {
        try {
            order = JSON.parse(orderDataRaw);
        } catch(e) {}
    }

    // Если реального заказа нет – создаём демо-заказ для предпросмотра
    if (!order) {
        isDemo = true;
        order = {
            orderNumber: 100499,
            customerName: 'Александр',
            customerPhone: '+375 (29) 123-45-67',
            customerEmail: 'alex@example.com',
            deliveryType: 'Курьерская доставка',
            deliveryDate: '25.12.2026',
            deliveryTime: '15:00–18:00',
            recipientName: 'Анна',
            recipientPhone: '+375 (29) 765-43-21',
            recipientAddress: 'ул. Янки Купалы, 25, кв. 10',
            total: 564,
            items: [
                { title: 'Букет №19 Роз Джумилия', quantity: 1, price: 177, total: 177 },
                { title: 'Букет №21 Роз Джумилия 2', quantity: 2, price: 187, total: 374 },
                { title: 'Открытка №21', quantity: 1, price: 10, total: 10 }
            ]
        };
    }

    const itemsHtml = order.items.map(item => `
        <li>
            <span class="item-title">${escapeHtml(item.title)} × ${item.quantity}</span>
            <span class="item-price">${item.total} руб.</span>
        </li>
    `).join('');

    const html = `
        <div class="thankyou__order-info">
            <p><strong>Заказ №${order.orderNumber}</strong></p>
            <p>Дата доставки: ${escapeHtml(order.deliveryDate)}</p>
            <p>Время доставки: ${escapeHtml(order.deliveryTime)}</p>
            <p>Способ получения: ${escapeHtml(order.deliveryType)}</p>
            <hr>
            <p><strong>Заказчик:</strong> ${escapeHtml(order.customerName)} (${escapeHtml(order.customerPhone)}, ${escapeHtml(order.customerEmail)})</p>
            <p><strong>Получатель:</strong> ${escapeHtml(order.recipientName)} (${escapeHtml(order.recipientPhone)})</p>
            <p><strong>Адрес доставки:</strong> ${escapeHtml(order.recipientAddress)}</p>
        </div>
        <div class="thankyou__items-list">
            <h4>Состав заказа</h4>
            <ul>${itemsHtml}</ul>
        </div>
        <div class="thankyou__total">
            <span>Итого к оплате:</span>
            <span class="total-price">${order.total} руб.</span>
        </div>
    `;

    orderContainer.innerHTML = html;

    // Если это был реальный заказ – удаляем его из хранилища, чтобы при обновлении страницы не дублировался
    if (!isDemo && orderDataRaw) {
        sessionStorage.removeItem('lastOrder');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}
