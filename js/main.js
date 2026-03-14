document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuButton = document.querySelector('.fa-bars');
  const navbar = document.querySelector('.navbar');
  const backToTop = document.querySelector('.back-to-top');

  const isPageLayout = document.body.classList.contains('page');



  function closeMenu() {
    if (!menuButton || !navbar) return;
    menuButton.classList.remove('fa-times');
    navbar.classList.remove('nav-toggle');
    header.style.backgroundColor = "";
  }

  function updateHeaderState() {
    if (!header) return;
    const scrolled = window.scrollY > 35;
    header.classList.toggle('header--scrolled', isPageLayout || scrolled);
  }

  function updateBackToTop() {
    if (!backToTop) return;
    const visible = window.scrollY > 200;
    backToTop.style.display = visible ? 'flex' : 'none';
  }

  menuButton?.addEventListener('click', () => {
    menuButton.classList.toggle('fa-times');
    navbar?.classList.toggle('nav-toggle');
  
    if (navbar.classList.contains('nav-toggle')) {
      // Menu opened
      header.style.backgroundColor = "#002e5f";
    } else {
      // Menu closed
      header.style.backgroundColor = "";
    }
  });

  window.addEventListener('scroll', () => {
    closeMenu();
    updateHeaderState();
    updateBackToTop();
  });

  window.addEventListener('load', () => {
    updateHeaderState();
    updateBackToTop();
  });

  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Counter animation (works on any page that includes .counter elements)
  const counters = document.querySelectorAll('.counter');
  const speed = 120;
  counters.forEach((counter) => {
    const target = Number(counter.getAttribute('data-target') || '0');
    if (!Number.isFinite(target) || target <= 0) return;

    const updateCount = () => {
      const count = Number(counter.textContent || '0');
      const inc = target / speed;
      if (count < target) {
        counter.textContent = String(Math.ceil(count + inc));
        setTimeout(updateCount, 16);
      } else {
        counter.textContent = String(target);
      }
    };

    updateCount();
  });

  // Static contact form (no backend): opens user's mail client via mailto:
  const contactForm = document.querySelector('form[data-mailto]');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const to = contactForm.getAttribute('data-mailto') || '';
    if (!to) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const subject = encodeURIComponent('Website contact request');
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );

    window.location.href = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;
    contactForm.reset();
  });


});