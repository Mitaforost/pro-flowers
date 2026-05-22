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
    const activeFiltersList = document.querySelector('.active-filters__list');
    const filtersCount = document.querySelector('.catalog-page__filters-count');
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
        if (e.key === 'Escape') {
            closeFilters();
        }
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeFilters();
        }
        updateGroupsHeight();
    });
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
    function getOptionText(input) {
        const label = input.closest('.checkbox, .radio, .color-radio');
        if (!label) return '';
        if (label.classList.contains('color-radio')) {
            return label.querySelector('.color-radio__text')?.innerText.trim() || '';
        }
        return label.querySelector('span')?.innerText.trim() || '';
    }
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
    function renderActiveFilters() {
        const activeInputs = [...document.querySelectorAll('.filter-group input:checked')];
        if (filtersCount) {
            filtersCount.textContent = activeInputs.length;
            filtersCount.classList.toggle('is-visible', activeInputs.length > 0);
        }
        if (activeFiltersWrapper) {
            activeFiltersWrapper.style.display = activeInputs.length ? 'block' : 'none';
        }
        if (!activeFiltersList) return;
        activeFiltersList.innerHTML = activeInputs.map(input => {
            const text = getOptionText(input);
            return `
                <li class="active-filters__item">
                    <span>${text}</span>
                    <button class="active-filters__remove" type="button" data-text="${text}"></button>
                </li>
            `;
        }).join('');
        activeFiltersList.querySelectorAll('.active-filters__remove').forEach(button => {
            button.addEventListener('click', () => {
                const target = [...document.querySelectorAll('.filter-group input:checked')].find(input => getOptionText(input) === button.dataset.text);
                if (!target) return;
                target.checked = false;
                target.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }
    function updateAll() {
        groups.forEach(updateGroupCounter);
        updateGroupsHeight();
        renderActiveFilters();
    }
    filters.addEventListener('change', e => {
        if (e.target.matches('input')) {
            updateAll();
        }
    });
    document.querySelector('.active-filters__clear')?.addEventListener('click', () => {
        document.querySelectorAll('.filter-group input').forEach(input => {
            input.checked = false;
        });
        updateAll();
    });
    document.querySelector('.filters__reset')?.addEventListener('click', () => {
        document.querySelectorAll('.filter-group input').forEach(input => {
            input.checked = false;
        });
        updateAll();
    });
    function initCustomSelect(selectWrapper) {
        const trigger = selectWrapper.querySelector('.custom-select__trigger');
        const optionsContainer = selectWrapper.querySelector('.custom-select__options');
        const hiddenSelect = selectWrapper.querySelector('.custom-select__hidden-select');
        const textSpan = selectWrapper.querySelector('.custom-select__text');
        if (!trigger || !optionsContainer || !hiddenSelect || !textSpan) {
            return;
        }
        const options = optionsContainer.querySelectorAll('li');
        const updateSelected = selectedLi => {
            if (!selectedLi) return;
            const value = selectedLi.dataset.value;
            const text = selectedLi.innerText.trim();
            hiddenSelect.value = value;
            textSpan.innerText = text;
            options.forEach(option => {
                option.classList.remove('selected');
            });
            selectedLi.classList.add('selected');
        };
        trigger.addEventListener('click', e => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select.open').forEach(select => {
                if (select !== selectWrapper) {
                    select.classList.remove('open');
                }
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
        const defaultOption = [...options].find(option => option.dataset.value === hiddenSelect.value) || options[0];
        if (defaultOption) {
            updateSelected(defaultOption);
        }
    }
    document.querySelectorAll('.custom-select').forEach(initCustomSelect);
    updateAll();
}
