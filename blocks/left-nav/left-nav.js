/**
 * Injects left-nav items into the kp-header mobile menu
 * @param {Array} navItems Array of {title, url} objects
 */
function injectIntoMobileMenu(navItems) {
  // Wait for kp-header mobile menu to be ready
  const checkMobileMenu = setInterval(() => {
    const mobileMenu = document.querySelector('.kp-mobile-menu');
    const mobileLanguageSection = document.querySelector('.kp-mobile-language-section');

    if (mobileMenu && mobileLanguageSection) {
      clearInterval(checkMobileMenu);

      // Check if nav section already exists
      if (mobileMenu.querySelector('.kp-mobile-nav-section')) {
        return;
      }

      // Create mobile nav section (insert before language section)
      const navSection = document.createElement('div');
      navSection.className = 'kp-mobile-nav-section';

      const navList = document.createElement('ul');
      navList.className = 'kp-mobile-nav-list';

      navItems.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'kp-mobile-nav-item';

        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;

        li.appendChild(a);
        navList.appendChild(li);
      });

      navSection.appendChild(navList);

      // Insert before language section
      mobileMenu.insertBefore(navSection, mobileLanguageSection);
    }
  }, 100);

  // Timeout to prevent infinite loop
  setTimeout(() => clearInterval(checkMobileMenu), 5000);
}

/**
 * Loads and decorates the left-nav block
 * Desktop: displays as a vertical sidebar navigation
 * Mobile: injects items into the kp-header mobile menu
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // Parse authoring: each row is title | link
  const rows = Array.from(block.querySelectorAll(':scope > div'));
  const navItems = [];

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll(':scope > div'));
    if (cells.length >= 2) {
      const titleText = cells[0]?.textContent?.trim() || '';
      const linkEl = cells[1]?.querySelector('a');
      const linkUrl = linkEl?.href || cells[1]?.textContent?.trim() || '#';

      if (titleText && linkUrl !== '#') {
        navItems.push({
          title: titleText,
          url: linkUrl,
        });
      }
    }
  });

  // Clear block and rebuild
  block.textContent = '';
  block.className = 'left-nav';

  // Create desktop navigation
  const nav = document.createElement('nav');
  nav.className = 'left-nav-container';
  nav.setAttribute('aria-label', 'Main navigation');

  const ul = document.createElement('ul');
  ul.className = 'left-nav-list';

  navItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'left-nav-item';

    const a = document.createElement('a');
    a.className = 'left-nav-link';
    a.href = item.url;
    a.textContent = item.title;

    // Set active state if current page
    if (window.location.pathname === new URL(item.url, window.location).pathname) {
      li.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  block.appendChild(nav);

  // On mobile: inject items into kp-header mobile menu
  injectIntoMobileMenu(navItems);
}
