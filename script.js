/* ====================
   SCRIPT.JS — Shri Sai Bridal Jewels
   ==================== */

// ---- CART STATE ----
let cart = [];
let selectedRentalItem = null;
let selectedRentalPrice = 0;
let testimonialIndex = 0;

// ---- DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initParticles();
  initScrollReveal();
  initProductFilter();
  initTestimonialSlider();
  updateCart();
  setMinDate();
});

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ============================================
// PARTICLES
// ============================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --duration: ${4 + Math.random() * 6}s;
      --delay: ${Math.random() * 6}s;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      opacity: ${0.3 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.product-card, .rental-card, .why-card, .gallery-item, .testimonial-card, .contact-card, .about-layout > *, .value-item'
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// PRODUCT FILTER
// ============================================
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach((card, i) => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.style.display = '';
          card.style.animationDelay = `${i * 0.05}s`;
          setTimeout(() => {
            card.classList.remove('hidden');
          }, 10);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ============================================
// CART MANAGEMENT
// ============================================
function addToCart(name) {
  if (cart.find(item => item.name === name)) {
    showToastMsg(`"${name}" is already in your cart!`);
    return;
  }

  cart.push({ name, id: Date.now() });
  updateCart();
  showToastMsg(`"${name}" added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateCart() {
  const count = cart.length;
  const cartFabCount = document.getElementById('cartFabCount');
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartCount = document.getElementById('cartCount');
  const cartEnquireBtn = document.getElementById('cartEnquireBtn');

  if (cartFabCount) cartFabCount.textContent = count;
  if (cartCount) cartCount.textContent = count;

  if (cartItems) {
    if (count === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛍️</div>
          <p>Your cart is empty</p>
          <p class="cart-empty-sub">Add jewellery items to enquire</p>
        </div>`;
    } else {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-name">${item.name}</div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
      `).join('');
    }
  }

  if (cartFooter) {
    cartFooter.style.display = count > 0 ? 'block' : 'none';
  }

  if (cartEnquireBtn && count > 0) {
    const items = cart.map(i => i.name).join(', ');
    const message = encodeURIComponent(`Hi! I'm interested in the following bridal jewellery:\n${items}\n\nPlease share the price and availability details.`);
    cartEnquireBtn.href = `https://wa.me/919876543210?text=${message}`;
  }
}

function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  const sidebar = document.getElementById('cartSidebar');
  overlay.classList.toggle('open');
  sidebar.classList.toggle('open');
}

// ============================================
// RENTAL BOOKING FORM
// ============================================
function setMinDate() {
  const dateInput = document.getElementById('eventDate');
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 3); // Minimum 3 days ahead
    dateInput.min = today.toISOString().split('T')[0];
  }
}

function openBookingForm(name, pricePerDay) {
  selectedRentalItem = name;
  selectedRentalPrice = pricePerDay;

  const banner = document.getElementById('selectedJewelName');
  const subtitle = document.getElementById('formSubtitle');

  if (banner) banner.textContent = `Selected: ${name}`;
  if (subtitle) subtitle.textContent = `Booking: ${name} · ₹${pricePerDay}/day`;

  updateTotal();

  // Scroll to form
  const formWrapper = document.getElementById('bookingFormWrapper');
  if (formWrapper) {
    formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Add highlight effect
    formWrapper.style.transition = 'box-shadow 0.3s';
    formWrapper.style.boxShadow = '0 0 40px rgba(212,175,55,0.3)';
    setTimeout(() => { formWrapper.style.boxShadow = ''; }, 2000);
  }
}

function updateTotal() {
  if (!selectedRentalPrice) return;

  const durationSelect = document.getElementById('rentalDuration');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryDuration = document.getElementById('summaryDuration');
  const summaryAdvance = document.getElementById('summaryAdvance');

  const duration = parseInt(durationSelect?.value) || 1;
  const total = selectedRentalPrice * duration;
  const advance = Math.ceil(total * 0.5);

  if (summaryPrice) summaryPrice.textContent = `₹${selectedRentalPrice}/day`;
  if (summaryDuration) summaryDuration.textContent = `${duration} Day${duration > 1 ? 's' : ''}`;
  if (summaryAdvance) summaryAdvance.textContent = `₹${advance}`;
}

function submitBooking(e) {
  e.preventDefault();

  if (!selectedRentalItem) {
    alert('Please select a jewellery set to book first!');
    return;
  }

  const name = document.getElementById('bookingName')?.value;
  const phone = document.getElementById('bookingPhone')?.value;
  const eventDate = document.getElementById('eventDate')?.value;
  const duration = document.getElementById('rentalDuration')?.value;
  const address = document.getElementById('bookingAddress')?.value;
  const notes = document.getElementById('bookingNotes')?.value;

  const advance = Math.ceil(selectedRentalPrice * parseInt(duration) * 0.5);

  const message = encodeURIComponent(
    `🌟 *RENTAL BOOKING REQUEST* 🌟\n\n` +
    `💎 Jewellery: ${selectedRentalItem}\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `📅 Event Date: ${eventDate}\n` +
    `⏱ Duration: ${duration} Day(s)\n` +
    `💰 Advance (50%): ₹${advance}\n` +
    `📍 Address: ${address}\n` +
    `📝 Notes: ${notes || 'None'}\n\n` +
    `Please confirm the booking and share payment details. Thank you!`
  );

  // Open WhatsApp
  window.open(`https://wa.me/919876543210?text=${message}`, '_blank');

  // Show success toast
  showToast();

  // Reset form
  document.getElementById('bookingForm')?.reset();
  selectedRentalItem = null;
  selectedRentalPrice = 0;
  document.getElementById('selectedJewelName').textContent = 'Select a jewellery set to book';
  document.getElementById('formSubtitle').textContent = 'Complete the details to confirm your booking';
  document.getElementById('summaryPrice').textContent = '₹ --/day';
  document.getElementById('summaryDuration').textContent = '-- Days';
  document.getElementById('summaryAdvance').textContent = '₹ --';
}

// ============================================
// TESTIMONIAL SLIDER
// ============================================
function initTestimonialSlider() {
  // Auto-slide
  setInterval(() => {
    moveTestimonial(1);
  }, 5000);
}

function moveTestimonial(dir) {
  const cards = document.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;

  const visibleCount = window.innerWidth > 900 ? 3 : 1;
  const maxIndex = totalCards - visibleCount;

  testimonialIndex += dir;
  if (testimonialIndex > maxIndex) testimonialIndex = 0;
  if (testimonialIndex < 0) testimonialIndex = maxIndex;

  goToTestimonial(testimonialIndex);
}

function goToTestimonial(index) {
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('.dot');

  testimonialIndex = index;

  if (track) {
    const cardWidth = track.querySelector('.testimonial-card')?.offsetWidth || 0;
    const gap = 24;
    const offset = index * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

// ============================================
// QUICK VIEW MODAL
// ============================================
function openQuickView(name, imgSrc, desc) {
  const modal = document.getElementById('quickViewModal');
  const img = document.getElementById('modalImg');
  const title = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const waBtn = document.getElementById('modalWaBtn');

  if (img) img.src = imgSrc;
  if (title) title.textContent = name;
  if (descEl) descEl.textContent = desc;
  if (waBtn) {
    const msg = encodeURIComponent(`Hi! I'm interested in the ${name}. Please share the price and availability.`);
    waBtn.href = `https://wa.me/919876543210?text=${msg}`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeQuickView();
});

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast() {
  const toast = document.getElementById('bookingToast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function showToastMsg(msg) {
  const toast = document.getElementById('bookingToast');
  if (!toast) return;
  const textEl = toast.querySelector('.toast-text strong');
  const subEl = toast.querySelector('.toast-text span');
  if (textEl) textEl.textContent = '✓ ' + msg;
  if (subEl) subEl.textContent = 'Check your cart to enquire via WhatsApp';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================
// SMOOTH ANCHOR SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================
// WINDOW RESIZE — Recalculate slider
// ============================================
window.addEventListener('resize', () => {
  goToTestimonial(testimonialIndex);
});
