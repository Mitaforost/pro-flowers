import { createSlider } from './slider-base';

export function initSimilarSlider() {
    const el = document.querySelector('[data-slider="similar"]');
    if (!el) return;

    return createSlider(el, {
        slidesPerView: 4,
        spaceBetween: 20,
        autoplay: false,
        navigation: {
            nextEl: el.closest('.bestsellers')?.querySelector('.bestsellers__arrow--next'),
            prevEl: el.closest('.bestsellers')?.querySelector('.bestsellers__arrow--prev'),
        },
        breakpoints: {
            0: { slidesPerView: 1.2, spaceBetween: 10 },
            576: { slidesPerView: 2, spaceBetween: 15 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
        }
    });
}
