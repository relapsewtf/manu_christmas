// Custom Cursor
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Intro Logic
const introOverlay = document.getElementById('intro-overlay');
const enterBtn = document.getElementById('enter-btn');
const mainContent = document.querySelector('main');

const startExperience = () => {
    introOverlay.style.opacity = '0';
    introOverlay.style.pointerEvents = 'none';
    mainContent.classList.remove('hidden-initially');
    mainContent.classList.add('visible');
};

enterBtn.addEventListener('click', startExperience);

// Slider Logic
const cards = document.querySelectorAll('.card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const currentIndexDisplay = document.getElementById('current-index');
const totalCountDisplay = document.getElementById('total-count');

let currentIndex = 0;
totalCountDisplay.textContent = cards.length;

function updateSlider() {
    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next');

        if (index === currentIndex) {
            card.classList.add('active');
        }
        // We can add simple logic for prev/next classes if we want more fancy CSS later
        else if (index === (currentIndex - 1 + cards.length) % cards.length) {
            card.classList.add('prev');
        }
        else if (index === (currentIndex + 1) % cards.length) {
            card.classList.add('next');
        }
    });

    currentIndexDisplay.textContent = currentIndex + 1;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateSlider();
}

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Enter' && introOverlay.style.opacity !== '0') startExperience();
});

// SWIPE SUPPORT (Mobile)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    checkSwipe();
});

function checkSwipe() {
    const threshold = 50; // min distance
    if (touchEndX < touchStartX - threshold) {
        nextSlide(); // Swipe Left -> Next
    }
    if (touchEndX > touchStartX + threshold) {
        prevSlide(); // Swipe Right -> Prev
    }
}

// Contact Links Handler
const contactLinks = document.querySelectorAll('.contact-link');
contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Mensaje del sistema: "Escríbeme para arreglar esto."');
    });
});


// Snow Effect
const snowContainer = document.getElementById('snow-container');
const particleCount = 50;
for (let i = 0; i < particleCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.style.position = 'absolute';
    snowflake.style.background = 'white';
    snowflake.style.borderRadius = '50%';
    snowflake.style.opacity = Math.random() * 0.5 + 0.1;
    snowflake.style.width = Math.random() * 3 + 1 + 'px';
    snowflake.style.height = snowflake.style.width;
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animation = `fall ${Math.random() * 10 + 5}s linear infinite`;
    snowflake.style.animationDelay = Math.random() * -10 + 's';
    snowContainer.appendChild(snowflake);
}
const styleDate = document.createElement('style');
styleDate.innerHTML = `
@keyframes fall {
    0% { transform: translateY(-10vh); }
    100% { transform: translateY(110vh); }
}`;
document.head.appendChild(styleDate);

// Init
updateSlider();
