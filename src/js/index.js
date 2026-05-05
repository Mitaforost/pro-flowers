import { initBurger } from './modules/burger';

import { initBannerSlider } from './modules/slider-banner';
import { initBestsellersSlider } from './modules/slider-bestsellers';
import { initGlobalPopups } from './modules/popup-base';
import { initProductPopup } from './modules/popup-product';
import { initReviewsSlider } from './modules/slider-reviews';
import { initFaq } from './modules/faq';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalPopups();
    initBurger();
    initReviewsSlider();
    initFaq();

    initBannerSlider();
    initBestsellersSlider();

    initProductPopup();
});
