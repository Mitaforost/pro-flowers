import { createSlider } from './slider-base';

export function initReviewsSlider() {
    const el = document.querySelector('[data-slider="reviews"]');
    if (!el) return;

    const swiper = createSlider(el, {
        slidesPerView: 3,
        spaceBetween: 20,
        autoHeight: false,
        watchSlidesProgress: true,

        autoplay: {
            delay: 4000,
            disableOnInteraction: true,
        },

        navigation: {
            nextEl: '.reviews__arrow--next',
            prevEl: '.reviews__arrow--prev',
        },

        breakpoints: {
            0: { slidesPerView: 1.1, spaceBetween: 15 },
            576: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
        },
    });

    initReviewsExpand(swiper);
    return swiper;
}

function initReviewsExpand(swiper) {
    const container = swiper.el;

    // ======================
    // SAFETY STATE (NEW)
    // ======================
    let isAnimating = false;
    let lastTapTime = 0;

    function getOpenedCards() {
        return container.querySelectorAll('.review-card.open');
    }

    function hasOpened() {
        return getOpenedCards().length > 0;
    }

    function lockSlider() {
        swiper.allowTouchMove = false;
        swiper.autoplay?.stop();
    }

    function unlockSlider() {
        swiper.allowTouchMove = true;
        swiper.autoplay?.start?.();
    }

    // ======================
    // SETUP CARDS
    // ======================
    function setupCards() {
        const cards = container.querySelectorAll('.review-card');

        cards.forEach(card => {
            const text = card.querySelector('.review-card__text');
            if (!text) return;

            text.style.maxHeight = 'none';

            const fullHeight = text.scrollHeight;
            const lineHeight = parseFloat(getComputedStyle(text).lineHeight);
            const collapsedHeight = lineHeight * 4;

            card.dataset.collapsed = collapsedHeight;
            card.dataset.full = fullHeight;

            if (fullHeight > collapsedHeight + 5) {
                text.style.maxHeight = collapsedHeight + 'px';

                let btn = card.querySelector('.review-card__more');
                if (!btn) {
                    btn = document.createElement('button');
                    btn.className = 'review-card__more';
                    btn.textContent = 'Читать полностью';
                    text.after(btn);
                }

                btn.style.display = 'inline-block';
            } else {
                text.style.maxHeight = collapsedHeight + 'px';

                const btn = card.querySelector('.review-card__more');
                if (btn) btn.remove();
            }
        });
    }

    setTimeout(setupCards, 0);

    // ======================
    // RESIZE FIX (SAFE)
    // ======================
    let lastWidth = window.innerWidth;
    let resizeTimer;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;

            closeAll();
            setupCards();
        }, 200);
    });

    // ======================
    // OPEN / CLOSE LOGIC
    // ======================
    function openCard(card) {
        const text = card.querySelector('.review-card__text');

        text.style.maxHeight = card.dataset.full + 'px';
        card.classList.add('open');

        const btn = card.querySelector('.review-card__more');
        if (btn) btn.textContent = 'Свернуть';

        lockSlider();

        setTimeout(() => {
            isAnimating = false;
        }, 450);
    }

    function closeCard(card) {
        const text = card.querySelector('.review-card__text');

        text.style.maxHeight = card.dataset.collapsed + 'px';
        card.classList.remove('open');

        const btn = card.querySelector('.review-card__more');
        if (btn) btn.textContent = 'Читать полностью';

        if (!hasOpened()) {
            unlockSlider();
        }

        setTimeout(() => {
            isAnimating = false;
        }, 450);
    }

    function closeAll() {
        getOpenedCards().forEach(card => closeCard(card));
        unlockSlider();
    }

    // ======================
    // CLICK HANDLER (FIXED iOS DOUBLE TAP)
    // ======================
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('.review-card__more');
        if (!btn) return;

        const now = Date.now();

        // 🔥 защита от двойного тапа Safari
        if (now - lastTapTime < 350) return;
        lastTapTime = now;

        if (isAnimating) return;
        isAnimating = true;

        const card = btn.closest('.review-card');

        if (card.classList.contains('open')) {
            closeCard(card);
        } else {
            openCard(card);
        }
    });

    // ======================
    // SWIPER SAFETY (FIX iOS)
    // ======================
    swiper.on('touchStart', (swiper, event) => {
        const target = event?.target;

        if (
            target?.closest('.review-card') ||
            target?.closest('.review-card__more')
        ) {
            return;
        }

        if (hasOpened()) {
            closeAll();
        }
    });

    swiper.on('sliderMove', () => {
        if (hasOpened()) closeAll();
    });

    swiper.on('transitionEnd', () => {
        swiper.slides.forEach(slide => {
            if (!slide.classList.contains('swiper-slide-visible')) {
                const openCard = slide.querySelector('.review-card.open');
                if (openCard) closeCard(openCard);
            }
        });
    });

    // ======================
    // ARROWS
    // ======================
    document.querySelectorAll('.reviews__arrow').forEach(btn => {
        btn.addEventListener('click', () => {
            if (hasOpened()) closeAll();
        });
    });

    // ======================
    // OUTSIDE CLICK
    // ======================
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.review-card')) {
            if (hasOpened()) closeAll();
        }
    });
}
