import { createSlider } from './slider-base';

export function initBannerSlider() {
    const sliderElement = document.querySelector('[data-slider="banner"]');
    if (!sliderElement) return;

    createSlider(sliderElement, {
        slidesPerView: 1,
        loop: true,
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
