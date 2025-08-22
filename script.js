// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functionality
  initNavigation();
  initScrollAnimations();
  initSmoothScrolling();
  initFormHandling();
  initParallaxEffects();
  initCoffeeCardInteractions();
  createScrollProgress();
  initImageLoading(); // مهم: شغّله بدري
});

// Navigation functionality
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  // Mobile menu toggle
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Navbar background change on scroll
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 30px rgba(139, 69, 19, 0.15)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = '0 2px 20px rgba(139, 69, 19, 0.1)';
    }
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
        entry.target.classList.add('animate');

        // Add staggered animation for coffee cards
        if (entry.target.classList.contains('coffee-card')) {
          const delay = entry.target.dataset.aosDelay || 0;
          entry.target.style.transitionDelay = `${delay}ms`;
        }
      }
    });
  }, observerOptions);

  // Observe all elements that need animation
  const animatedElements = document.querySelectorAll('.coffee-card, .section-title, .about-content, .contact-content');
  animatedElements.forEach(el => observer.observe(el));
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      e.preventDefault();
      const offsetTop = targetSection.offsetTop - 70; // fixed navbar
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
}

// Form handling
function initFormHandling() {
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = this.querySelector('input[type="text"]')?.value.trim();
      const email = this.querySelector('input[type="email"]')?.value.trim();
      const message = this.querySelector('textarea')?.value.trim();

      if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }

      showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
      this.reset();
    });
  }
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  document.querySelector('.notification')?.remove();

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close">&times;</button>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });

  // Auto remove after 5 seconds
  const hide = () => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  };
  setTimeout(hide, 5000);

  // Close button
  notification.querySelector('.notification-close')?.addEventListener('click', hide);
}

// Parallax effects (تصحيح: لا تحاول تختار ::before)
function initParallaxEffects() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
  });
}

// Coffee card interactions
function initCoffeeCardInteractions() {
  const coffeeCards = document.querySelectorAll('.coffee-card');

  coffeeCards.forEach(card => {
    // hover effects
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
    });

    // order button ripple + toast
    const orderBtn = card.querySelector('.order-btn');
    if (orderBtn) {
      orderBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;

        this.appendChild(ripple);

        setTimeout(() => showNotification('Coffee added to cart!', 'success'), 300);
        setTimeout(() => ripple.remove(), 600);
      });
      // ensure button can host ripple
      orderBtn.style.position = 'relative';
      orderBtn.style.overflow = 'hidden';
    }
  });

  // inject ripple keyframes once
  if (!document.getElementById('ripple-keyframes')) {
    const rippleStyle = document.createElement('style');
    rippleStyle.id = 'ripple-keyframes';
    rippleStyle.textContent = `
      @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
      }
    `;
    document.head.appendChild(rippleStyle);
  }
}

// Page load simple fade
window.addEventListener('load', function () {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => (document.body.style.opacity = '1'));

  // typing effect
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid #8B4513';
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i++);
        setTimeout(typeWriter, 100);
      } else {
        heroTitle.style.borderRight = 'none';
      }
    };
    setTimeout(typeWriter, 300);
  }

  // floating particles
  createFloatingParticles();
});

// Scroll progress indicator
function createScrollProgress() {
  if (document.querySelector('.scroll-progress')) return;
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #8B4513, #DEB887);
    z-index: 10001;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function () {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Floating coffee particles
function createFloatingParticles() {
  if (document.querySelector('.particles-container')) return;

  const container = document.createElement('div');
  container.className = 'particles-container';
  container.style.cssText = `
    position: fixed; inset: 0;
    pointer-events: none; z-index: 1; overflow: hidden;
  `;
  document.body.appendChild(container);

  for (let i = 0; i < 20; i++) createParticle(container);

  // particle keyframes
  if (!document.getElementById('particle-keyframes')) {
    const particleStyle = document.createElement('style');
    particleStyle.id = 'particle-keyframes';
    particleStyle.textContent = `
      @keyframes float-particle {
        0%   { transform: translateY(100vh) rotate(0deg);   opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(particleStyle);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'coffee-particle';
  particle.textContent = '☕';
  particle.style.cssText = `
    position: absolute;
    font-size: ${Math.random() * 20 + 10}px;
    color: rgba(139, 69, 19, 0.3);
    animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
  `;
  container.appendChild(particle);

  setTimeout(() => {
    particle.remove();
    if (container.parentNode) createParticle(container);
  }, 15000);
}

// Performance throttling stub
let ticking = false;
function updateOnScroll() {
  if (!ticking) {
    requestAnimationFrame(function () {
      // update scroll-based animations here if needed
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', updateOnScroll);

// Image loading (التصحيح هنا)
function initImageLoading() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    // الحالة الافتراضية: باهت شوي قبل الظهور
    img.style.opacity = '0';
    img.style.transform = 'scale(0.98)';
    img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    const reveal = () => {
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    };

    const fail = () => {
      // لا تخلّيها مخفية إذا فشل التحميل
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
      // يفيدك في الديبغ
      img.alt = (img.alt || 'image') + ' (failed to load)';
    };

    // لو كانت الصورة جاهزة أصلاً قبل ما نضيف listener
    if (img.complete) {
      if (img.naturalWidth > 0) reveal();
      else fail();
    } else {
      img.addEventListener('load', reveal, { once: true });
      img.addEventListener('error', fail, { once: true });
    }
  });
}
