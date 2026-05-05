export default async function decorate(block) {
  const headerBlock = document.querySelector('header .header');
  if (headerBlock) headerBlock.style.display = 'none';

  const rows = Array.from(block.children);

  let desktopLogoContent = null;
  let mobileLogoContent = null;
  let logoLink = '#';
  const languages = [];

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');

    if (index === 0) {
      desktopLogoContent = cells[0]?.innerHTML;
    } else if (index === 1) {
      mobileLogoContent = cells[0]?.innerHTML;
    } else if (index === 2) {
      const linkEl = cells[0]?.querySelector('a');
      logoLink = linkEl
        ? linkEl.getAttribute('href')
        : cells[0]?.textContent.trim();
    } else {
      const name = cells[0]?.textContent.trim();
      const code = cells[1]?.textContent.trim();
      const label = cells[2]?.textContent.trim();

      if (name && code) {
        languages.push({ name, code, label });
      }
    }
  });

  if (!languages.length) {
    languages.push({ name: 'English', code: 'en', label: 'Language' });
  }

  block.textContent = '';

  const header = document.createElement('div');
  header.className = 'kp-header-container';

  /* LOGO */
  const brand = document.createElement('div');
  brand.className = 'kp-header-brand';

  const logoLinkEl = document.createElement('a');
  logoLinkEl.href = logoLink;

  if (desktopLogoContent) {
    const d = document.createElement('div');
    d.className = 'kp-logo-desktop';
    d.innerHTML = desktopLogoContent;
    logoLinkEl.appendChild(d);
  }

  if (mobileLogoContent) {
    const m = document.createElement('div');
    m.className = 'kp-logo-mobile';
    m.innerHTML = mobileLogoContent;
    logoLinkEl.appendChild(m);
  }

  brand.appendChild(logoLinkEl);

  /* LANGUAGE */
  const langWrapper = document.createElement('div');
  langWrapper.className = 'kp-language-wrapper';

  const label = document.createElement('span');
  label.className = 'kp-language-label';

  const button = document.createElement('button');
  button.className = 'kp-language-button';

  const menu = document.createElement('div');
  menu.className = 'kp-language-menu';

  let current = languages[0];

  // ✅ declare BEFORE use
  let mobileHeaderLabel = null;

  function updateLanguageUI(lang) {
    button.textContent = lang.name;
    label.textContent = lang.label || 'Language';

    menu.querySelectorAll('.kp-language-option').forEach((opt) => {
      opt.classList.remove('active');
      if (opt.dataset.code === lang.code) {
        opt.classList.add('active');
      }
    });

    // safe check
    if (mobileHeaderLabel) {
      mobileHeaderLabel.textContent = lang.label || 'Language';
    }
  }

  languages.forEach((lang) => {
    const opt = document.createElement('button');
    opt.className = 'kp-language-option';
    opt.textContent = lang.name;
    opt.dataset.code = lang.code;

    if (lang.code === current.code) {
      opt.classList.add('active');
    }

    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      current = lang;
      updateLanguageUI(lang);
      menu.classList.remove('open');
    });

    menu.appendChild(opt);
  });

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('open');
  });

  langWrapper.append(label, button, menu);

  const langDesktop = document.createElement('div');
  langDesktop.className = 'kp-header-language';
  langDesktop.appendChild(langWrapper);

  /* MOBILE MENU */
  const menuBtn = document.createElement('button');
  menuBtn.className = 'kp-menu-button';
  menuBtn.innerHTML = `
    <span class="kp-menu-icon"></span>
    <span class="kp-menu-text">Menu</span>
  `;

  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'kp-mobile-menu';

  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'kp-mobile-header';

  // ✅ NOW initialize properly
  mobileHeaderLabel = document.createElement('span');
  mobileHeaderLabel.textContent = current.label;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'kp-close-button';
  closeBtn.innerHTML = '✕<br/>Close';

  mobileHeader.appendChild(mobileHeaderLabel);
  mobileHeader.appendChild(closeBtn);

  mobileMenu.appendChild(mobileHeader);

  menuBtn.onclick = () => {
    mobileMenu.appendChild(langWrapper);
    mobileMenu.classList.add('open');
  };

  closeBtn.onclick = () => {
    langDesktop.appendChild(langWrapper);
    mobileMenu.classList.remove('open');
  };

  document.body.appendChild(mobileMenu);

  /* INIT UI AFTER EVERYTHING EXISTS */
  updateLanguageUI(current);

  /* ASSEMBLE */
  header.appendChild(brand);
  header.appendChild(menuBtn);
  header.appendChild(langDesktop);

  block.appendChild(header);
}