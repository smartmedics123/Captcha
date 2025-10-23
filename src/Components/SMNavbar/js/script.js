const video = document.getElementById('carouselVideo');
const carousel = document.getElementById('carouselExampleCaptions');

if (document.querySelector('.carousel-item.active').contains(video)) {
    video.play();
}

carousel.addEventListener('slid.bs.carousel', function () {
    const activeItem = carousel.querySelector('.carousel-item.active');
    if (activeItem.contains(video)) {
        video.play();
    } else {
        video.pause();
    }
});

video.onload = function () {
    video.play();
}