// Main JavaScript for Portfolio Website

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initMusicPlayer();
    initSmoothScroll();
    initScrollAnimations();
    initGallery();
});

// Music Player Functionality
function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    if (!musicToggle) return;

    // Initialize audio manager
    if (window.audioManager) {
        window.audioManager.init().then(started => {
            if (started) {
                musicToggle.classList.add('playing');
            }
        });

        // Toggle music on button click
        musicToggle.addEventListener('click', function () {
            const isPlaying = window.audioManager.toggle();

            if (isPlaying) {
                musicToggle.classList.add('playing');
            } else {
                musicToggle.classList.remove('playing');
            }
        });

        // Start music on first user interaction if not already playing
        document.addEventListener('click', function startOnInteraction() {
            if (!window.audioManager.isPlaying && window.audioManager.initialized) {
                window.audioManager.play();
                musicToggle.classList.add('playing');
            }
            document.removeEventListener('click', startOnInteraction);
        }, { once: true });
    }
}

// Gallery Management
function initGallery() {
    loadGalleryImages();
}

function loadGalleryImages() {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryEmpty = document.getElementById('galleryEmpty');
    if (!galleryGrid) return;

    const savedGallery = localStorage.getItem('portfolio_gallery');

    if (savedGallery) {
        const images = JSON.parse(savedGallery);
        if (images.length > 0) {
            if (galleryEmpty) galleryEmpty.classList.remove('show');
            images.forEach((imageData, index) => {
                addGalleryImage(imageData.src, imageData.caption, index);
            });
            return;
        }
    }

    if (galleryEmpty) galleryEmpty.classList.add('show');
}

function addGalleryImage(src, caption, index) {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryEmpty = document.getElementById('galleryEmpty');
    if (!galleryGrid) return;

    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-gallery-index', index);

    item.innerHTML = `
        <img src="${src}" alt="${caption}" class="gallery-image">
        <div class="gallery-overlay">
            <p class="gallery-caption">${caption}</p>
        </div>
    `;

    galleryGrid.appendChild(item);
    if (galleryEmpty) galleryEmpty.classList.remove('show');
}

// Smooth scroll functionality
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.experience-card, .service-card, .gallery-item, .about-content, .contact-info');

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}
