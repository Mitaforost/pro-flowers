export function createSlider(el, options = {}) {
    return new Swiper(el, {
        speed: 600,
        loop: true,
        watchOverflow: true,
        autoHeight: false,

        ...options
    });
}
