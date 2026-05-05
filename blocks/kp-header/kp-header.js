export default async function decorate(block) {
  const headerBlock = document.querySelector('header .header');
  if (headerBlock) headerBlock.style.display = 'none';

  const rows = Array.from(block.children);

  let desktopLogo = null;
  let mobileLogo = null;
  let logoLink = '#';
  const languages = [];

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');

    // Skip first row (block name)
    if (index === 0) return;

    if (index === 1) {
      // Row 1 → logos + link
      desktopLogo = cells[0];
      mobileLogo = cells[1];

      const linkEl = cells[2]?.querySelector('a');
      logoLink = linkEl
        ? linkEl.getAttribute('href')
        : cells[2]?.textContent.trim();
    } else {
      // Language rows
      const name = cells[0]?.textContent.trim();
      const code = cells[1]?.textContent.trim();
      const label = cells[2]?.textContent.trim();

      if (name && code) {
        languages.push({ name, code, label });
      }
    }
  });

  block.textContent = '';

  const header = document.createElement('div');
  header.className = 'kp-header-container';

  /* ========================= */
  /* LOGO */
  /* ========================= */

  const brand = document.createElement('div');
  brand.className = 'kp-header-brand';

  const logoLinkEl = document.createElement('a');
  logoLinkEl.href = logoLink;

  // Desktop logo
  if (desktopLogo) {
    const d = desktopLogo.cloneNode(true);
    d.classList.add('kp-logo-desktop');
    logoLinkEl.appendChild(d);
  }

  // Mobile logo
  if (mobileLogo) {
    const m = mobileLogo.cloneNode(true);
    m.classList.add('kp-logo-mobile');
    logoLinkEl.appendChild(m);
  }

  brand.appendChild(logoLinkEl);

  /* ========================= */
  /* LANGUAGE */
  /* ========================= */

  const langWrapper = document.createElement('div');
  langWrapper.className = 'kp-language-wrapper';

  const label = document.createElement('span');
  label.className = 'kp-language-label';

  const button = document.createElement('button');
  button.className = 'kp-language-button';
  button.setAttribute('aria-expanded', 'false');

  const menu = document.createElement('div');
  menu.className = 'kp-language-menu';

  let current = languages[0];

  function updateUI(lang) {
    button.textContent = lang.name;
    label.textContent = lang.label;

    menu.querySelectorAll('.kp-language-option').forEach((opt) => {
      opt.classList.remove('active');
      if (opt.dataset.code === lang.code) {
        opt.classList.add('active');
      }
    });
  }

  languages.forEach((lang) => {
    const opt = document.createElement('button');
    opt.className = 'kp-language-option';
    opt.textContent = lang.name;
    opt.dataset.code = lang.code;

    opt.onclick = (e) => {
      e.stopPropagation();
      current = lang;
      updateUI(lang);
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    };

    menu.appendChild(opt);
  });

  button.onclick = (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
    button.setAttribute('aria-expanded', menu.classList.contains('open'));
  };

  document.addEventListener('click', () => {
    menu.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  });

  updateUI(current);

  langWrapper.append(label, button, menu);

  const langDesktop = document.createElement('div');
  langDesktop.className = 'kp-header-language';
  langDesktop.appendChild(langWrapper);

  /* ========================= */
  /* ASSEMBLE */
  /* ========================= */

  header.append(brand, langDesktop);
  block.appendChild(header);
}