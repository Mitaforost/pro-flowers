import { openPopup } from './popup-base.js';

/**
 * Инициализация логики одного кастомного селекта
 * @param {HTMLElement} container - корневой элемент селекта (.popup-service__custom-select)
 */
function initCustomSelect(container) {
    const trigger = container.querySelector('.popup-service__custom-select-trigger');
    const textSpan = container.querySelector('.popup-service__custom-select-text');
    const hiddenInput = container.querySelector('input[type="hidden"]');
    const optionsList = container.querySelector('.popup-service__custom-select-options');
    const arrow = container.querySelector('.popup-service__custom-select-arrow');

    // Открытие/закрытие по клику на триггер
    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // чтобы не сработал document.click сразу
        const isOpen = container.classList.contains('open');

        // Закрываем все остальные открытые селекты
        document.querySelectorAll('.popup-service__custom-select.open').forEach(el => {
            if (el !== container) {
                el.classList.remove('open');
                el.querySelector('.popup-service__custom-select-trigger')?.setAttribute('aria-expanded', 'false');
            }
        });

        container.classList.toggle('open');
        trigger.setAttribute('aria-expanded', !isOpen);
    });

    // Выбор опции из списка
    optionsList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;

        const value = li.dataset.value;
        const text = li.textContent;

        // Обновляем текст триггера
        textSpan.textContent = text;
        textSpan.classList.remove('placeholder');

        // Обновляем скрытый инпут
        hiddenInput.value = value;

        // Выделяем выбранную опцию
        optionsList.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
        li.classList.add('selected');

        // Закрываем список
        container.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
    });

    // Сброс селекта к исходному состоянию
    container.reset = function() {
        container.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        textSpan.textContent = 'Удобный способ связи';
        textSpan.classList.add('placeholder');
        hiddenInput.value = '';
        optionsList.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    };
}

/**
 * Закрытие всех кастомных селектов при клике вне их
 */
function addGlobalCloseHandler() {
    document.addEventListener('click', (e) => {
        const clickedSelect = e.target.closest('.popup-service__custom-select');
        if (!clickedSelect) {
            document.querySelectorAll('.popup-service__custom-select.open').forEach(el => {
                el.classList.remove('open');
                const trig = el.querySelector('.popup-service__custom-select-trigger');
                if (trig) trig.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

/**
 * Сброс всех кастомных селектов внутри контейнера (например, попапа)
 * @param {HTMLElement} container
 */
function resetCustomSelects(container) {
    container.querySelectorAll('.popup-service__custom-select').forEach(select => {
        if (typeof select.reset === 'function') {
            select.reset();
        }
    });
}

// Основная инициализация попапа
export function initServicePopup() {
    const popup = document.querySelector('#servicePopup');
    if (!popup) {
        console.error('Popup #servicePopup not found');
        return;
    }

    // Инициализируем все кастомные селекты в попапе
    popup.querySelectorAll('.popup-service__custom-select').forEach(initCustomSelect);

    // Глобальный обработчик кликов для закрытия селектов (добавляем один раз)
    addGlobalCloseHandler();

    const popupTitle = popup.querySelector('#servicePopupTitle');
    const popupDescription = popup.querySelector('#servicePopupDescription');
    const popupImage = popup.querySelector('#servicePopupImage');

    const cards = document.querySelectorAll('.services-card');

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const title = card.dataset.serviceTitle;
            const description = card.dataset.serviceDescription;
            const image = card.dataset.serviceImage;

            popupTitle.textContent = title || '';
            popupDescription.textContent = description || '';
            popupImage.src = image || '';
            popupImage.alt = title || '';

            // Сбрасываем все кастомные селекты перед открытием
            resetCustomSelects(popup);

            openPopup(popup);
        });
    });
}
