export function initAccessoryBadge() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productType = card.getAttribute('data-product-type');
        if (productType !== 'bouquet') return;
        const priceElement = card.querySelector('.product-card__price');
        if (!priceElement) return;
        const priceText = priceElement.textContent;
        const priceMatch = priceText.match(/(\d+)/);
        if (!priceMatch) return;
        const price = parseInt(priceMatch[0], 10);
        if (price >= 300) {
            const badgesContainer = card.querySelector('.product-card__badges');
            if (!badgesContainer) return;
            const alreadyHas = badgesContainer.querySelector('.badge--plus-accessory');
            if (!alreadyHas) {
                const accessoryBadge = document.createElement('span');
                accessoryBadge.className = 'badge badge--plus-accessory';
                accessoryBadge.textContent = '+ Аксессуар';
                badgesContainer.appendChild(accessoryBadge);
            }
        }
    });
}
