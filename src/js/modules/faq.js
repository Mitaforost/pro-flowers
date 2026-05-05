export function initFaq() {
    const items = document.querySelectorAll('.faq__item');

    items.forEach(item => {
        const btn = item.querySelector('.faq__question');

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            items.forEach(el => el.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}
