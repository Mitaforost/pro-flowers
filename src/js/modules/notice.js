const NOTICE_KEY = 'top-notice-hidden-until';

const getHour = () => new Date().getHours();

const isHidden = () => {
    const until = localStorage.getItem(NOTICE_KEY);
    if (!until) return false;

    return Date.now() < Number(until);
};

const hideFor24h = () => {
    const oneDay = 24 * 60 * 60 * 1000;
    localStorage.setItem(NOTICE_KEY, Date.now() + oneDay);
};

export const initTopNotice = () => {
    const notice = document.querySelector('#top-notice');
    if (!notice) return;

    const closeBtn = document.querySelector('#notice-close');

    const hour = getHour();
    const shouldShow = hour >= 21 || hour < 9;

    if (!shouldShow) return;

    if (isHidden()) return;

    setTimeout(() => {
        notice.classList.add('is-visible');
    }, 1500);

    closeBtn?.addEventListener('click', () => {
        notice.classList.remove('is-visible');
        hideFor24h();
    });
};
