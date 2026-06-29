// =============================================
// SHRI SAI BRIDAL JEWELS — script.js
// =============================================

const PHONE = '919025398147';

// ---- HERO SLIDER ----
let currentSlide = 0;
const SLIDE_DURATION = 5000;
let sliderTimer = null;
let progressTimer = null;

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  startSlider();
}

function goSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.sdot');

  slides[currentSlide].classList.remove('active');
  if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

  currentSlide = (index + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  if (dots[currentSlide]) dots[currentSlide].classList.add('active');

  animateProgress();
}

function changeSlide(dir) {
  clearTimers();
  goSlide(currentSlide + dir);
  startSlider();
}

function startSlider() {
  clearTimers();
  sliderTimer = setInterval(() => {
    goSlide(currentSlide + 1);
  }, SLIDE_DURATION);
  animateProgress();
}

function clearTimers() {
  clearInterval(sliderTimer);
  clearTimeout(progressTimer);
}

function animateProgress() {
  const bar = document.getElementById('sliderProgress');
  if (!bar) return;
  bar.style.transition = 'none';
  bar.style.width = '0%';
  // Force reflow
  bar.offsetWidth;
  bar.style.transition = `width ${SLIDE_DURATION}ms linear`;
  bar.style.width = '100%';
}

// ---- NAVBAR ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  const links = menu?.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    highlightNav();
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    menu?.classList.toggle('open');
    document.body.style.overflow = menu?.classList.contains('open') ? 'hidden' : '';
  });

  links?.forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      menu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-item');
  let found = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) found = s.id;
  });

  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + found);
  });
}

// ---- SMOOTH SCROLL ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const els = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children
        const siblings = [...entry.target.parentElement.querySelectorAll('.fade-up, .fade-left, .fade-right')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('in');
        }, idx * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

// ---- PRODUCT FILTER ----
function initFilter() {
  const btns = document.querySelectorAll('.filt');
  const cards = document.querySelectorAll('.pcard');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.f;
      cards.forEach(c => {
        const match = f === 'all' || c.dataset.cat === f;
        c.style.display = match ? '' : 'none';
        if (match) {
          c.classList.remove('fade-up');
          c.classList.add('fade-up');
          c.classList.remove('in');
          setTimeout(() => c.classList.add('in'), 50);
        }
      });
    });
  });
}

// ---- CART ----
let cart = [];

function addToCart(name) {
  if (cart.find(i => i.name === name)) {
    showToast(`"${name}" is already in your cart`);
    return;
  }
  cart.push({ name, id: Date.now() });
  renderCart();
  showToast(`Added: ${name}`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.length;
  const fabCount = document.getElementById('fabCount');
  const items = document.getElementById('cdrawerItems');
  const foot = document.getElementById('cdrawerFoot');
  const enquireBtn = document.getElementById('cartEnquireBtn');

  if (fabCount) fabCount.textContent = count;

  if (items) {
    if (count === 0) {
      items.innerHTML = `<div class="cart-empty-msg"><span>🛍️</span><p>Nothing added yet.<br>Browse collections above.</p></div>`;
    } else {
      items.innerHTML = cart.map(i => `
        <div class="cart-item-row">
          <span class="cart-item-name">${i.name}</span>
          <button class="cart-item-del" onclick="removeFromCart(${i.id})">✕</button>
        </div>`).join('');
    }
  }

  if (foot) foot.style.display = count ? 'block' : 'none';

  if (enquireBtn && count > 0) {
    const list = cart.map(i => i.name).join('%0A• ');
    enquireBtn.href = `https://wa.me/${PHONE}?text=Hi!%20I'm%20interested%20in%3A%0A%0A%E2%80%A2%20${list}%0A%0APlease%20share%20price%20and%20availability.`;
  }
}

function toggleCart() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  backdrop.classList.toggle('open');
  drawer.classList.toggle('open');
}

// ---- RENTAL BOOKING ----
let rentalName = '';
let rentalPrice = 0;

function selectRental(name, price) {
  rentalName = name;
  rentalPrice = price;

  const banner = document.getElementById('setbanner');
  const label = document.getElementById('selectedSetLabel');
  if (banner) banner.textContent = `Selected: ${name} — ₹${price}/day`;
  if (label) label.textContent = `Booking: ${name}`;

  calcAdvance();

  // Scroll to form
  const box = document.getElementById('bookingBox');
  if (box) {
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    box.style.boxShadow = '0 0 0 2px rgba(201,168,76,0.5)';
    setTimeout(() => box.style.boxShadow = '', 2500);
  }
}

function calcAdvance() {
  if (!rentalPrice) return;
  const days = parseInt(document.getElementById('bDays')?.value || 1);
  const total = rentalPrice * days;
  const adv = Math.ceil(total * 0.5);

  const cRate = document.getElementById('cRate');
  const cDays = document.getElementById('cDays');
  const cAdv = document.getElementById('cAdv');

  if (cRate) cRate.textContent = `₹${rentalPrice}/day`;
  if (cDays) cDays.textContent = `${days} Day${days > 1 ? 's' : ''}`;
  if (cAdv) cAdv.textContent = `₹${adv}`;
}

function submitBooking(e) {
  e.preventDefault();
  if (!rentalName) { showToast('Please select a jewellery set first'); return; }

  const name = document.getElementById('bName')?.value;
  const phone = document.getElementById('bPhone')?.value;
  const date = document.getElementById('bDate')?.value;
  const days = document.getElementById('bDays')?.value;
  const addr = document.getElementById('bAddr')?.value;
  const notes = document.getElementById('bNotes')?.value;
  const adv = Math.ceil(rentalPrice * parseInt(days) * 0.5);

  const msg = encodeURIComponent(
    `🌟 *RENTAL BOOKING REQUEST*\n\n` +
    `💎 Set: ${rentalName}\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `📅 Event Date: ${date}\n` +
    `⏱ Duration: ${days} day(s)\n` +
    `💰 50% Advance: ₹${adv}\n` +
    `📍 Address: ${addr}\n` +
    `📝 Notes: ${notes || 'None'}\n\n` +
    `Please confirm booking and share payment details.`
  );

  window.open(`https://wa.me/${PHONE}?text=${msg}`, '_blank');

  showToast('Booking sent! We will contact you shortly. ✓');
  e.target.reset();
  rentalName = '';
  rentalPrice = 0;
  document.getElementById('setbanner').textContent = 'No set selected yet';
  document.getElementById('selectedSetLabel').textContent = 'Select a jewellery set above to begin';
  document.getElementById('cRate').textContent = '—';
  document.getElementById('cDays').textContent = '—';
  document.getElementById('cAdv').textContent = '—';
}

// Set min date
function initMinDate() {
  const d = document.getElementById('bDate');
  if (!d) return;
  const dt = new Date();
  dt.setDate(dt.getDate() + 3);
  d.min = dt.toISOString().split('T')[0];
}

// ---- QUICK VIEW MODAL ----
function openModal(title, img, desc) {
  const bg = document.getElementById('modalBg');
  const mImg = document.getElementById('modalImg');
  const mTitle = document.getElementById('modalTitle');
  const mDesc = document.getElementById('modalDesc');
  const mWa = document.getElementById('modalWaBtn');

  if (mImg) mImg.src = img;
  if (mTitle) mTitle.textContent = title;
  if (mDesc) mDesc.textContent = desc;
  if (mWa) {
    const msg = encodeURIComponent(`Hi! I'm interested in the ${title}. Please share price and availability.`);
    mWa.href = `https://wa.me/${PHONE}?text=${msg}`;
  }

  bg?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalBg')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ---- TOAST ----
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  const tm = document.getElementById('toastMsg');
  if (!t) return;
  if (tm) tm.textContent = msg;
  clearTimeout(toastTimer);
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSlider();
  initSmoothScroll();
  initReveal();
  initFilter();
  initMinDate();
  renderCart();
});
