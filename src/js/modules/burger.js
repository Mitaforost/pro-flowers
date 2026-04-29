import { fadeIn, fadeOut } from './fade';

export function initBurger() {
    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu__close');
    const fade = document.querySelector('.fade');

    if (!burger || !menu || !fade) return;

    burger.addEventListener('click', () => {
        menu.classList.add('active');
        fadeIn(fade);
        document.body.classList.add('body--no-scroll');
    });

    const closeMenu = () => {
        menu.classList.remove('active');
        fadeOut(fade);
        document.body.classList.remove('body--no-scroll');
    };

    closeBtn.addEventListener('click', closeMenu);
    fade.addEventListener('click', closeMenu);
}
