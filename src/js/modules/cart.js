export function initCart() {
    const cartWrapper = document.getElementById('cartWrapper');
    const emptyCartBlock = document.getElementById('emptyCartBlock');
    if (!cartWrapper || !emptyCartBlock) return;
    const cartProducts = document.getElementById('cartProducts');
    const cartExtraBlock = document.getElementById('cartExtraBlock');
    const cartExtraList = document.getElementById('cartExtraList');
    const summaryRows = document.getElementById('summaryRows');
    const totalPriceSpan = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const mainSection = document.getElementById('cartMainBlock');
    let cartData = {
        main: [
            {
                id: '211',
                title: 'Букет №19 Роз Джумилия',
                sku: '211',
                price: 177,
                quantity: 1,
                image: './img/jpg/buket1.jpg',
                props: {
                    size: 'Высота 70 см',
                    color: 'Розовый',
                    composition: 'Роза красная (25 шт), Лента (1 шт)'
                    // event удалён
                }
            },
            {
                id: '221',
                title: 'Букет №21 Роз Джумилия 2',
                sku: '221',
                price: 187,
                quantity: 1,
                image: './img/jpg/buket2.jpg',
                props: {
                    size: 'Высота 60 см',
                    color: 'Белый / Розовый',
                    composition: 'Роза розовая (25 шт), Лента (1 шт)'
                }
            }
        ],
        extra: [
            {
                id: 'extra1',
                title: 'Открытка №21',
                sku: '2211',
                price: 10,
                quantity: 1,
                image: './img/jpg/postcard.jpg',
                props: null
            }
        ]
    };
    let currentDeliveryType = 'pickup';
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, (m) => {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    function showNotification(text, isError = false) {
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        if (isError) toast.style.background = '#c23d3d';
        toast.innerText = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    function renderSpecs(props) {
        if (!props) return '';
        const items = [];
        if (props.size) items.push(`<div class="spec-item"><span class="spec-label">Размер:</span> ${escapeHtml(props.size)}</div>`);
        if (props.color) items.push(`<div class="spec-item"><span class="spec-label">Цвет:</span> ${escapeHtml(props.color)}</div>`);
        if (props.composition) items.push(`<div class="spec-item"><span class="spec-label">Состав:</span> ${escapeHtml(props.composition)}</div>`);
        return `<div class="cart-item__specs">${items.join('')}</div>`;
    }
    function renderCartItem(item, type) {
        const isExtra = type === 'extra';
        const specsHtml = (!isExtra && item.props) ? renderSpecs(item.props) : '';
        return `
            <div class="cart-item ${isExtra ? 'cart-item--extra' : ''}" data-id="${item.id}" data-price="${item.price}" data-type="${type}">
                <div class="cart-item__image">
                    <img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy">
                </div>
                <div class="cart-item__main">
                    <h3 class="cart-item__title">${escapeHtml(item.title)}</h3>
                    <div class="cart-item__sku">Артикул: ${item.sku}</div>
                    <div class="cart-item__price">${item.price} руб.</div>
                    <div class="cart-item__quantity">
                        <button class="cart-item__minus" type="button"></button>
                        <input type="number" value="${item.quantity}" min="1" step="1" data-quantity-input>
                        <button class="cart-item__plus" type="button"></button>
                    </div>
                </div>
                ${specsHtml}
                <button class="cart-item__remove" title="Удалить">
                    <svg class="cart-item__remove-icon" viewBox="0 0 24 24">
                        <use xlink:href="./img/sprites.svg#icon-trash"></use>
                    </svg>
                </button>
            </div>
        `;
    }
    function updateTotals() {
        let total = 0;
        const rows = [];
        [...cartData.main, ...cartData.extra].forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            rows.push({ title: item.title, quantity: item.quantity, total: itemTotal });
        });
        if (summaryRows) {
            summaryRows.innerHTML = rows.map(row => `
                <div class="cart-summary__row">
                    <span>${escapeHtml(row.title)} × ${row.quantity}</span>
                    <span>${row.total} руб.</span>
                </div>
            `).join('');
            if (rows.length === 0) summaryRows.innerHTML = '<div class="cart-summary__row">Нет товаров</div>';
        }
        if (totalPriceSpan) totalPriceSpan.innerText = `${total} руб.`;
    }
    function updateDeliveryDisplay() {
        const deliveryInfoSpan = document.getElementById('deliveryInfoText');
        const footnote = document.querySelector('.cart-summary__footnote');
        if (currentDeliveryType === 'courier') {
            if (deliveryInfoSpan) deliveryInfoSpan.innerText = 'Платно';
            if (footnote) footnote.classList.remove('hidden');
        } else {
            if (deliveryInfoSpan) deliveryInfoSpan.innerText = 'Бесплатно';
            if (footnote) footnote.classList.add('hidden');
        }
    }
    function renderCart() {
        const hasMain = cartData.main.length > 0;
        const hasExtra = cartData.extra.length > 0;

        if (!hasMain && !hasExtra) {
            cartWrapper.style.display = 'none';
            emptyCartBlock.classList.remove('hidden');
            return;
        }
        cartWrapper.style.display = 'flex';
        emptyCartBlock.classList.add('hidden');

        if (mainSection) {
            if (hasMain) mainSection.classList.remove('hidden');
            else mainSection.classList.add('hidden');
        }

        if (cartProducts) {
            cartProducts.innerHTML = cartData.main.map(item => renderCartItem(item, 'main')).join('');
        }

        if (hasExtra && cartExtraList) {
            cartExtraList.innerHTML = cartData.extra.map(item => renderCartItem(item, 'extra')).join('');
            cartExtraBlock.classList.remove('hidden');
        } else if (cartExtraBlock) {
            cartExtraBlock.classList.add('hidden');
        }
        updateTotals();
        updateDeliveryDisplay();
        attachEvents();
    }
    function attachEvents() {
        document.querySelectorAll('.cart-item__minus, .cart-item__plus').forEach(btn => {
            btn.removeEventListener('click', handleQuantity);
            btn.addEventListener('click', handleQuantity);
        });
        document.querySelectorAll('[data-quantity-input]').forEach(input => {
            input.removeEventListener('change', handleQuantityInput);
            input.addEventListener('change', handleQuantityInput);
        });
        document.querySelectorAll('.cart-item__remove').forEach(btn => {
            btn.removeEventListener('click', handleRemove);
            btn.addEventListener('click', handleRemove);
        });
    }
    function handleQuantity(e) {
        const btn = e.currentTarget;
        const itemDiv = btn.closest('.cart-item');
        if (!itemDiv) return;
        const id = itemDiv.dataset.id;
        const type = itemDiv.dataset.type;
        const delta = btn.classList.contains('cart-item__plus') ? 1 : -1;
        let item = (type === 'main') ? cartData.main.find(i => i.id === id) : cartData.extra.find(i => i.id === id);
        if (!item) return;
        item.quantity = Math.max(1, item.quantity + delta);
        const input = itemDiv.querySelector('[data-quantity-input]');
        if (input) input.value = item.quantity;
        updateTotals();
    }
    function handleQuantityInput(e) {
        const input = e.currentTarget;
        const itemDiv = input.closest('.cart-item');
        if (!itemDiv) return;
        const id = itemDiv.dataset.id;
        const type = itemDiv.dataset.type;
        let newVal = parseInt(input.value);
        if (isNaN(newVal) || newVal < 1) newVal = 1;
        let item = (type === 'main') ? cartData.main.find(i => i.id === id) : cartData.extra.find(i => i.id === id);
        if (item) {
            item.quantity = newVal;
            updateTotals();
        }
    }
    function handleRemove(e) {
        const btn = e.currentTarget;
        const itemDiv = btn.closest('.cart-item');
        if (!itemDiv) return;
        const id = itemDiv.dataset.id;
        const type = itemDiv.dataset.type;
        itemDiv.classList.add('removing');
        setTimeout(() => {
            if (type === 'main') cartData.main = cartData.main.filter(i => i.id !== id);
            else cartData.extra = cartData.extra.filter(i => i.id !== id);
            renderCart();
        }, 250);
    }
    function submitOrder() {
        const customerName = document.getElementById('customerName')?.value.trim();
        const customerPhone = document.getElementById('customerPhone')?.value.trim();
        if (!customerName || !customerPhone) {
            showNotification('Пожалуйста, заполните имя и телефон заказчика', true);
            return false;
        }
        const deliveryTypeRadio = document.querySelector('input[name="delivery"]:checked');
        const deliveryType = deliveryTypeRadio ? deliveryTypeRadio.value : 'pickup';
        let recipientName = '';
        let recipientPhone = '';
        let recipientAddress = '';
        if (deliveryType === 'courier') {
            recipientName = document.getElementById('recipientName')?.value.trim();
            recipientPhone = document.getElementById('recipientPhone')?.value.trim();
            const street = document.getElementById('street')?.value.trim();
            const house = document.getElementById('house')?.value.trim();
            const apartment = document.getElementById('apartment')?.value.trim();
            if (!recipientName || !recipientPhone || !street || !house) {
                showNotification('Для курьерской доставки заполните имя получателя, телефон, улицу и дом', true);
                return false;
            }
            recipientAddress = `${street}, ${house}${apartment ? ', кв. ' + apartment : ''}`;
        } else {
            recipientName = customerName;
            recipientPhone = customerPhone;
            recipientAddress = 'Самовывоз (ул. Веры Хоружей, 17)';
        }
        const date = document.getElementById('deliveryDate')?.value;
        const time = document.getElementById('deliveryTime')?.value;
        if (!date || !time) {
            showNotification('Выберите дату и время доставки', true);
            return false;
        }
        const total = [...cartData.main, ...cartData.extra].reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderData = {
            orderNumber: Math.floor(Math.random() * 1000000),
            customerName,
            customerPhone,
            deliveryType: deliveryType === 'courier' ? 'Курьерская доставка (платно)' : 'Самовывоз (бесплатно)',
            deliveryDate: date,
            deliveryTime: time,
            recipientName,
            recipientPhone,
            recipientAddress,
            total,
            items: [...cartData.main, ...cartData.extra].map(item => ({
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity
            }))
        };
        sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
        cartData.main = [];
        cartData.extra = [];
        renderCart();
        window.location.href = './page-thankyou.html';
        return true;
    }

    function initCustomSelect() {
        const container = document.querySelector('[data-custom-select]');
        if (!container) return;
        const trigger = container.querySelector('.cart-time-select__trigger');
        const options = container.querySelector('.cart-time-select__options');
        const hidden = container.querySelector('#deliveryTime');
        const textSpan = trigger.querySelector('.cart-time-select__text');
        const open = () => { container.classList.add('open'); document.addEventListener('click', outside); };
        const close = () => { container.classList.remove('open'); document.removeEventListener('click', outside); };
        const outside = (e) => { if (!container.contains(e.target)) close(); };
        trigger.addEventListener('click', (e) => { e.stopPropagation(); container.classList.contains('open') ? close() : open(); });
        options.querySelectorAll('li').forEach(opt => {
            opt.addEventListener('click', () => {
                if (hidden) hidden.value = opt.dataset.value;
                textSpan.textContent = opt.textContent;
                textSpan.classList.remove('placeholder');
                options.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
                opt.classList.add('selected');
                close();
            });
        });
    }
    function initDatepicker() {
        const input = document.getElementById('deliveryDate');
        if (input && typeof Datepicker !== 'undefined') {
            new Datepicker(input, {
                language: 'ru',
                format: 'dd.mm.yyyy',
                autohide: true,
                minDate: new Date()
            });
        }
    }
    const radios = document.querySelectorAll('input[name="delivery"]');
    const courierBlock = document.querySelector('.cart-delivery__courier');
    const pickupBlock = document.querySelector('.cart-delivery__pickup');
    function toggleDelivery() {
        const selected = document.querySelector('input[name="delivery"]:checked');
        if (!selected) return;

        if (selected.value === 'courier') {
            currentDeliveryType = 'courier';
            if (courierBlock) courierBlock.classList.remove('hidden');
            if (pickupBlock) pickupBlock.style.display = 'none';   // скрываем адрес самовывоза
        } else {
            currentDeliveryType = 'pickup';
            if (courierBlock) courierBlock.classList.add('hidden');
            if (pickupBlock) pickupBlock.style.display = 'flex';   // показываем адрес самовывоза
        }
        updateDeliveryDisplay();
    }
    if (radios.length && courierBlock && pickupBlock) {
        radios.forEach(r => r.addEventListener('change', toggleDelivery));
        toggleDelivery(); // установка начального состояния
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            submitOrder();
        });
    }

    renderCart();
    initCustomSelect();
    initDatepicker();
}
