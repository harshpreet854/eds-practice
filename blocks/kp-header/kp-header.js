export default function decorate(block) {
  const rows = [...block.children];

  // Expected EDS content:
  // 0: logo image
  // 1: link
  // 2: Language label EN
  // 3: en code
  // 4: Español
  // 5: es code

  const logoImg = rows[0]?.querySelector('img');
  const logoLink = rows[1]?.textContent?.trim() || '#';

  const languages = [
    {
      label: rows[2]?.textContent?.trim() || 'English',
      code: rows[3]?.textContent?.trim() || 'en'
    },
    {
      label: rows[4]?.textContent?.trim() || 'Español',
      code: rows[5]?.textContent?.trim() || 'es'
    }
  ];

  // Language label translations
  const languageLabels = {
    en: 'Language',
    es: 'Idioma',
    fr: 'Langue',
    de: 'Sprache'
  };

  let currentLang = languages[0];

  block.innerHTML = `
    <div class="kp-header">
      <div class="kp-header__container">
        
        <a class="kp-header__logo" href="${logoLink}">
          ${logoImg ? logoImg.outerHTML : ''}
        </a>

        <div class="kp-header__right">
          <span class="kp-header__lang-label">
            ${languageLabels[currentLang.code] || 'Language'}
          </span>

          <div class="kp-header__dropdown">
            <button class="kp-header__dropdown-btn">
              ${currentLang.label}
            </button>

            <ul class="kp-header__dropdown-list">
              ${languages.map(lang => `
                <li data-code="${lang.code}">
                  ${lang.label}
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

      </div>
    </div>
  `;

  const dropdown = block.querySelector('.kp-header__dropdown');
  const button = block.querySelector('.kp-header__dropdown-btn');
  const listItems = block.querySelectorAll('.kp-header__dropdown-list li');
  const label = block.querySelector('.kp-header__lang-label');

  // Toggle dropdown
  button.addEventListener('click', () => {
    dropdown.classList.toggle('open');
  });

  // Select language
  listItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedCode = item.dataset.code;
      const selectedLang = languages.find(l => l.code === selectedCode);

      if (selectedLang) {
        currentLang = selectedLang;
        button.textContent = selectedLang.label;
        label.textContent = languageLabels[selectedCode] || 'Language';

        // Optional: persist
        localStorage.setItem('kp-lang', selectedCode);
      }

      dropdown.classList.remove('open');
    });
  });

  // Load saved language
  const savedLang = localStorage.getItem('kp-lang');
  if (savedLang) {
    const saved = languages.find(l => l.code === savedLang);
    if (saved) {
      button.textContent = saved.label;
      label.textContent = languageLabels[savedLang] || 'Language';
    }
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });
}