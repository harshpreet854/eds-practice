import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the header
 * Supports the kp-header block as the nav fragment content.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (!fragment) return;

  // check if the fragment contains a kp-header block (custom header)
  const kpHeader = fragment.querySelector('.kp-header');

  if (kpHeader) {
    // kp-header is self-contained: just pass through its content directly
    block.textContent = '';
    while (fragment.firstElementChild) block.append(fragment.firstElementChild);
    return;
  }

  // Fallback: standard boilerplate nav decoration
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
