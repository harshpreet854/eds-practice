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
    if (!cell) return null;

    let el = cell.querySelector('picture');
    if (!el) el = cell.querySelector('img');
    if (!el) return null;

    const clone = el.cloneNode(true);
    fixImageUrls(clone);
    return clone;
  };

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');

    if (index === 0) {
      desktopLogo = getImage(cells[0]);
      mobileLogo = getImage(cells[1]);

      const linkEl = cells[2]?.querySelector('a');
      logoLink = linkEl ? linkEl.getAttribute('href') : getText(cells[2]);
    } else {
      const name = getText(cells[0]);
      const code = getText(cells[1]);
      const label = getText(cells[2]);

      if (name && code) {
        languages.push({ name, code, label: label || 'Language' });
      }
    }
  });

  if (!languages.length) {
    languages.push({ name: 'English', code: 'en', label: 'Language' });
  }

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

  /* ===== DESKTOP LANGUAGE DROPDOWN ===== */
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

    // Update mobile menu if it exists
    const mobileMenu = document.querySelector('.kp-mobile-menu');
    if (mobileMenu) {
      const mobileLangButton = mobileMenu.querySelector('.kp-mobile-language-button');
      if (mobileLangButton) {
        mobileLangButton.textContent = lang.name;
      }
    }
  }

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

  button.onclick = (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    button.setAttribute('aria-expanded', isOpen);
  };

  document.addEventListener('click', () => {
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  });

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

  /* ===== HAMBURGER MENU (MOBILE) ===== */
  const hamburger = document.createElement('button');
  hamburger.className = 'kp-hamburger-button';
  hamburger.setAttribute('aria-label', 'Open menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = `
    <span class="kp-hamburger-icon"></span>
    <span class="kp-hamburger-text">Menu</span>
  `;

  const mobileMenuBackdrop = document.createElement('div');
  mobileMenuBackdrop.className = 'kp-mobile-backdrop';

  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'kp-mobile-menu';

  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'kp-mobile-header';

  const mobileBrand = document.createElement('div');
  mobileBrand.className = 'kp-mobile-brand';
  const mobileLogoLinkEl = document.createElement('a');
  mobileLogoLinkEl.href = logoLink;

  if (mobileLogo) {
    const mobileLogoClone = mobileLogo.cloneNode(true);
    mobileLogoClone.classList.remove('kp-logo-mobile');
    mobileLogoClone.classList.add('kp-mobile-logo');
    mobileLogoLinkEl.appendChild(mobileLogoClone);
  }

  mobileBrand.appendChild(mobileLogoLinkEl);

  const closeButton = document.createElement('button');
  closeButton.className = 'kp-close-button';
  closeButton.setAttribute('aria-label', 'Close menu');
  closeButton.innerHTML = `
    <span class="kp-close-icon">✕</span>
    <span class="kp-close-text">Close</span>
  `;

  mobileHeader.append(mobileBrand, closeButton);
  mobileMenu.appendChild(mobileHeader);

  /* Mobile Language Menu */
  const mobileLanguageSection = document.createElement('div');
  mobileLanguageSection.className = 'kp-mobile-language-section';

  const mobileLanguageLabel = document.createElement('div');
  mobileLanguageLabel.className = 'kp-mobile-language-label';
  mobileLanguageLabel.textContent = current.label || 'Language';

  const mobileLanguageButton = document.createElement('button');
  mobileLanguageButton.className = 'kp-mobile-language-button';
  mobileLanguageButton.textContent = current.name;
  mobileLanguageButton.setAttribute('aria-haspopup', 'listbox');
  mobileLanguageButton.setAttribute('aria-expanded', 'false');

  const mobileLanguageDropdown = document.createElement('div');
  mobileLanguageDropdown.className = 'kp-mobile-language-dropdown';
  mobileLanguageDropdown.setAttribute('role', 'listbox');

  languages.forEach((lang) => {
    const opt = document.createElement('button');
    opt.className = 'kp-mobile-language-option';
    opt.textContent = lang.name;
    opt.dataset.code = lang.code;
    opt.setAttribute('role', 'option');
    opt.setAttribute('aria-selected', lang.code === current.code);

    if (lang.code === current.code) {
      opt.classList.add('active');
    }

    opt.onclick = (e) => {
      e.stopPropagation();
      current = lang;

      mobileLanguageButton.textContent = lang.name;
      mobileLanguageLabel.textContent = lang.label || 'Language';

      mobileLanguageDropdown.querySelectorAll('.kp-mobile-language-option').forEach((o) => {
        o.classList.remove('active');
        o.setAttribute('aria-selected', 'false');
      });

      opt.classList.add('active');
      opt.setAttribute('aria-selected', 'true');

      mobileLanguageDropdown.classList.remove('open');
      mobileLanguageButton.setAttribute('aria-expanded', 'false');

      updateUI(lang);
    };

    mobileLanguageDropdown.appendChild(opt);
  });

  mobileLanguageButton.onclick = (e) => {
    e.stopPropagation();
    const isOpen = mobileLanguageDropdown.classList.toggle('open');
    mobileLanguageButton.setAttribute('aria-expanded', isOpen);
  };

  mobileLanguageSection.append(mobileLanguageLabel, mobileLanguageButton, mobileLanguageDropdown);
  mobileMenu.appendChild(mobileLanguageSection);

  /* Close menu handlers */
  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenuBackdrop.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeButton.addEventListener('click', closeMenu);
  mobileMenuBackdrop.addEventListener('click', closeMenu);

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isOpen);
    mobileMenuBackdrop.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  });

  /* Close on escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  block.appendChild(hamburger);
  block.appendChild(mobileMenuBackdrop);
  block.appendChild(mobileMenu);
}
