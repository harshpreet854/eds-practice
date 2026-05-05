export default async function decorate(block) {
  const rows = Array.from(block.children);

  let desktopLogo = null;
  let mobileLogo = null;
  let logoLink = '#';
  const languages = [];

  const getText = (el) => el?.textContent?.trim() || '';

  const fixImageUrls = (element) => {
    if (!element) return;

    const img = element.querySelector('img');
    if (img && img.getAttribute('src')?.startsWith('./')) {
      img.src = new URL(img.getAttribute('src'), window.location.href).href;
    }

    element.querySelectorAll('source').forEach((source) => {
      const srcset = source.getAttribute('srcset');
      if (srcset && srcset.startsWith('./')) {
        source.srcset = new URL(srcset, window.location.href).href;
      }
    });
  };

  const getImage = (cell) => {
    const el = cell?.querySelector('picture, img');
    if (!el) return null;

    const clone = el.cloneNode(true);
    fixImageUrls(clone);
    return clone;
  };

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');

    // Skip header row (index 0)
    if (index === 0) return;

    // Extract logo and link from row 1
    if (index === 1) {
      desktopLogo = getImage(cells[0]);
      mobileLogo = getImage(cells[1]);

      // Extract link from third cell
      const linkEl = cells[2]?.querySelector('a');
      logoLink = linkEl ? linkEl.getAttribute('href') : getText(cells[2]);
    } else {
      // Extract language data from rows 2+
      const name = getText(cells[0]);
      const code = getText(cells[1]);
      const label = getText(cells[2]);

      // Only add if we have both name and code
      if (name && code) {
        languages.push({ name, code, label: label || 'Language' });
      }
    }
  });

  // Default language if none found
  if (!languages.length) {
    languages.push({ name: 'English', code: 'en', label: 'Language' });
  }

  // Clear block and build UI
  block.textContent = '';
  block.className = 'kp-header';

  const header = document.createElement('div');
  header.className = 'kp-header-container';

  /* ===== LOGO ===== */
  const brand = document.createElement('div');
  brand.className = 'kp-header-brand';

  const logoLinkEl = document.createElement('a');
  logoLinkEl.href = logoLink;

  if (desktopLogo) {
    desktopLogo.classList.add('kp-logo-desktop');
    logoLinkEl.appendChild(desktopLogo);
  }

  if (mobileLogo) {
    mobileLogo.classList.add('kp-logo-mobile');
    logoLinkEl.appendChild(mobileLogo);
  }

  brand.appendChild(logoLinkEl);

  /* ===== LANGUAGE DROPDOWN ===== */
  const langWrapper = document.createElement('div');
  langWrapper.className = 'kp-language-wrapper';

  const label = document.createElement('span');
  label.className = 'kp-language-label';

  const button = document.createElement('button');
  button.className = 'kp-language-button';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');

  const menu = document.createElement('div');
  menu.className = 'kp-language-menu';
  menu.setAttribute('role', 'listbox');

  let current = languages[0];

  function updateUI(lang) {
    button.textContent = lang.name;
    label.textContent = lang.label || 'Language';
    button.setAttribute('aria-label', `${lang.label || 'Language'}: ${lang.name}`);

    menu.querySelectorAll('.kp-language-option').forEach((opt) => {
      const isActive = opt.dataset.code === lang.code;
      opt.classList.toggle('active', isActive);
      opt.setAttribute('aria-selected', isActive);
    });
  }

  // Create all language options
  languages.forEach((lang) => {
    const opt = document.createElement('button');
    opt.className = 'kp-language-option';
    opt.textContent = lang.name;
    opt.dataset.code = lang.code;
    opt.setAttribute('role', 'option');
    opt.setAttribute('aria-selected', lang.code === current.code);

    opt.onclick = (e) => {
      e.stopPropagation();
      current = lang;
      updateUI(lang);
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    };

    menu.appendChild(opt);
  });

  // Toggle dropdown
  button.onclick = (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    button.setAttribute('aria-expanded', isOpen);
  };

  // Close on outside click
  document.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // Keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    } else if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  updateUI(current);

  langWrapper.append(label, button, menu);

  const langDesktop = document.createElement('div');
  langDesktop.className = 'kp-header-language';
  langDesktop.appendChild(langWrapper);

  header.append(brand, langDesktop);
  block.appendChild(header);
}