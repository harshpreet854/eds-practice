export default async function decorate(block) {
  const rows = Array.from(block.children);

  let desktopLogo = null;
  let mobileLogo = null;
  let logoLink = '#';
  const languages = [];

  const getText = (el) => el?.textContent?.trim() || '';

  const fixImageUrls = (element) => {
    if (!element) return;

    // Fix <img src>
    const img = element.querySelector('img');
    if (img && img.getAttribute('src')?.startsWith('./')) {
      img.src = new URL(img.getAttribute('src'), window.location.href).href;
    }

    // Fix <source srcset>
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
    fixImageUrls(clone); // ✅ important
    return clone;
  };

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');

    if (index === 0) return;

    if (index === 1) {
      desktopLogo = getImage(cells[0]);
      mobileLogo = getImage(cells[1]);

      const linkEl = cells[2]?.querySelector('a');
      logoLink = linkEl
        ? linkEl.getAttribute('href')
        : getText(cells[2]);
    } else {
      const name = getText(cells[0]);
      const code = getText(cells[1]);
      const label = getText(cells[2]);

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

  if (desktopLogo) {
    desktopLogo.classList.add('kp-logo-desktop');
    logoLinkEl.appendChild(desktopLogo);
  }

  if (mobileLogo) {
    mobileLogo.classList.add('kp-logo-mobile');
    logoLinkEl.appendChild(mobileLogo);
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

  function updateUI(lang) {
    button.textContent = lang.name;
    label.textContent = lang.label || 'Language';

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

  updateUI(current);

  langWrapper.append(label, button, menu);

  const langDesktop = document.createElement('div');
  langDesktop.className = 'kp-header-language';
  langDesktop.appendChild(langWrapper);

  header.append(brand, langDesktop);
  block.appendChild(header);
}