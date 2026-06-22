document.addEventListener("DOMContentLoaded", () => {

    // --- 0. Mobile Hamburger Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // --- 1. Pediatric Carousel Logic (Automated) ---
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicatorContainer = document.getElementById('carouselIndicators');
    
    let currentIndex = 0;
    const slideCount = slides.length;
    const slideDuration = 4000; 
    let slideInterval;

    if (slideCount > 0 && track) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            indicatorContainer.appendChild(dot);
        });

        const indicators = document.querySelectorAll('.indicator');

        function updateIndicators() {
            indicators.forEach(ind => ind.classList.remove('active'));
            indicators[currentIndex].classList.add('active');
        }

        function goToSlide(index) {
            currentIndex = index;
            const transformValue = `translateX(-${currentIndex * 100}%)`;
            track.style.transform = transformValue;
            updateIndicators();
            resetInterval();
        }

        function moveToNextSlide() {
            currentIndex++;
            if (currentIndex >= slideCount) currentIndex = 0;
            goToSlide(currentIndex);
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(moveToNextSlide, slideDuration);
        }

        slideInterval = setInterval(moveToNextSlide, slideDuration);
    }

    // --- 2. Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-animate').forEach(section => {
        observer.observe(section);
    });

    // --- 3. Testimonial Carousel Logic (Manual) ---
    const testSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentTestIndex = 0;

    if (testSlides.length > 0 && prevBtn && nextBtn) {
        function showTestimonial(index) {
            testSlides.forEach(slide => slide.classList.remove('active'));
            testSlides[index].classList.add('active');
        }

        prevBtn.addEventListener('click', () => {
            currentTestIndex--;
            if (currentTestIndex < 0) currentTestIndex = testSlides.length - 1;
            showTestimonial(currentTestIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentTestIndex++;
            if (currentTestIndex >= testSlides.length) currentTestIndex = 0;
            showTestimonial(currentTestIndex);
        });
    }

    // --- 4. Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 5. Number Counter Animation Logic (Medium Speed: 2000ms) ---
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2000; 

    const counterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / animationDuration, 1);
                    
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const currentCount = Math.ceil(easeOutQuart * target);

                    counter.innerText = currentCount;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target; 
                    }
                }

                requestAnimationFrame(updateCount);
                observer.unobserve(counter); 
            }
        });
    }, counterObserverOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- 6. Section-aware background colour shift ---
    document.body.classList.add('sec-home');

    const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.className = document.body.className
                    .replace(/\bsec-\w+/g, '').trim();
                document.body.classList.add('sec-' + entry.target.id);
            }
        });
    }, { threshold: 0.25, rootMargin: '-8% 0px -8% 0px' });

    document.querySelectorAll('section[id], header[id]').forEach(s => bgObserver.observe(s));

});

// --- 8. Scroll-reactive background ---
(function () {
    let ticking = false;
    let resetTimer;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY   = window.scrollY;
                const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
                const progress  = Math.min(scrollY / maxScroll, 1);

                // Drive progress bar width and ECG vertical parallax via CSS variables
                document.documentElement.style.setProperty('--scroll-p',      progress.toFixed(4));
                document.documentElement.style.setProperty('--scroll-offset', (scrollY * 0.012).toFixed(1) + 'px');

                // Brightness boost while actively scrolling, revert 220ms after scroll stops
                document.body.classList.add('is-scrolling');
                clearTimeout(resetTimer);
                resetTimer = setTimeout(() => document.body.classList.remove('is-scrolling'), 220);

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}());

// --- 7. Loading screen — dismiss after fonts & images settle ---
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 1050);
        }
    }, 2000);
});