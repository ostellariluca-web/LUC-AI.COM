
// Global JavaScript functions for the LUC-AI website

// Helper function to play animations
function playAnim(el, className) {
    el.classList.remove(className); // reset
    void el.offsetWidth;            // reflow trick
    el.classList.add(className);
}

// Initialize Feather icons
document.addEventListener('DOMContentLoaded', function() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// Modal functionality
function initModals() {
    // Get modal elements
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeButtons = modal.querySelectorAll('[data-close-modal]');
        const overlay = modal.querySelector('.modal-overlay');
        
        // Close modal functions
        const closeModals = () => {
            modal.classList.add('hidden');
        };
        
        // Event listeners
        closeButtons.forEach(button => {
            button.addEventListener('click', closeModals);
        });
        
        if (overlay) {
            overlay.addEventListener('click', closeModals);
        }
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModals();
            }
        });
    });
}

// Form validation helper
function validatePhone(phone) {
    return /^\+\d{6,15}$/.test(phone);
}

// Scroll reveal functionality
function initScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}

// Audio player functionality
function initAudioPlayer() {
    const audioToggle = document.getElementById('audioToggle');
    const demoAudio = document.getElementById('demoAudio');
    
    if (audioToggle && demoAudio) {
        const audioText = document.getElementById('audioText');
        const audioIcon = document.getElementById('audioIcon');
        
        audioToggle.addEventListener('click', function() {
            if (demoAudio.paused) {
                demoAudio.play();
                audioText.textContent = 'Stop Demo';
                audioIcon.setAttribute('data-feather', 'pause');
            } else {
                demoAudio.pause();
                demoAudio.currentTime = 0;
                audioText.textContent = 'Play Demo';
                audioIcon.setAttribute('data-feather', 'play');
            }
            
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
        
        demoAudio.addEventListener('ended', function() {
            audioText.textContent = 'Play Demo';
            audioIcon.setAttribute('data-feather', 'play');
            
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    }
}

// Initialize all global functions
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initModals();
    initScrollReveal();
    initSmoothScrolling();
    initAudioPlayer();
});
