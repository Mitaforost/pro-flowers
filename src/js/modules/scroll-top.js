export function initScrollToTop() {
    const scrollToTop = document.querySelector('#scrollToTop');

    if (!scrollToTop) {
        return;
    }

    const button = scrollToTop.querySelector('.scroll-to-top__button');

    if (!button) {
        return;
    }

    const SHOW_THRESHOLD = 300;

    const toggleVisibility = () => {
        scrollToTop.classList.toggle(
            'scroll-to-top--visible',
            window.scrollY > SHOW_THRESHOLD
        );
    };

    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility, {
        passive: true,
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        setTimeout(() => {
            button.blur();
        }, 100);
    });
}
