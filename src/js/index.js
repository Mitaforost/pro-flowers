import { initBurger } from './modules/burger';
import { initBannerSlider } from './modules/slider-banner';
import { initBestsellersSlider } from './modules/slider-bestsellers';
import { initSimilarSlider } from './modules/slider-similar';
import { initCrossSellSlider } from './modules/slider-cross-sell';
import { initReviewsSlider } from './modules/slider-reviews';
import { initGlobalPopups } from './modules/popup-base';
import { initGalleryViewer } from './modules/gallery-viewer';
import { initFaq } from './modules/faq';
import { initUI } from './modules/init-ui';
import { initCheckoutForm } from './modules/checkout-form';
import { initServicePopup } from './modules/popup-services.js';
import { initCatalogFilters } from './modules/catalog-filters';
import { initAccessoryBadge } from './modules/accessory-logic';
import { initProductTabs } from './modules/product.js';
import { initProductGallery } from './modules/gallery-product.js';
import { initCart } from './modules/cart.js';
import { initThankyou } from './modules/thankyou.js';
import { initDayBouquetQuickOrder } from './modules/day-bouquet.js';
import { initAccount } from './modules/account';
import { initAuthForms } from './modules/auth-forms.js';
import { initScrollToTop } from './modules/scroll-top';
import { initCallbackButton } from './modules/callback';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalPopups();
    initBurger();
    initReviewsSlider();
    initFaq();
    initCatalogFilters();
    initBannerSlider();
    initDayBouquetQuickOrder();
    initBestsellersSlider();
    initSimilarSlider();
    initCrossSellSlider();
    initServicePopup();
    initGalleryViewer();
    initCheckoutForm();
    initUI();
    initAccessoryBadge();
    initProductGallery();
    initProductTabs();
    initAccount();
    initAuthForms();
    initScrollToTop();
    initCallbackButton();
    if (document.getElementById('cartWrapper')) {
        initCart();
    }

    if (document.getElementById('orderDetails')) {
        initThankyou();
    }
});
