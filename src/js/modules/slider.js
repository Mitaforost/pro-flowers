// Если будете импортировать Swiper через npm, раскомментируйте строку ниже
// import Swiper from 'swiper';

export function initBannerSlider() {
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
