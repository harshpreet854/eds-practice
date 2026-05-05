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

    if (index === 0) {
      desktopLogo = cells[0]?.querySelector('picture, img, svg');
    } else if (index === 1) {
      mobileLogo = cells[0]?.querySelector('picture, img, svg');
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

  /* ========================= */
  /* LOGO (Desktop + Mobile) */
  /* ========================= */

  const brand = document.createElement('div');
  brand.className = 'kp-header-brand';

  const logoLinkEl = document.createElement('a');
  logoLinkEl.href = logoLink;
  logoLinkEl.className = 'kp-header-logo-link';

  if (desktopLogo) {
    const dLogo = desktopLogo.cloneNode(true);
    dLogo.classList.add('kp-logo-desktop');
    logoLinkEl.appendChild(dLogo);
  }

  if (mobileLogo) {
    const mLogo = mobileLogo.cloneNode(true);
    mLogo.classList.add('kp-logo-mobile');
    logoLinkEl.appendChild(mLogo);
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

  const menu = document.createElement('div');
  menu.className = 'kp-language-menu';

  let current = languages[0];
  label.textContent = current.label || 'Language';
  button.textContent = current.name;

  languages.forEach((lang) => {
    const opt = document.createElement('button');
    opt.className = 'kp-language-option';
    opt.textContent = lang.name;

    if (lang.code === current.code) {
      opt.classList.add('active');
    }

    opt.onclick = () => {
      current = lang;
      button.textContent = lang.name;
      label.textContent = lang.label || 'Language';

      menu.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      opt.classList.add('active');

      menu.classList.remove('open');
    };

    menu.appendChild(opt);
  });

  button.onclick = (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  };

  document.addEventListener('click', () => {
    menu.classList.remove('open');
  });

  langWrapper.append(label, button, menu);

  const langDesktop = document.createElement('div');
  langDesktop.className = 'kp-header-language';
  langDesktop.appendChild(langWrapper);

  /* ========================= */
  /* MOBILE MENU */
  /* ========================= */

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

  const closeBtn = document.createElement('button');
  closeBtn.className = 'kp-close-button';
  closeBtn.innerHTML = '✕<br/>Close';

  mobileHeader.innerHTML = `<span>${current.label}</span>`;
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

  /* ========================= */
  /* ASSEMBLE */
  /* ========================= */

  header.appendChild(brand);
  header.appendChild(menuBtn);
  header.appendChild(langDesktop);

  block.appendChild(header);
}