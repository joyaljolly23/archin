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
