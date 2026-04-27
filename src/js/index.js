// ** FADE IN FUNCTION **
function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        let val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0.1) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function isEmptyObject(obj) {
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.mobile-menu__close');
const fade = document.querySelector('.fade');

burger.addEventListener('click', () => {
    menu.classList.add('active');
    fadeIn(fade);
});

closeBtn.addEventListener('click', closeMenu);
fade.addEventListener('click', closeMenu);

function closeMenu() {
    menu.classList.remove('active');
    fadeOut(fade);
}
// hero-slider.js — подключай отдельным файлом

function initHeroSlider() {
    const sliderElement = document.querySelector('[data-slider="hero"]');

    if (!sliderElement) return;

    const heroSlider = new Swiper(sliderElement, {
        slidesPerView: 1,
        loop: true,
        speed: 600, // ← Плавнее, было 800
        effect: 'slide', // ← Простая смена (не fade, не creative — чтобы не дергалось)

        navigation: {
            nextEl: ".hero__arrow--next",
            prevEl: ".hero__arrow--prev",
        },

        autoplay: {
            delay: 5000, // ← Медленнее, было 4000
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // ← Останавливается при наведении
        },

        // ← Фикс: чтобы autoplay не глючил после ручного переключения
        observer: true,
        observeParents: true,
    });

    return heroSlider;
}

// Инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
} else {
    initHeroSlider();
}
