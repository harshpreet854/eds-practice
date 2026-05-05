# KP Header Block

The `kp-header` is a customizable header block for Kaiser Permanente branding with an integrated language selector dropdown.

## Features

- **Brand Section**: Displays the main brand/logo text
- **Language Dropdown**: A fully accessible dropdown menu for language selection
- **Responsive Design**: Mobile-first layout that adapts to tablet and desktop
- **Accessibility**: Built with proper ARIA labels and keyboard navigation support
- **Custom Events**: Dispatches `languageChange` event when language is selected

## Authoring Content

The kp-header block expects authored content structured as follows:

### Structure

```
| Logo (image) + Brand Name / Text | 
| Language 1 | Language Code |
| Language 2 | Language Code |
```

### Example

Row 1 (Brand - with logo):
- Cell 1: Upload an image (logo) and/or add text `KAISER PERMANENTE®`

Row 2 (Language Option 1):
- Cell 1: `English`
- Cell 2: `en`

Row 3 (Language Option 2):
- Cell 1: `Español`
- Cell 2: `es`

### Logo Guidelines
- Upload your logo image in the first cell
- Recommended size: 40px height (auto-scales width)
- Format: PNG with transparent background works best
- The logo will appear to the left of the brand text
- If no logo is provided, only the brand text will display

## Markup

In AEM CMS, author content as a table with:
- **First row**: Brand text (single cell)
- **Following rows**: Language options (language name | language code)

The block will automatically parse this content and create a functional dropdown if languages are provided. If no languages are authored, it defaults to English and Spanish.

## Styling

The block uses CSS custom properties from the global styles:
- `--nav-height`: Header height (default: 64px)
- `--body-font-family`: Font family
- `--heading-font-size-s`: Brand text size
- `--body-font-size-xs`: Language label/button text size

Color scheme:
- Background: `#003f87` (Kaiser Permanente blue)
- Text: `white`
- Border: `rgba(255, 255, 255, 0.5)`

## JavaScript Behavior

### Functionality

1. **Dropdown Toggle**: Click the language button to open/close the dropdown
2. **Language Selection**: Click a language option to select it
3. **Keyboard Navigation**:
   - `Escape` key: Close the dropdown
   - Tab navigation: Move between options
   - Enter/Space: Select option (when focused)

### Events

The block dispatches a custom `languageChange` event when a language is selected:

```javascript
document.addEventListener('languageChange', (e) => {
  const { language, languageName } = e.detail;
  console.log(`Language changed to: ${languageName} (${language})`);
});
```

### Default Behavior

If no language options are authored:
- Defaults to `English (en)` and `Español (es)`

## Responsive Behavior

- **Mobile (< 600px)**: Brand and language selector may stack, dropdown adjusts position
- **Tablet (600px - 900px)**: Flexible layout with adjusted spacing
- **Desktop (≥ 900px)**: Full horizontal layout with maximum width constraint

## CSS Classes

All selectors are properly scoped to the block:

```
.kp-header                    /* Block container */
├── .kp-header-container      /* Main flex container */
├── .kp-header-brand          /* Brand section */
│   ├── .kp-header-logo       /* Logo image (if present) */
│   └── .kp-header-brand-text /* Brand text */
└── .kp-header-language       /* Language section */
    └── .kp-language-wrapper
        ├── .kp-language-label
        ├── .kp-language-button [aria-expanded]
        └── .kp-language-menu [.open]
            └── .kp-language-option [.active]
```

## Accessibility

- Proper ARIA labels and roles
- Keyboard accessible dropdown
- Focus visible states with clear outlines
- semantically correct button elements
- Screen reader friendly markup

## Testing

Use the included example file:

```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts
```

Then visit: `http://localhost:3000/drafts/kp-header-example`

