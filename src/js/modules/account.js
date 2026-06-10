import { openPopup } from './popup-base.js';

const ordersData = {
    12345: {
        date: '15.04.2025',
        status: 'completed',
        statusText: 'Выполнен',
        deliveryMethod: 'Курьером',
        address: 'г. Минск, ул. Ленина, 10, кв. 5',
        deliveryDate: '16.04.2025',
        deliveryTime: '12:00–14:00',
        items: [
            { name: 'Букет №19 Роз Эльтро', qty: 1, price: 89.90, sum: 89.90 }
        ],
        total: 89.90,
        comment: 'Поздравление написать в открытке'
    },
    12346: {
        date: '02.05.2025',
        status: 'delivered',
        statusText: 'Передан курьеру',
        deliveryMethod: 'Курьером',
        address: 'г. Минск, пр. Победителей, 25',
        deliveryDate: '03.05.2025',
        deliveryTime: '15:00–17:00',
        items: [
            { name: 'Букет №2 Нежность', qty: 1, price: 145.00, sum: 145.00 },
            { name: 'Открытка «С любовью»', qty: 1, price: 8.00, sum: 8.00 }
        ],
        total: 153.00,
        comment: 'Позвонить перед доставкой'
    },
    12347: {
        date: '18.05.2025',
        status: 'processing',
        statusText: 'В сборке',
        deliveryMethod: 'Самовывоз',
        address: 'ул. Немига, 3 (магазин)',
        deliveryDate: '20.05.2025',
        deliveryTime: '10:00–18:00',
        items: [
            { name: 'Букет №10 Симфония', qty: 1, price: 210.50, sum: 210.50 }
        ],
        total: 210.50,
        comment: ''
    }
};

function fillOrderDetails(orderId) {
    const order = ordersData[orderId];
    if (!order) return;

    document.getElementById('orderNumber').textContent = orderId;
    document.getElementById('orderDate').textContent = order.date;
    const statusSpan = document.getElementById('orderStatusBadge');
    statusSpan.textContent = order.statusText;
    statusSpan.className = `status status--large status--${order.status}`;
    document.getElementById('deliveryMethod').textContent = order.deliveryMethod;
    document.getElementById('deliveryAddress').textContent = order.address;
    document.getElementById('deliveryDate').textContent = order.deliveryDate;
    document.getElementById('deliveryTime').textContent = order.deliveryTime;
    document.getElementById('orderComment').textContent = order.comment || '—';
    document.getElementById('orderTotal').textContent = `${order.total} руб.`;

    const container = document.getElementById('orderItemsList');
    container.innerHTML = '';
    order.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <div class="order-item__info">
                <div class="order-item__name">${escapeHtml(item.name)}</div>
                <div class="order-item__qty">${item.qty} шт.</div>
            </div>
            <div class="order-item__sum">${item.sum} руб.</div>
        `;
        container.appendChild(itemDiv);
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

export function initAccount() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    if (tabBtns.length) {
        const switchTab = (tabId) => {
            tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
            panes.forEach(pane => pane.classList.toggle('active', pane.id === `tab-${tabId}`));
        };
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.dataset.tab;
                if (id) switchTab(id);
            });
        });
    }

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Личные данные обновлены (демо).');
        });
    }

    const pwdForm = document.getElementById('passwordForm');
    if (pwdForm) {
        pwdForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPwd = pwdForm.querySelector('[name="newPassword"]').value;
            const confirmPwd = pwdForm.querySelector('[name="confirmPassword"]').value;
            if (newPwd !== confirmPwd) {
                alert('Пароли не совпадают');
                return;
            }
            alert('Пароль изменён (демо).');
            pwdForm.reset();
        });
    }

    document.querySelectorAll('.pay-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Перенаправление на оплату заказа (демо).');
        });
    });

    const popup = document.getElementById('orderDetailsPopup');
    if (popup) {
        document.querySelectorAll('.order-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const orderId = btn.getAttribute('data-order-id');
                if (orderId) {
                    fillOrderDetails(orderId);
                    openPopup(popup);
                }
            });
        });

        const closeBtn = popup.querySelector('.popup-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popup.classList.remove('active');
            });
        }
    }
}
