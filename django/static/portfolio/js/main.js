document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById('scroll-progress');
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progress) progress.style.width = `${scrolled}%`;
  };

  /* ---------- Sticky navbar shrink ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    updateProgress();
    if (window.scrollY > 24) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');
  menuToggle?.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden', !isOpen);
    iconClose.classList.toggle('hidden', isOpen);
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    });
  });

  /* ---------- Smooth scroll with navbar offset ---------- */
  const NAV_OFFSET = 84;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Scroll-triggered reveal ---------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  revealTargets.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay);
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Typing role effect ---------- */
  const roles = ['Full-Stack Developer', 'UI/UX Designer', 'Web Designer', 'Graphic Designer'];
  const typedEl = document.getElementById('typed-role');
  if (typedEl && !prefersReducedMotion) {
    let roleIndex = 0, charIndex = 0, deleting = false;
    const TYPE_SPEED = 65, DELETE_SPEED = 35, HOLD = 1400;
    const tick = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) { deleting = true; setTimeout(tick, HOLD); return; }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
        setTimeout(tick, DELETE_SPEED);
      }
    };
    tick();
  } else if (typedEl) {
    typedEl.textContent = roles[0];
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    if (prefersReducedMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Testimonial carousel ---------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let activeSlide = 0, testimonialTimer;
  const goToSlide = (i) => {
    slides[activeSlide].classList.add('hidden');
    dots[activeSlide].classList.remove('dot--active');
    activeSlide = i;
    slides[activeSlide].classList.remove('hidden');
    dots[activeSlide].classList.add('dot--active');
  };
  dots.forEach(dot => dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.go, 10));
    resetTestimonialTimer();
  }));
  const resetTestimonialTimer = () => {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(() => goToSlide((activeSlide + 1) % slides.length), 6000);
  };
  if (slides.length) resetTestimonialTimer();

  /* ---------- Contact form (AJAX submit) ---------- */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const submitLabel = document.getElementById('submit-label');
  const statusEl = document.getElementById('form-status');

  const setStatus = (message, kind) => {
    statusEl.textContent = message;
    statusEl.classList.remove('hidden', 'text-brand-teal', 'text-red-400');
    statusEl.classList.add(kind === 'error' ? 'text-red-400' : 'text-brand-teal');
  };

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'), // captured dropdown value
      message: formData.get('message'),
    };

    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': formData.get('csrfmiddlewaretoken'),
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("Message sent — I'll reply within a day.", 'success');
        form.reset();
      } else {
        setStatus(data.error || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      setStatus('Network error — please try again in a moment.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = 'Send message';
    }
  });
});
