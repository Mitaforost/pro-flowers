import { createSlider } from './slider-base'; // Твой импорт

export function initReviewsSlider() {
    const el = document.querySelector('[data-slider="reviews"]');
    if (!el) return;

    return createSlider(el, {
        // У отзывов обычно больше текста, поэтому 3 карточки на десктопе смотрятся лучше
        slidesPerView: 3,
        spaceBetween: 20,
        autoplay: {
            delay: 4000, // Чуть дольше задержка, чтобы успевали читать
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: document.querySelector(".reviews__arrow--next"),
            prevEl: document.querySelector(".reviews__arrow--prev"),
        },
        // autoHeight: false // Важно оставить false (как у тебя в базе), чтобы CSS height: 100% сработал

        breakpoints: {
            0: { slidesPerView: 1.1, spaceBetween: 15 },
            576: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
        }
    });
}
