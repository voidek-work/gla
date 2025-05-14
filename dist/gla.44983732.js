var swiper = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },
    pagination: {
        el: ".swiper-pagination"
    }
});
const setArrows = ()=>{
    const width = window.innerWidth;
    if (width < 768) Array.from({
        length: 4
    }).forEach((_, i)=>{
        arrowLine({
            sourcePosition: 'bottomCenter',
            destinationPosition: 'topCenter',
            source: `#id${i}`,
            destination: `#id${i + 1}`,
            style: 'dot',
            color: '#bf5757'
        });
    });
};
setArrows();
document.addEventListener("DOMContentLoaded", ()=>{
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter)=>{
        const start = +counter.getAttribute('data-start') || 0;
        const duration = +counter.getAttribute('data-duration') || 2000;
        // Ищем число в тексте (берем первое найденное)
        const endMatch = counter.textContent.match(/\d+/);
        if (!endMatch) return; // если число не нашли - пропускаем элемент
        const end = +endMatch[0];
        const originalText = counter.textContent;
        const frameRate = 60;
        const totalFrames = Math.round(duration / 1000 * frameRate);
        const increment = (end - start) / totalFrames;
        let current = start;
        let frame = 0;
        const updateCounter = ()=>{
            frame++;
            current += increment;
            if (frame < totalFrames) {
                const displayNumber = Math.floor(current);
                counter.textContent = originalText.replace(/\d+/, displayNumber);
                requestAnimationFrame(updateCounter);
            } else counter.textContent = originalText.replace(/\d+/, end);
        };
        counter.textContent = originalText.replace(/\d+/, start); // сначала показываем старт
        updateCounter();
    });
});
document.addEventListener('DOMContentLoaded', ()=>{
    const width = window.innerWidth;
    if (width > 768) {
        const animatedElements = document.querySelectorAll('.animate-once');
        const observer = new IntersectionObserver((entries, observer)=>{
            entries.forEach((entry)=>{
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.dataset.delay || '0s';
                    const duration = el.dataset.duration || '0.6s';
                    el.style.animationDelay = delay;
                    el.style.animationDuration = duration;
                    el.classList.add('visible');
                    observer.unobserve(el); // Анимация только один раз
                }
            });
        }, {
            threshold: 0.1 // элемент стал виден хотя бы на 10%
        });
        animatedElements.forEach((el)=>{
            observer.observe(el);
        });
    }
});

//# sourceMappingURL=gla.44983732.js.map
