# Minimalist Editorial Portfolio UI

Build lightweight, accessible, Swiss-minimalist editorial portfolio interfaces featuring frameless typography-driven navigation, smooth scroll-spy tracking, interactive project case studies, and structured content grids.

## When to Use

- The user wants to create or redesign a developer, designer, or creative studio portfolio website.
- The user asks for a clean, minimalist, frameless, or editorial navigation bar with smooth scrolling and active section tracking.
- The user wants an interactive showcase for projects, filterable technical skills, work experience timelines, and contact forms without heavy visual clutter.

## Steps

### 1. Establish the Visual and Typographic System
Define a high-contrast, low-noise design token system using CSS custom properties so the layout remains consistent and easy to theme.

- Use a monochromatic base palette (off-white `#F4F4F2` and deep ink `#0D0E11`) paired with a single high-visibility accent color (such as electric green `#00FF66`) for active states and micro-indicators.
- Pair three distinct font roles: a condensed display sans-serif for oversized editorial headers, a clean geometric sans-serif for body copy, and a monospace font for index numbers, timestamps, and metadata tags.
- Apply hairline 1px borders (`rgba(13, 14, 17, 0.12)`) to separate content blocks cleanly instead of relying on heavy drop shadows or bulky card containers.

### 2. Build the Frameless Minimalist Navigation Bar
Construct a lightweight, top-aligned sticky header that prioritizes breathing room and typographic hierarchy over boxed containers.

- Keep the navigation frameless by default (`background: transparent`) and transition to a subtle translucent blur (`backdrop-filter: blur(10px)`) only after scrolling past the hero threshold (e.g., `window.scrollY > 24`).
- Place the clickable brand or creator mark on the left (`href="#home"`) and a clean horizontal list of text links (Home, About, Skills, Projects, Experience, Contact) on the right.
- Provide clear visual feedback using a 1.5px hairline underline that animates from `scaleX(0)` to `scaleX(1)` on hover and stays visible on the active link.
- Include a minimal two-line mobile toggle button (`aria-expanded`, `aria-controls`) that morphs into an X and reveals a clean full-width dropdown drawer on viewports under 768px.

### 3. Implement Scroll-Spy and Smooth Navigation
Ensure every navigation link accurately reflects the user's current reading position and scrolls smoothly across devices.

- Enable `scroll-behavior: smooth` on the root element and apply `scroll-margin-top` to each `<section id="...">` so sticky headers never obscure section headings.
- Use an `IntersectionObserver` (with `rootMargin: "-25% 0px -55% 0px"`) to detect which section is currently in view and toggle `.active` and `aria-current="page"` on both desktop and mobile navigation links.
- Automatically close the mobile navigation drawer whenever a link is clicked, when the Escape key is pressed, or when the viewport resizes to desktop width.

### 4. Structure Core Portfolio Sections
Organize the page into semantic, numbered editorial sections (01 through 06) that guide visitors from introduction to conversion.

- **Hero (`#home`):** Combine an editorial framed visual or portrait with oversized display typography (`mix-blend-mode: difference` where appropriate), a concise role statement, and vertical or inline social links.
- **About (`#about`):** Present the creator's philosophy in a bold statement block alongside structured metadata cells (location, focus areas, availability, and direct contact copy button).
- **Skills (`#skills`):** Group technical capabilities into logical categories and provide interactive category filter tabs plus a live text search input that highlights matching tags.
- **Projects (`#projects`):** Render featured works in a 2-column editorial grid where clicking any card opens an accessible modal (`role="dialog"`, `aria-modal="true"`) displaying problem context, architecture stack, and deliverables.
- **Experience (`#experience`):** Format career history as a scannable chronological table or timeline with period, role, organization, and impact tags.
- **Contact (`#contact`):** Include one-click email copying with toast feedback, verified external links, and a client-side validated message form.

### 5. Verify Accessibility and Responsiveness
Validate that the interface works reliably across keyboard, screen reader, and touch interactions before finalizing output.

- Check that all interactive buttons and links have discernible text or `aria-label` attributes and visible `:focus-visible` outlines.
- Confirm that opening a project modal traps or manages focus properly and supports closing via the close button, backdrop click, or Escape key.
- Verify that oversized display text scales fluidly using `clamp()` so horizontal overflow never occurs on mobile screens.

## Gotchas

- **Over-crowding the navigation bar:** Avoid wrapping the navbar in heavy pill boxes, adding redundant status badges, or stacking secondary metadata bars above the header when a minimalist aesthetic is requested. Let whitespace and typography carry the hierarchy.
- **Scroll-spy offset mismatches:** Relying solely on raw scroll event pixel math often fails when dynamic content (like filtered skills) changes page height. Prefer `IntersectionObserver` with percentage-based `rootMargin` for resilient active state tracking.
- **Unresponsive blended typography:** When using `mix-blend-mode: difference` for overlapping hero titles, ensure the underlying container has a defined contrast background so the text remains legible across both light and dark regions.
