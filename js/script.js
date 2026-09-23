/* ====================================================
   LEELBEEY GENERAL SERVICES — JAVASCRIPT
   Mobile Nav | Gallery Filter | Lightbox | Form | Scroll
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. NAVBAR — Scroll Shadow & Active Link
     ============================================ */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mark active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ============================================
     2. HAMBURGER MOBILE MENU
     ============================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !hamburger.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================
     3. GALLERY FILTER
     ============================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.filter;

        galleryItems.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ============================================
     4. LIGHTBOX
     ============================================ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentLightboxIndex = 0;
  let visibleItems = [];

  const openLightbox = (index) => {
    visibleItems = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
    currentLightboxIndex = index;
    const item = visibleItems[currentLightboxIndex];
    if (!item) return;
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  };

  if (lightbox) {
    // Attach open to gallery items
    galleryItems.forEach((item, originalIdx) => {
      item.addEventListener('click', () => {
        const visible = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
        const visIdx = visible.indexOf(item);
        openLightbox(visIdx >= 0 ? visIdx : 0);
      });

      // Keyboard
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });

    lightboxClose && lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev && lightboxPrev.addEventListener('click', () => {
      visibleItems = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
      currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
      const img = visibleItems[currentLightboxIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    });

    lightboxNext && lightboxNext.addEventListener('click', () => {
      visibleItems = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
      currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
      const img = visibleItems[currentLightboxIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev && lightboxPrev.click();
      if (e.key === 'ArrowRight') lightboxNext && lightboxNext.click();
    });
  }

  /* ============================================
     5. CONTACT FORM VALIDATION
     ============================================ */
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMessage');

  if (contactForm) {
    const showError = (fieldId, show, msg = '') => {
      const field = document.getElementById(fieldId);
      const error = document.getElementById(fieldId + 'Error');
      if (!field || !error) return;
      field.classList.toggle('error', show);
      error.textContent = msg;
      error.classList.toggle('show', show);
    };

    const validateField = (fieldId, value, rules) => {
      if (rules.required && !value.trim()) {
        showError(fieldId, true, 'This field is required.');
        return false;
      }
      if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        showError(fieldId, true, 'Please enter a valid email address.');
        return false;
      }
      if (rules.phone && value && !/^[0-9+\-()\s]{7,}$/.test(value)) {
        showError(fieldId, true, 'Please enter a valid phone number.');
        return false;
      }
      showError(fieldId, false);
      return true;
    };

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName');
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      const service = document.getElementById('service');
      const message = document.getElementById('message');

      let valid = true;

      valid = validateField('fullName', name ? name.value : '', { required: true }) && valid;
      valid = validateField('phone', phone ? phone.value : '', { required: true, phone: true }) && valid;
      valid = validateField('email', email ? email.value : '', { required: true, email: true }) && valid;
      valid = validateField('service', service ? service.value : '', { required: true }) && valid;
      valid = validateField('message', message ? message.value : '', { required: true }) && valid;

      if (valid) {
        contactForm.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    // Real-time clear errors
    contactForm.querySelectorAll('.form-control').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errEl = document.getElementById(field.id + 'Error');
        if (errEl) errEl.classList.remove('show');
      });
    });
  }

  /* ============================================
     6. SCROLL FADE-IN ANIMATION
     ============================================ */
  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  /* ============================================
     7. SMOOTH SCROLL for anchor links
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});

/* ============================================
   8. WHATSAPP LINK HELPER (global)
   ============================================ */
const WA_NUMBER = '2347067229062';
const WA_MESSAGES = {
  general: 'Hello Leelbeey General Services, I would like to make an enquiry.',
  tailoring: 'Hello Leelbeey General Services, I would like to enquire about tailoring services.',
  training: 'Hello Leelbeey General Services, I would like to enquire about your tailoring training programme.',
  textiles: 'Hello Leelbeey General Services, I would like to enquire about your available textiles and fashion products.',
  kitchen: 'Hello Leelbeey General Services, I would like to enquire about your kitchen utensils.',
  webdev: 'Hello Leelbeey General Services, I would like to enquire about your web development services.',
  design: 'Hello Leelbeey General Services, I would like to enquire about your graphic design services.',
};

function waLink(type = 'general') {
  const msg = WA_MESSAGES[type] || WA_MESSAGES.general;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
