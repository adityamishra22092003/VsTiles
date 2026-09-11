# Tile Wale Bhaiya

A responsive single-page storefront for Tile Wale Bhaiya, showcasing luxury tiles, marble, sanitaryware, bath fittings, and interior surface solutions in Raipur, Chhattisgarh.

## Features

- Responsive navigation with mobile menu
- Hero section with animated entrance effects and subtle parallax
- Collection cards with category filters and quick-view specifications
- Interactive showroom hotspots
- Tile requirement calculator with quantity-based pricing tiers
- WhatsApp quotation links generated from calculator and product details
- Product gallery, testimonials, project showcase, and contact sections
- Scroll reveals, counters, progress indicator, and back-to-top control
- Reduced-motion and coarse-pointer fallbacks
- Image fallbacks for blocked or unavailable remote images

## Getting Started

No build step or package installation is required.

### Option 1: Open directly

Open `Index.html` in a modern browser.

### Option 2: Run a local server

From the project directory, run one of the following commands:

```bash
# Python
python -m http.server 8000

# Node.js, if npx is available
npx serve .
```

Then open the local URL shown by the command. A local server is recommended for more predictable asset and browser behavior.

## Project Structure

```text
.
├── Index.html       # Page structure and content
├── styles.css       # Responsive layout, theme, and animations
├── script.js        # Interactions and calculator logic
├── Logo.png         # Full brand logo
├── logo-icon.png    # Compact logo mark
└── README.md
```

## External Resources

The page loads these resources from CDNs:

- Google Fonts: Bricolage Grotesque, Inter, and JetBrains Mono
- GSAP 3.12.5
- GSAP ScrollTrigger 3.12.5
- Lenis 1.0.42
- Unsplash images used for the hero and product content

The page still provides basic functionality when the animation libraries or remote images are unavailable.

## Customization

- Update business details, product content, navigation, and section copy in `Index.html`.
- Adjust colors, typography, spacing, responsive behavior, and animations in `styles.css`.
- Update interactions, calculator rates, WhatsApp messages, and animation behavior in `script.js`.
- Replace the WhatsApp number in `script.js` and the contact links in `Index.html` when deploying for another business.
- Replace remote Unsplash URLs with owned or locally hosted product photography for production use.

## Notes

The tile calculator provides an estimate only. Final quantities, pricing, wastage, delivery, and installation should be confirmed with the business before purchase.
