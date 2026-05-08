const COOKIE_KEY = 'cookie-consent';

export const initCookieBanner = () => {
    const banner = document.querySelector('#cookie-banner');
    if (!banner) return;

    const acceptBtn = document.querySelector('#cookie-accept');
    const declineBtn = document.querySelector('#cookie-decline');

    const consent = localStorage.getItem(COOKIE_KEY);

    if (consent) return;

    const show = () => {
        setTimeout(() => {
            banner.classList.add('is-visible');
        }, 3000);
    };

    const hide = (value) => {
        localStorage.setItem(COOKIE_KEY, value);
        banner.classList.remove('is-visible');
    };

    show();

    acceptBtn?.addEventListener('click', () => hide('accepted'));
    declineBtn?.addEventListener('click', () => hide('declined'));
};
