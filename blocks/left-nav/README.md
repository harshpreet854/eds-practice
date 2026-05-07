# Left Nav Block

The `left-nav` is a reusable sidebar navigation block for the left rail (3-column) layout.

## Features

- **Desktop Sidebar**: Displays as a vertical navigation list in the left rail of a `sidebar-3-9` section
- **Mobile Integration**: Items are injected into the `kp-header` hamburger menu on mobile
- **Active State Detection**: Automatically marks the current page as active
- **Accessibility**: Semantic navigation with proper ARIA labels and keyboard support
- **Responsive Design**: Auto-hides on mobile (content moves to hamburger menu)

## Authoring Content

The left-nav block expects authored content as a simple table with one navigation item per row:

### Structure

```
| Label | Link |
| Label | Link |
```

### Example

Row 1:
- Cell 1: `Home`
- Cell 2: https://www.example.com/ (or a link: [link text](URL))

Row 2:
- Cell 1: `Statements`
- Cell 2: https://www.example.com/statements

Row 3:
- Cell 1: `Frequently asked questions`
- Cell 2: https://www.example.com/faq

## Markup

In AEM CMS, author content as a table with:
- **Column 1**: Navigation item label/text
- **Column 2**: URL or link to page

## Styling

The block uses CSS custom properties from global styles:
- `--text-color`: Link text color
- `--link-color`: Active/hover text color
- `--body-font-size-xs`: Font size for nav items

### Active State

The current page is detected by comparing `window.location.pathname` with the link URL. The matching nav item automatically gets:
- `color: var(--link-color)`
- `font-weight: 600`
- Left blue border

## Responsive Behavior

- **Desktop (≥ 600px)**: Displays as vertical sidebar list in left rail
- **Mobile (< 600px)**: Hidden from view; items injected into kp-header mobile menu

## Usage in Layout

Use with `sidebar-3-9` section style:

1. Add a section with **Section Metadata**: `Style | sidebar-3-9`
2. Add the `left-nav (slot-left)` block
3. Add other content/blocks `(slot-right)` or no slot (defaults right)

Example structure:
```
--- Section with sidebar-3-9 style
[left-nav (slot-left)]
[other blocks like alert, region-selector, etc.]
```

## CSS Classes

All selectors are properly scoped to the block:

```
.left-nav                  /* Block container */
├── .left-nav-container    /* Nav semantic element */
│   └── .left-nav-list     /* ul element */
│       └── .left-nav-item [.active]
│           └── .left-nav-link
```

Mobile menu injection:
```
.kp-mobile-menu
└── .kp-mobile-nav-section
    └── .kp-mobile-nav-list
        └── .kp-mobile-nav-item
            └── a.kp-mobile-nav-link
```

## Accessibility

- Semantic `<nav>` and `<ul>` / `<li>` elements
- `aria-label` on nav element
- `aria-current="page"` on active link
- Keyboard accessible links
- Focus visible states
- Proper color contrast

## Notes

- Links open in the same window (no target="_blank")
- No scroll behavior modification; user's browser scroll handling applies
- Active state is checked on page load only (not updated on dynamic navigation)
- Mobile injection waits up to 5 seconds for kp-header to be ready

## Testing

Test with a section that has `sidebar-3-9` style and add the left-nav block with slot-left option.

On desktop: verify navigation displays in left sidebar with proper styling and active state.
On mobile: open hamburger menu and verify nav items appear in the menu.

