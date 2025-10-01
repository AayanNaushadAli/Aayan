// Global variables
let mouseX = 0;
let mouseY = 0;
let cursorTrail = [];
const trailLength = 20;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCursorTrail();
    initSmoothScrolling();
    initSkillBars();
    initContactForm();
    initScrollAnimations();
    initParticleEffects();
    initHoverEffects();
    initTypewriterEffect();
});

// Cursor Trail Effect
function initCursorTrail() {
    const trail = document.querySelector('.cursor-trail');
    
    // Create multiple trail elements
    for (let i = 0; i < trailLength; i++) {
        const trailElement = document.createElement('div');
        trailElement.className = 'cursor-trail';
        // Hide the first trail element initially to avoid dot
        if (i === 0) {
            trailElement.style.opacity = '0';
        } else {
            trailElement.style.opacity = (1 - i / trailLength) * 0.8;
        }
        trailElement.style.transform = `scale(${1 - i / trailLength})`;
        document.body.appendChild(trailElement);
        cursorTrail.push(trailElement);
    }

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update trail positions with delay
        cursorTrail.forEach((element, index) => {
            setTimeout(() => {
                element.style.left = mouseX - 10 + 'px';
                element.style.top = mouseY - 10 + 'px';
            }, index * 20);
        });
    });

    // Hide cursor trail when mouse leaves window
    document.addEventListener('mouseleave', () => {
        cursorTrail.forEach(element => {
            element.style.opacity = '0';
        });
    });

    document.addEventListener('mouseenter', () => {
        cursorTrail.forEach((element, index) => {
            element.style.opacity = (1 - index / trailLength) * 0.8;
        });
    });
}

// Smooth Scrolling Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Add active class to clicked link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Close mobile menu after clicking a link
                navMenu.classList.remove('active');
            }
        });
    });

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;

        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const sectionTop = targetSection.offsetTop;
                const sectionBottom = sectionTop + targetSection.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// Global scroll functions for buttons
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Skill Bar Animations
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const level = skillBar.getAttribute('data-level');
                
                setTimeout(() => {
                    skillBar.style.width = level + '%';
                }, 300);
                
                observer.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Contact Form Handler
function initContactForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('.form-input');
    
    // Add input focus effects
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (validateForm(formData)) {
            submitForm(formData);
        }
    });
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim()) errors.push('Email is required');
    if (!isValidEmail(data.email)) errors.push('Please enter a valid email');
    if (!data.subject.trim()) errors.push('Subject is required');
    if (!data.message.trim()) errors.push('Message is required');
    
    if (errors.length > 0) {
        showNotification('Please fix the following errors:\n' + errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(data) {
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Remove focused classes
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('focused');
        });
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #00ff00, #00cc00)' : 
                    type === 'error' ? 'linear-gradient(45deg, #ff4444, #cc0000)' : 
                    'linear-gradient(45deg, #00ffff, #0080ff)'};
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: inherit;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(notificationStyles);

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        observer.observe(element);
    });
}

// Add fadeInUp animation
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationStyles);

// Particle Effects
function initParticleEffects() {
    const particleContainer = document.querySelector('.bg-particles');
    const particleCount = 200;

    console.log('initParticleEffects called, container:', particleContainer);

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${['#00ffff', '#0080ff', '#8b00ff', '#00ff00', '#ffff00', '#ffd700', '#ffa500'][Math.floor(Math.random() * 7)]};
            border-radius: 100%;
            left: ${Math.random() * 100}vw;
            top: 100%;
            opacity: ${Math.random() * 0.6 + 0.3};
            animation: particleFloat ${Math.random() * 15 + 10}s linear infinite;
            box-shadow: 0 0 6px currentColor;
        `;
        particleContainer.appendChild(particle);
        console.log('Particle created:', particle);
    }
}

// Particle animations are now defined in style.css

// Hover Effects
function initHoverEffects() {
    // Add hover effects to various elements
    const hoverElements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .btn-glow');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.className = 'hover-ripple';
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
                pointer-events: none;
                animation: rippleEffect 0.6s ease-out;
                z-index: 1;
            `;

            element.style.position = 'relative';
            element.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add tilt effect to code-block in about section
    const aboutSection = document.querySelector('.about');
    const codeBlock = document.querySelector('.code-block');

    if (aboutSection && codeBlock) {
        aboutSection.addEventListener('mousemove', (e) => {
            const rect = codeBlock.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // You can adjust the max tilt degree here (currently 15)
            // const angleX = (deltaX / (rect.width / 2)) * 15; // max 15 degrees
            // const angleY = (deltaY / (rect.height / 2)) * 15;
            const maxTilt = 8;
            const angleX = (deltaX / (rect.width / 2)) * maxTilt;
            const angleY = (deltaY / (rect.height / 2)) * maxTilt;

            codeBlock.style.transform = `perspective(1000px) rotateX(${-angleY}deg) rotateY(${angleX}deg)`;
        });

        aboutSection.addEventListener('mouseleave', () => {
            codeBlock.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
}

// Add ripple animation
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes rippleEffect {
        from {
            width: 0;
            height: 0;
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
            transform: translate(-50%, -50%);
        }
    }
`;
document.head.appendChild(rippleStyles);

const typingTexts = [
    "Aayan...",
    "Aayan Naushad...",
    "Aayan Naushad Ali..."
];

const typingSubtitles = [
    "Full Stack Developer..",
    "Vibe Coder..",
    "Creative Coder.."
];

function typeWriter(element, text, delay = 100) {
    return new Promise((resolve) => {
        let i = 0;
        element.textContent = "";
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
                setTimeout(resolve, 1000); // Wait 1 second before resolving
            }
        }, delay);
    });
}

function deleteWriter(element, delay = 50) {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            element.textContent = element.textContent.slice(0, -1);
            if (element.textContent.length === 0) {
                clearInterval(timer);
                setTimeout(resolve, 500); // Wait 0.5 second before resolving
            }
        }, delay);
    });
}

async function loopTypingAnimation() {
    const typewriterElement = document.querySelector('.typing-animation');
    const subtitleElement = document.querySelector('.typing-subtitle');
    if (!typewriterElement || !subtitleElement) return;

    while (true) {
        for (let i = 0; i < typingTexts.length; i++) {
            await typeWriter(typewriterElement, typingTexts[i], 150);
            await deleteWriter(typewriterElement, 75);
        }
    }
}

async function loopSubtitleAnimation() {
    const subtitleElement = document.querySelector('.typing-subtitle');
    if (!subtitleElement) return;

    while (true) {
        for (let i = 0; i < typingSubtitles.length; i++) {
            await typeWriter(subtitleElement, typingSubtitles[i], 150);
            await deleteWriter(subtitleElement, 75);
        }
    }
}

function initTypewriterEffect() {
    loopTypingAnimation();
    loopSubtitleAnimation();
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Add glow effect to elements on mouse move
document.addEventListener('mousemove', (e) => {
    const glowElements = document.querySelectorAll('.skill-card, .project-card');
    
    glowElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            element.style.boxShadow = `
                ${x - rect.width / 2}px ${y - rect.height / 2}px 50px rgba(0, 255, 255, 0.1),
                0 15px 40px rgba(0, 255, 255, 0.2)
            `;
        } else {
            element.style.boxShadow = '';
        }
    });
});

// Performance optimization for animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// Add loading screen removal
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Initialize any load-dependent animations
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((element, index) => {
            element.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.2}s`;
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });
    }, 500);
});

// Easter egg: Konami code
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konami.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Create matrix rain effect
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.7;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    const matrixInterval = setInterval(draw, 35);
    
    showNotification('🎉 Matrix mode activated! Developer secrets unlocked!', 'success');
    
    // Remove after 10 seconds
    setTimeout(() => {
        clearInterval(matrixInterval);
        canvas.remove();
    }, 10000);
}