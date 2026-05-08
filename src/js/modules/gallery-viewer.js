export function initGalleryViewer() {

    const viewer = document.querySelector('.gallery-viewer');

    if (!viewer) return;

    const viewerImage = viewer.querySelector('.gallery-viewer__image');
    const closeBtn = viewer.querySelector('.gallery-viewer__close');
    const prevBtn = viewer.querySelector('.gallery-viewer__arrow--prev');
    const nextBtn = viewer.querySelector('.gallery-viewer__arrow--next');

    const items = [...document.querySelectorAll('.gallery__item img')];

    let currentIndex = 0;

    const openViewer = (index) => {

        if (!items[index]) return;

        currentIndex = index;

        viewerImage.src = items[currentIndex].src;

        viewer.classList.add('active');

        document.body.classList.add('body--no-scroll');
    };

    const closeViewer = () => {
        viewer.classList.remove('active');
        document.body.classList.remove('body--no-scroll');
    };

    const showNext = () => {

        currentIndex = (currentIndex + 1) % items.length;

        viewerImage.src = items[currentIndex].src;
    };

    const showPrev = () => {

        currentIndex = (currentIndex - 1 + items.length) % items.length;

        viewerImage.src = items[currentIndex].src;
    };

    items.forEach((item, index) => {
        item.addEventListener('click', () => openViewer(index));
    });

    closeBtn.addEventListener('click', closeViewer);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) closeViewer();
    });

    document.addEventListener('keydown', (e) => {

        if (!viewer.classList.contains('active')) return;

        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}
