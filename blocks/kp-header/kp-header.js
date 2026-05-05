/**
 * Loads and decorates the KP header block
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Hide the regular header when kp-header is present
  const headerBlock = document.querySelector('header .header');
  if (headerBlock) {
    headerBlock.style.display = 'none';
  }

  // Extract logo, link, and language options from authored content
  const rows = Array.from(block.children);

  let logoElement = null;
  let logoLink = '';
  const languages = [];

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll(':scope > div');
    if (index === 0) {
      // First row: logo image and link
      logoElement = cells[0]?.querySelector('picture, img, svg') || cells[0]?.querySelector('a picture, a img, a svg') || cells[0];
      // Try to get the link from an <a> tag or from the cell text
      const linkEl = cells[0]?.querySelector('a');
      logoLink = linkEl ? linkEl.getAttribute('href') : (cells[1]?.textContent.trim() || '');
    } else {
      // Language rows: name, code, label
      const langName = cells[0]?.textContent.trim() || '';
      const langCode = cells[1]?.textContent.trim() || '';
      const langLabel = cells[2]?.textContent.trim() || '';
      if (langName && langCode) {
        languages.push({ name: langName, code: langCode, label: langLabel });
      }
    }
  });

  // Default languages if none provided
  if (languages.length === 0) {
    languages.push({ name: 'English', code: 'en', label: 'Language' });
    languages.push({ name: 'Español', code: 'es', label: 'Idioma' });
  }

  // Clear the block
  block.textContent = '';

  // Create header structure
  const header = document.createElement('div');
  header.className = 'kp-header-container';

  // Create brand section with logo
  const brandSection = document.createElement('div');
  brandSection.className = 'kp-header-brand';

  if (logoElement) {
    const logoWrapper = document.createElement('a');
    logoWrapper.className = 'kp-header-logo-link';
    logoWrapper.href = logoLink || '#';
    logoWrapper.setAttribute('aria-label', 'Kaiser Permanente Home');
    // Clone the logo node for safety
    logoWrapper.appendChild(logoElement.cloneNode(true));
    brandSection.appendChild(logoWrapper);
  }

  // Create language dropdown section
  const langSection = document.createElement('div');
  langSection.className = 'kp-header-language';

  // Create wrapper for language dropdown
  const langWrapper = document.createElement('div');
  langWrapper.className = 'kp-language-wrapper';

  // Create label
  const langLabel = document.createElement('span');
  langLabel.className = 'kp-language-label';
  langLabel.textContent = languages[0].label || 'Language';

  // Create dropdown button
  const dropdownButton = document.createElement('button');
  dropdownButton.className = 'kp-language-button';
  dropdownButton.setAttribute('aria-haspopup', 'listbox');
  dropdownButton.setAttribute('aria-label', 'Select language');

  // Set initial language
  let currentLang = languages[0];
  dropdownButton.textContent = currentLang.name;
  dropdownButton.dataset.currentLang = currentLang.code;

  // Create dropdown menu
  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'kp-language-menu';
  dropdownMenu.setAttribute('role', 'listbox');
  dropdownMenu.setAttribute('aria-label', 'Language options');

  languages.forEach((lang) => {
    const option = document.createElement('button');
    option.className = 'kp-language-option';
    option.textContent = lang.name;
    option.dataset.langCode = lang.code;
    option.setAttribute('role', 'option');
    if (lang.code === currentLang.code) {
      option.classList.add('active');
      option.setAttribute('aria-selected', 'true');
    }
    option.addEventListener('click', (e) => {
      e.preventDefault();
      // Update active state
      dropdownMenu.querySelectorAll('.kp-language-option').forEach((opt) => {
        opt.classList.remove('active');
        opt.setAttribute('aria-selected', 'false');
      });
      option.classList.add('active');
      option.setAttribute('aria-selected', 'true');
      // Update button text and label
      dropdownButton.textContent = lang.name;
      dropdownButton.dataset.currentLang = lang.code;
      langLabel.textContent = lang.label || 'Language';
      currentLang = lang;
      // Close menu
      dropdownMenu.classList.remove('open');
      dropdownButton.setAttribute('aria-expanded', 'false');
      // Dispatch change event for potential listeners
      const event = new CustomEvent('languageChange', {
        detail: { language: lang.code, languageName: lang.name }
      });
      document.dispatchEvent(event);
    });
    dropdownMenu.appendChild(option);
  });

  // Toggle dropdown on button click
  dropdownButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdownMenu.classList.toggle('open');
    const isOpen = dropdownMenu.classList.contains('open');
    dropdownButton.setAttribute('aria-expanded', isOpen);
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!langWrapper.contains(e.target)) {
      dropdownMenu.classList.remove('open');
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on Escape key
  dropdownButton.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      dropdownMenu.classList.remove('open');
      dropdownButton.setAttribute('aria-expanded', 'false');
      dropdownButton.focus();
    }
  });

  // Build the language dropdown
  langWrapper.appendChild(langLabel);
  langWrapper.appendChild(dropdownButton);
  langWrapper.appendChild(dropdownMenu);
  langSection.appendChild(langWrapper);

  // Assemble header
  header.appendChild(brandSection);
  header.appendChild(langSection);
  block.textContent = '';
  block.appendChild(header);
}
