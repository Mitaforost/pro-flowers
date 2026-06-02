export function initProductTabs() {

    const product = document.querySelector('.product');

    if (!product) return;

    const buttons = product.querySelectorAll('.product__tab-btn');

    const contents = product.querySelectorAll('.product__tab-content');

    const body = product.querySelector('.product__tabs-body');

    const setHeight = () => {

        const active = product.querySelector('.product__tab-content.active');

        if (!active) return;

        body.style.height = `${active.offsetHeight}px`;

    };

    setHeight();

    buttons.forEach((button) => {

        button.addEventListener('click', () => {

            const tab = button.dataset.tab;

            buttons.forEach((btn) => {
                btn.classList.remove('active');
            });

            contents.forEach((content) => {
                content.classList.remove('active');
            });

            button.classList.add('active');

            const activeContent = product.querySelector(
                `[data-tab-content="${tab}"]`
            );

            if (activeContent) {

                activeContent.classList.add('active');

                setHeight();

            }

        });

    });

    window.addEventListener('resize', setHeight);

}
