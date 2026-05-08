import { initBurger } from './modules/burger';

import { initBannerSlider } from './modules/slider-banner';
import { initBestsellersSlider } from './modules/slider-bestsellers';
import { initReviewsSlider } from './modules/slider-reviews';

import { initGlobalPopups } from './modules/popup-base';
import { initProductPopup } from './modules/popup-product';
import { initGalleryViewer } from './modules/gallery-viewer';

import { initFaq } from './modules/faq';

import { initUI } from './modules/init-ui';
import { initCheckoutForm } from './modules/checkout-form';

document.addEventListener('DOMContentLoaded', () => {

    initGlobalPopups();

    initBurger();

    initReviewsSlider();

    initFaq();

    initBannerSlider();

    initBestsellersSlider();

    initProductPopup();

    initGalleryViewer();
    initCheckoutForm();
    initUI();
});
