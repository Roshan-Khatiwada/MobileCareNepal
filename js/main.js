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

  // Static contact form (no backend): opens WhatsApp with the typed message.
  // Fallback behavior:
  // - Android: fallback to Play Store if the app doesn't open.
  // - Others (desktop/iOS): fallback to WhatsApp Web.
  const contactForm = document.querySelector('form[data-whatsapp-phone]');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const whatsappPhone = String(contactForm.getAttribute('data-whatsapp-phone') || '').trim();
    if (!whatsappPhone) return;

    const submitWrap = contactForm.querySelector('.contact-form-btn');
    const submitBtn = contactForm.querySelector('.contact-form-btn input[type="submit"]');
    const whatsappLoader = contactForm.querySelector('.whatsapp-loader');
    const setLoading = (isLoading) => {
      submitWrap?.classList.toggle('is-loading', isLoading);
      if (submitBtn) submitBtn.disabled = isLoading;
      if (whatsappLoader) whatsappLoader.classList.toggle('is-loading', isLoading);
    };
    setLoading(true);

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const defaultText = String(contactForm.getAttribute('data-whatsapp-default-text') || '').trim();
    const baseText = message || defaultText || 'Hello, I need mobile repair service.';

    const text = name ? `Hi, I'm ${name}.\n${baseText}` : baseText;
    const encodedText = encodeURIComponent(text);

    // Deep link opens WhatsApp app (if installed).
    const whatsappDeepLink = `whatsapp://send?phone=${whatsappPhone}&text=${encodedText}`;
    // Web fallback always works when app isn't installed.
    const whatsappWebLink = `https://wa.me/${whatsappPhone}?text=${encodedText}`;
    const androidPlayStoreLink = 'https://play.google.com/store/apps/details?id=com.whatsapp';

    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);

    const fallbackUrl = isAndroid ? androidPlayStoreLink : whatsappWebLink;

    let opened = false;
    const onVisibilityChange = () => {
      opened = document.visibilityState === 'hidden';
    };
    document.addEventListener('visibilitychange', onVisibilityChange, { once: true });

    try {
      window.location.href = whatsappDeepLink;
    } catch {
      window.location.href = fallbackUrl;
      return;
    }

    // If WhatsApp didn't open, redirect to the fallback after a short delay.
    window.setTimeout(() => {
      if (!opened) window.location.href = fallbackUrl;
    }, isAndroid ? 2500 : 3500);
  });


});