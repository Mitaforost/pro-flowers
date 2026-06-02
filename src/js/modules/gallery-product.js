export function initProductGallery() {

    const product = document.querySelector('.product');

    if (!product) return;

    const thumbs = [...product.querySelectorAll('.product__thumb')];

    const mediaInner = product.querySelector('.product__media-inner');

    const viewer = document.querySelector('.gallery-viewer');

    if (!viewer) return;

    const viewerImage = viewer.querySelector('.gallery-viewer__image');

    const viewerVideo = viewer.querySelector('.gallery-viewer__video');

    const closeBtn = viewer.querySelector('.gallery-viewer__close');

    const prevBtn = viewer.querySelector('.gallery-viewer__arrow--prev');

    const nextBtn = viewer.querySelector('.gallery-viewer__arrow--next');

    let currentIndex = 0;

    const renderMainMedia = (index) => {

        const item = thumbs[index];

        if (!item) return;

        const type = item.dataset.mediaType;

        const src = item.dataset.src;

        const poster = item.dataset.poster;

        thumbs.forEach((thumb) => {
            thumb.classList.remove('active');
        });

        item.classList.add('active');

        mediaInner.innerHTML = '';

        if (type === 'video') {

            mediaInner.innerHTML = `
            <video controls playsinline poster="${poster}">
                <source src="${src}" type="video/mp4">
            </video>
        `;

        } else {

            mediaInner.innerHTML = `
            <img src="${src}" alt="Изображение товара">
        `;

        }

    };

    const openViewer = (index) => {

        currentIndex = index;

        const item = thumbs[currentIndex];

        const type = item.dataset.mediaType;

        const src = item.dataset.src;

        viewer.classList.add('active');

        document.body.classList.add('body--no-scroll');

        if (type === 'video') {

            viewerImage.style.display = 'none';

            viewerVideo.style.display = 'block';

            viewerVideo.src = src;

        } else {

            viewerVideo.style.display = 'none';

            viewerVideo.pause();

            viewerImage.style.display = 'block';

            viewerImage.src = src;

        }

    };

    const closeViewer = () => {

        viewer.classList.remove('active');

        document.body.classList.remove('body--no-scroll');

        viewerVideo.pause();

    };

    const showNext = () => {

        currentIndex = (currentIndex + 1) % thumbs.length;

        openViewer(currentIndex);

    };

    const showPrev = () => {

        currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;

        openViewer(currentIndex);

    };

    thumbs.forEach((thumb, index) => {

        thumb.addEventListener('click', () => {

            currentIndex = index;

            renderMainMedia(index);

        });

    });

    product.querySelector('.product__media-viewer')
        .addEventListener('click', () => {
            openViewer(currentIndex);
        });

    closeBtn.addEventListener('click', closeViewer);

    nextBtn.addEventListener('click', showNext);

    prevBtn.addEventListener('click', showPrev);

    viewer.addEventListener('click', (e) => {

        if (e.target === viewer) {
            closeViewer();
        }

    });

    document.addEventListener('keydown', (e) => {

        if (!viewer.classList.contains('active')) return;

        if (e.key === 'Escape') closeViewer();

        if (e.key === 'ArrowRight') showNext();

        if (e.key === 'ArrowLeft') showPrev();

    });

}
