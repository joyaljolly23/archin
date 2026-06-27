(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.nav__menu');
  var backdrop = document.querySelector('.menu-backdrop');

  if (!toggle || !menu || !backdrop) return;

  function closeMenu() {
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    backdrop.setAttribute('aria-hidden', 'false');
  }

  toggle.addEventListener('click', function () {
    if (document.body.classList.contains('menu-open')) {
      closeMenu();
      return;
    }
    openMenu();
  });

  backdrop.addEventListener('click', closeMenu);

  menu.addEventListener('click', function (event) {
    var link = event.target.closest('a');
    if (!link) return;
    closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  document.body.classList.add('menu-ready');
})();

(function () {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  var header = document.querySelector('.header');

  var backToTop = document.createElement('a');
  backToTop.href = '#';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '&uarr;';
  backToTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(backToTop);

  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var max = (doc.scrollHeight - doc.clientHeight) || 1;
    bar.style.width = Math.min(100, (scrollTop / max) * 100) + '%';
    if (header) header.classList.toggle('is-scrolled', scrollTop > 8);
    backToTop.classList.toggle('is-visible', scrollTop > 480);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var groupSelectors = [
    '.services__grid', '.projects__grid', '.values__grid', '.why-us__grid',
    '.network__grid', '.cards-3', '.process__steps'
  ];
  groupSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.classList.add('reveal-stagger');
    });
  });

  var singleSelectors = [
    '.section__title', '.section__lead', '.story__text', '.story__image',
    '.contact__form-section', '.contact__info', '.map-container',
    '.service-detail__text', '.service-detail__image', '.project-detail__header',
    '.project-detail__gallery', '.project-detail__content'
  ];
  singleSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (!el.classList.contains('reveal-stagger')) el.classList.add('reveal');
    });
  });

  var revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window && revealTargets.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var statNumbers = document.querySelectorAll('.stat__number');

  function animateCount(el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^(\d+(?:\.\d+)?)/);
    if (!match) return;
    var target = parseFloat(match[1]);
    var suffix = raw.slice(match[1].length);
    var duration = 1000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min(1, (timestamp - startTime) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = raw;
    }
    requestAnimationFrame(step);
  }

  if (statNumbers.length && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNumbers.forEach(function (el) { statObserver.observe(el); });
  }

  document.querySelectorAll('.filter__btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.filter__btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
    });
  });
})();

/* Floating bottom pill nav, mirrors the header's nav links */
(function () {
  var sourceLinks = document.querySelectorAll('.nav__menu .nav__link');
  if (!sourceLinks.length) return;

  var nav = document.createElement('nav');
  nav.className = 'floating-nav';
  nav.setAttribute('aria-label', 'Primary');

  sourceLinks.forEach(function (link) {
    var pill = document.createElement('a');
    pill.href = link.getAttribute('href');
    pill.className = 'floating-nav__link' + (link.classList.contains('active') ? ' active' : '');
    pill.textContent = link.textContent;
    nav.appendChild(pill);
  });

  document.body.appendChild(nav);
})();

/* Custom morphing cursor: grows over images, links and buttons */
(function () {
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  var dot = document.createElement('div');
  dot.className = 'gc-cursor';
  document.body.appendChild(dot);

  var mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  var active = false;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!active) {
      dot.classList.add('is-active');
      active = true;
    }
  });

  window.addEventListener('mouseleave', function () {
    dot.classList.remove('is-active');
    active = false;
  });

  function render() {
    curX += (mouseX - curX) * 0.2;
    curY += (mouseY - curY) * 0.2;
    dot.style.transform = 'translate(' + curX + 'px,' + curY + 'px) translate(-50%,-50%)';
    requestAnimationFrame(render);
  }
  render();

  var growSelector = 'a, button, .btn, .project__img, .card, .filter__btn';

  document.addEventListener('mouseover', function (e) {
    var target = e.target.closest(growSelector);
    if (target) {
      dot.classList.add('is-grow');
      if (target.matches('.project__img')) {
        dot.textContent = 'View';
      } else if (target.matches('.btn, a')) {
        dot.textContent = '';
      }
    }
  });

  document.addEventListener('mouseout', function (e) {
    var target = e.target.closest(growSelector);
    if (target) {
      dot.classList.remove('is-grow');
      dot.textContent = '';
    }
  });
})();