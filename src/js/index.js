// ** FADE IN / FADE OUT FUNCTIONS **
function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        let val = parseFloat(el.style.opacity);
        if (!((val += 0.1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= 0.1) < 0.1) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

// ** BURGER MENU LOGIC **
const burger = document.querySelector('.header__burger');
const menu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.mobile-menu__close');
const fade = document.querySelector('.fade');

if (burger && menu && fade) {
    burger.addEventListener('click', () => {
        menu.classList.add('active');
        fadeIn(fade);
        document.body.classList.add('body--no-scroll');
    });

    function closeMenu() {
        menu.classList.remove('active');
        fadeOut(fade);
        document.body.classList.remove('body--no-scroll');
    }

    closeBtn.addEventListener('click', closeMenu);
    fade.addEventListener('click', closeMenu);
}

// ** BANNER SLIDER INIT **
function initBannerSlider() {
    const sliderElement = document.querySelector('[data-slider="banner"]');
    if (!sliderElement) return;

    new Swiper(sliderElement, {
        slidesPerView: 1,
        loop: true,
        speed: 600,
        navigation: {
            nextEl: ".banner__arrow--next",
            prevEl: ".banner__arrow--prev",
        },
        pagination: {
            el: ".banner__pagination",
            clickable: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        }
    });
}

document.addEventListener('DOMContentLoaded', initBannerSlider);
