// Melhorias progressivas: o site funciona sem JS; isto só melhora a experiência.

// 1. Menu mobile
function initMenu() {
  const button = document.querySelector('.site-header__toggle');
  const nav = document.getElementById('menu-principal');
  if (!button || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });
}

// 2. Alternar tema claro/escuro (preferência salva no navegador)
function initTheme() {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;
  button.hidden = false;

  const root = document.documentElement;
  const isDark = () =>
    root.dataset.theme === 'dark' ||
    (!root.dataset.theme && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const updateLabel = () => {
    button.setAttribute('aria-label', isDark() ? 'Ativar tema claro' : 'Ativar tema escuro');
  };
  updateLabel();

  button.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* sem localStorage: vale só nesta página */
    }
    updateLabel();
  });
}

// 3. Entrada suave das seções ao rolar
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
  );
  items.forEach((el) => observer.observe(el));
}

initMenu();
initTheme();
initReveal();
