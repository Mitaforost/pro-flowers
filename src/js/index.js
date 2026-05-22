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
import { initServicePopup } from './modules/popup-services.js';
import { initCatalogFilters } from './modules/catalog-filters';
import { initAccessoryBadge } from './modules/accessory-logic';   // <-- добавить

document.addEventListener('DOMContentLoaded', () => {
    initGlobalPopups();
    initBurger();
    initReviewsSlider();
    initFaq();
    initCatalogFilters();
    initBannerSlider();
    initBestsellersSlider();
    initProductPopup();
    initServicePopup();
    initGalleryViewer();
    initCheckoutForm();
    initUI();
    initAccessoryBadge();
});
