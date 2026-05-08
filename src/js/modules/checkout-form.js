export function initCheckoutForm() {

    const form = document.querySelector('#checkoutForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));

        console.log('CHECKOUT DATA:', data);

        form.reset();

        alert('Спасибо! Мы получили ваш заказ 💐');
    });
}
