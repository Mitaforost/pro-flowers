export function initCatalogFilters() {
    const filters = document.querySelector('.filters');
    if (!filters) return;
    const body = document.body;
    const openButton = document.querySelector('.catalog-page__filters-btn');
    const closeButton = document.querySelector('.filters__close');
    const applyButton = document.querySelector('.filters__apply');
    const fade = document.querySelector('.fade');
    const groups = document.querySelectorAll('.filter-group');
    const activeFiltersWrapper = document.querySelector('.active-filters');
    const filtersCount = document.querySelector('.catalog-page__filters-count');

    // ---- ПОЛУЧЕНИЕ ТЕКСТА ДЛЯ ФИЛЬТРА ----
    function getOptionText(input) {
        const label = input.closest('.checkbox, .radio, .color-radio');
        if (!label) return '';
        if (label.classList.contains('color-radio')) {
            return label.querySelector('.color-radio__text')?.innerText.trim() || '';
        }
        return label.querySelector('span')?.innerText.trim() || '';
    }

    // ---- ХРАНИЛИЩЕ ТЕКУЩИХ АКТИВНЫХ ФИЛЬТРОВ ----
    let currentActiveInputs = [];

    function getActiveFiltersData() {
        return [...document.querySelectorAll('.filter-group input:checked')].map(input => ({
            input,
            text: getOptionText(input)
        }));
    }

    // ---- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ АНИМАЦИИ ----
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function findChipByText(text) {
        const chips = document.querySelectorAll('.active-filters__item');
        for (let chip of chips) {
            const span = chip.querySelector('span');
            if (span && span.innerText.trim() === text) return chip;
        }
        return null;
    }

    function removeChipWithAnimation(chipElement, onRemoved) {
        if (!chipElement) return;
        chipElement.classList.add('removing');
        chipElement.addEventListener('transitionend', function handler() {
            chipElement.removeEventListener('transitionend', handler);
            if (onRemoved) onRemoved();
        });
    }

    function addChipToList(text, onClickRemove) {
        const list = document.querySelector('.active-filters__list');
        if (!list) return;

        const chip = document.createElement('li');
        chip.className = 'active-filters__item';
        chip.innerHTML = `
            <span>${escapeHtml(text)}</span>
            <button class="active-filters__remove" type="button" data-text="${escapeHtml(text)}"></button>
        `;
        const removeBtn = chip.querySelector('.active-filters__remove');
        removeBtn.addEventListener('click', () => {
            onClickRemove(text);
        });

        list.appendChild(chip);

        // Анимация появления
        chip.style.opacity = '0';
        chip.style.transform = 'scale(0.9)';
        requestAnimationFrame(() => {
            chip.style.transition = 'opacity 0.2s, transform 0.2s';
            chip.style.opacity = '1';
            chip.style.transform = 'scale(1)';
            chip.addEventListener('transitionend', () => {
                chip.style.removeProperty('opacity');
                chip.style.removeProperty('transform');
                chip.style.removeProperty('transition');
            }, { once: true });
        });
    }

    function updateUIAfterSync() {
        const activeCount = currentActiveInputs.length;
        if (filtersCount) {
            filtersCount.textContent = activeCount;
            filtersCount.classList.toggle('is-visible', activeCount > 0);
        }
        if (activeFiltersWrapper) {
            activeFiltersWrapper.style.display = activeCount ? 'block' : 'none';
        }
    }

    // ---- ОСНОВНАЯ ФУНКЦИЯ СИНХРОНИЗАЦИИ АКТИВНЫХ ФИЛЬТРОВ ----
    function syncActiveFilters() {
        const newActiveData = getActiveFiltersData();
        const oldActiveData = currentActiveInputs;

        const removed = oldActiveData.filter(old => !newActiveData.some(newItem => newItem.text === old.text));
        const added = newActiveData.filter(newItem => !oldActiveData.some(old => old.text === newItem.text));

        let removalCompleted = removed.length === 0;
        let removedCount = 0;

        if (removed.length === 0) {
            removalCompleted = true;
        } else {
            removed.forEach(removedItem => {
                const chipToRemove = findChipByText(removedItem.text);
                if (chipToRemove) {
                    removeChipWithAnimation(chipToRemove, () => {
                        chipToRemove.remove();
                        removedCount++;
                        if (removedCount === removed.length) {
                            removalCompleted = true;
                            if (removalCompleted && added.length === 0) {
                                checkScrollIndicators();
                            }
                        }
                    });
                } else {
                    removedCount++;
                    if (removedCount === removed.length) {
                        removalCompleted = true;
                    }
                }
            });
        }

        let addCount = 0;
        added.forEach(addedItem => {
            addChipToList(addedItem.text, (text) => {
                const targetInput = newActiveData.find(item => item.text === text)?.input;
                if (targetInput && targetInput.checked) {
                    targetInput.checked = false;
                    targetInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            addCount++;
            if (addCount === added.length && removalCompleted) {
                checkScrollIndicators();
            }
        });

        if (added.length === 0 && removalCompleted) {
            checkScrollIndicators();
        }

        currentActiveInputs = newActiveData;
        updateUIAfterSync();
    }

    // ---- ОБНОВЛЕНИЕ СЧЁТЧИКОВ В ГРУППАХ ----
    function updateGroupCounter(group) {
        let counter = group.querySelector('.filter-group__count');
        const checked = group.querySelectorAll('input:checked').length;
        if (!checked) {
            counter?.remove();
            return;
        }
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'filter-group__count';
            group.querySelector('.filter-group__title')?.append(counter);
        }
        counter.textContent = `(${checked})`;
    }

    function updateGroupsHeight() {
        groups.forEach(group => {
            const content = group.querySelector('.filter-group__content');
            if (group.classList.contains('filter-group--open')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    }

    function updateAll() {
        groups.forEach(updateGroupCounter);
        updateGroupsHeight();
        syncActiveFilters();
    }

    // ---- ОБРАБОТЧИКИ ОТКРЫТИЯ/ЗАКРЫТИЯ ФИЛЬТРОВ ----
    const openFilters = () => {
        filters.classList.add('active');
        fade?.classList.add('active');
        body.classList.add('body--no-scroll');
    };
    const closeFilters = () => {
        filters.classList.remove('active');
        fade?.classList.remove('active');
        body.classList.remove('body--no-scroll');
    };

    openButton?.addEventListener('click', openFilters);
    closeButton?.addEventListener('click', closeFilters);
    fade?.addEventListener('click', closeFilters);
    applyButton?.addEventListener('click', closeFilters);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeFilters();
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeFilters();
        updateGroupsHeight();
    });

    // ---- АККОРДЕОНЫ В ГРУППАХ ФИЛЬТРОВ ----
    groups.forEach(group => {
        const header = group.querySelector('.filter-group__header');
        const content = group.querySelector('.filter-group__content');
        if (group.classList.contains('filter-group--open')) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
        header?.addEventListener('click', () => {
            const isOpen = group.classList.contains('filter-group--open');
            if (isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    content.style.maxHeight = '0px';
                });
                group.classList.remove('filter-group--open');
            } else {
                group.classList.add('filter-group--open');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
    filters.addEventListener('change', e => {
        if (e.target.matches('input')) {
            updateAll();
        }
    });

    const clearActiveBtn = document.querySelector('.active-filters__clear');
    if (clearActiveBtn) {
        clearActiveBtn.addEventListener('click', () => {
            const allChips = document.querySelectorAll('.active-filters__item');
            if (allChips.length === 0) return;

            let removedCount = 0;
            allChips.forEach(chip => {
                removeChipWithAnimation(chip, () => {
                    chip.remove();
                    removedCount++;
                    if (removedCount === allChips.length) {
                        document.querySelectorAll('.filter-group input').forEach(input => {
                            input.checked = false;
                        });
                        currentActiveInputs = [];
                        updateUIAfterSync();
                        groups.forEach(updateGroupCounter);
                        if (window.priceSlider && window.priceSlider.noUiSlider) {
                            const min = window.priceSliderMin;
                            const max = window.priceSliderMax;
                            window.priceSlider.noUiSlider.set([min, max]);
                            const minInput = document.getElementById('minPrice');
                            const maxInput = document.getElementById('maxPrice');
                            if (minInput) minInput.value = min;
                            if (maxInput) maxInput.value = max;
                        }
                        checkScrollIndicators();
                    }
                });
            });
        });
    }

    // ---- КНОПКА "СБРОСИТЬ" В ФИЛЬТРАХ ----
    const resetBtn = document.querySelector('.filters__reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            // Анимированно удаляем все чипсы
            const allChips = document.querySelectorAll('.active-filters__item');
            if (allChips.length) {
                let removedCount = 0;
                allChips.forEach(chip => {
                    removeChipWithAnimation(chip, () => {
                        chip.remove();
                        removedCount++;
                        if (removedCount === allChips.length) {
                            document.querySelectorAll('.filter-group input').forEach(input => {
                                input.checked = false;
                            });
                            currentActiveInputs = [];
                            updateUIAfterSync();
                            groups.forEach(updateGroupCounter);
                            if (window.priceSlider && window.priceSlider.noUiSlider) {
                                const min = window.priceSliderMin;
                                const max = window.priceSliderMax;
                                window.priceSlider.noUiSlider.set([min, max]);
                                const minInput = document.getElementById('minPrice');
                                const maxInput = document.getElementById('maxPrice');
                                if (minInput) minInput.value = min;
                                if (maxInput) maxInput.value = max;
                            }
                        }
                    });
                });
            } else {
                // Если чипсов нет, просто сбрасываем чекбоксы и слайдер
                document.querySelectorAll('.filter-group input').forEach(input => {
                    input.checked = false;
                });
                currentActiveInputs = [];
                updateUIAfterSync();
                groups.forEach(updateGroupCounter);
                if (window.priceSlider && window.priceSlider.noUiSlider) {
                    const min = window.priceSliderMin;
                    const max = window.priceSliderMax;
                    window.priceSlider.noUiSlider.set([min, max]);
                    const minInput = document.getElementById('minPrice');
                    const maxInput = document.getElementById('maxPrice');
                    if (minInput) minInput.value = min;
                    if (maxInput) maxInput.value = max;
                }
            }
        });
    }

    // ---- КАСТОМНЫЙ SELECT ----
    function initCustomSelect(selectWrapper) {
        const trigger = selectWrapper.querySelector('.custom-select__trigger');
        const optionsContainer = selectWrapper.querySelector('.custom-select__options');
        const hiddenSelect = selectWrapper.querySelector('.custom-select__hidden-select');
        const textSpan = selectWrapper.querySelector('.custom-select__text');
        if (!trigger || !optionsContainer || !hiddenSelect || !textSpan) return;

        const options = optionsContainer.querySelectorAll('li');
        const updateSelected = selectedLi => {
            if (!selectedLi) return;
            const value = selectedLi.dataset.value;
            const text = selectedLi.innerText.trim();
            hiddenSelect.value = value;
            textSpan.innerText = text;
            options.forEach(opt => opt.classList.remove('selected'));
            selectedLi.classList.add('selected');
        };

        trigger.addEventListener('click', e => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select.open').forEach(select => {
                if (select !== selectWrapper) select.classList.remove('open');
            });
            selectWrapper.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                updateSelected(option);
                selectWrapper.classList.remove('open');
                hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });

        document.addEventListener('click', () => {
            selectWrapper.classList.remove('open');
        });

        const defaultOption = [...options].find(opt => opt.dataset.value === hiddenSelect.value) || options[0];
        if (defaultOption) updateSelected(defaultOption);
    }
    document.querySelectorAll('.custom-select').forEach(initCustomSelect);
    function checkScrollIndicators() {
        const container = document.querySelector('.active-filters__scroll-container');
        const list = document.querySelector('.active-filters__list');
        if (!container || !list) return;
        const hasScroll = list.scrollWidth > list.clientWidth;
        container.classList.toggle('has-scroll', hasScroll);
    }

// 👇 НОВЫЙ КОД: горизонтальный скролл колёсиком
    const activeFiltersList = document.querySelector('.active-filters__list');
    if (activeFiltersList) {
        activeFiltersList.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                activeFiltersList.scrollLeft += e.deltaY;
            }
        });
    }
    // ---- СЛАЙДЕР ЦЕН ----
    function initPriceSlider() {
        const sliderElement = document.getElementById('priceSlider');
        const minInput = document.getElementById('minPrice');
        const maxInput = document.getElementById('maxPrice');
        if (!sliderElement || !minInput || !maxInput) return;
        if (typeof noUiSlider === 'undefined') {
            console.warn('noUiSlider не подключен');
            return;
        }
        const productCards = document.querySelectorAll('.product-card');
        let prices = [];
        productCards.forEach(card => {
            const price = parseInt(card.dataset.price);
            if (!isNaN(price)) prices.push(price);
        });
        let minPrice = prices.length ? Math.min(...prices) : 0;
        let maxPrice = prices.length ? Math.max(...prices) : 1000;
        if (minPrice === maxPrice) maxPrice = minPrice + 100;

        let startMin = parseInt(minInput.value);
        let startMax = parseInt(maxInput.value);
        if (isNaN(startMin)) startMin = minPrice;
        if (isNaN(startMax)) startMax = maxPrice;

        const slider = noUiSlider.create(sliderElement, {
            start: [startMin, startMax],
            connect: true,
            step: 1,
            range: { min: minPrice, max: maxPrice },
            format: { to: value => Math.round(value), from: value => Number(value) }
        });
        window.priceSlider = sliderElement;
        window.priceSliderMin = minPrice;
        window.priceSliderMax = maxPrice;

        slider.on('update', (values, handle) => {
            if (handle === 0) minInput.value = Math.round(values[0]);
            else maxInput.value = Math.round(values[1]);
        });
        minInput.addEventListener('change', () => {
            let val = parseInt(minInput.value);
            if (isNaN(val)) val = minPrice;
            val = Math.min(Math.max(val, minPrice), parseInt(maxInput.value) || maxPrice);
            slider.set([val, null]);
        });
        maxInput.addEventListener('change', () => {
            let val = parseInt(maxInput.value);
            if (isNaN(val)) val = maxPrice;
            val = Math.min(Math.max(val, parseInt(minInput.value) || minPrice), maxPrice);
            slider.set([null, val]);
        });
    }
    initPriceSlider();

    // ---- ИНИЦИАЛИЗАЦИЯ ХРАНИЛИЩА И ПЕРВИЧНАЯ СИНХРОНИЗАЦИЯ ----
    checkScrollIndicators();
    currentActiveInputs = getActiveFiltersData();
    syncActiveFilters();
    updateAll();
}
