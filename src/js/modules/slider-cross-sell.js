import { createSlider } from './slider-base';

export function initCrossSellSlider() {
    const el = document.querySelector('[data-slider="cross-sell"]');
    if (!el) return;

    return createSlider(el, {
        slidesPerView: 4,
        spaceBetween: 20,
        autoplay: false,
        navigation: {
            nextEl: el.querySelector(".bestsellers__arrow--next"),
            prevEl: el.querySelector(".bestsellers__arrow--prev"),
        },
        breakpoints: {
            0: { slidesPerView: 1.2, spaceBetween: 10 },
            576: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
        }
    });
}
