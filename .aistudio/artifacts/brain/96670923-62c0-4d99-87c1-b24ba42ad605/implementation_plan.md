# Atelier Mockup Studio & Custom Apparel Configurator

A real-time customizable apparel studio and e-commerce configurator enabling users to upload graphics, position artwork with interactive drag/scale/rotate controls, adjust garment colorways, inspect photorealistic product mockups, and calculate dynamic pricing with instant cart and order previews.

## User Review & Critical Decisions

> [!IMPORTANT]
> The product specifications were aligned during the interactive clarification phase:
> - **Product Lineup**: Full mix featuring urban backpacks, 6-panel caps, retro-runner sneakers, and heavyweight streetwear t-shirts.
> - **Customization Tools**: High-fidelity graphic and vector uploads with interactive canvas manipulation (drag, scale, rotate, opacity, blend modes) plus curated print sample presets.
> - **Primary Workflow Layout**: E-commerce split-view product configurator with real-time live mockup rendering, dynamic cost calculation based on print surface area and materials, and sliding cart & order verification.

- **Confirmed Decision 1**: Interactive canvas overlay using SVG displacement, texture blending (multiply/overlay/screen), and dynamic perspective grids for authentic fabric and curved surface previews.
- **Confirmed Decision 2**: E-commerce pricing breakdown that dynamically factors in base garment cost, print complexity, placement zones (front, back, side/quarter), and quantity tiers.

---

## 1. Overview & Core Concept

- **What It Does**: Provides creators, streetwear brands, and merchandise designers with an interactive studio to test custom prints instantly on four iconic apparel silhouettes (Tactical Roll-top Backpack, Structured 6-Panel Cap, Heritage Low-top Sneaker, and Heavyweight Boxy Tee). Users upload custom artwork or pick curated vector badges, position them with on-screen bounding boxes, switch colorways, view multiple angles, and immediately test e-commerce ordering flows with accurate price estimates.
- **Target Audience / Persona**: Independent apparel brands, merchandise creators, custom gear shops, and fashion enthusiasts seeking fast, photorealistic print visualization without complex 3D modeling software.
- **Key Value**: Instant visual validation of print sizing, fabric interaction, and realistic lighting, tied directly to actionable unit economics and a frictionless cart experience.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Silhouette Selection & Angle Exploration**: Users switch between Backpack, Cap, Sneaker, and Streetwear Tee via clean segmented tab controls. Each product features dedicated multi-angle views (e.g., Front, Side, 3/4 Perspective).
2. **Artwork Customization & Placement**: Users upload their own PNG/SVG/JPEG artwork or choose from curated graphic presets. The interactive stage allows intuitive dragging, pinch/corner scaling, angle rotation, centering, and blend mode toggles (Multiply for realistic fabric weave embedding, Normal for vibrant vinyl).
3. **Colorway & Material Customization**: Users select garment colorways (Onyx Black, Bone Chalk, Vintage Olive, Desert Khaki, Washed Cobalt, Deep Clay) with matching metallic hardware and sole/strap options.
4. **Dynamic Price Estimation**: Price reflects garment base, print placement zones, and color treatments, recalculating in real-time with bulk discount tier projections.
5. **Bag & Order Preview Drawer**: Users add custom mockups to cart, view detailed breakdown (thumbnail, placement dimensions, selected colorway, SKU), and review a complete proof sheet with high-resolution export.

### Visual Identity & Theme

- **Aesthetic Direction**: High-end minimalist streetwear studio inspired by Scandinavian design and Japanese fashion lookbooks (clean architectural lines, refined typography, and neutral stone/slate palette).
- **Color Palette & Distribution (60-30-10 Rule)**:
  - `60% Neutral Canvas`: Crisp chalk `#F8F9FA` and gallery off-white `#FFFFFF` (dark accents `#09090B`).
  - `30% Structural Surfaces`: Subdued borders (`#E4E4E7`), neutral slate badges, and quiet matte controls (`#27272A`).
  - `10% High-Intent Accent`: Safety Orange / Vibrant Tangerine (`#FF5500`) for primary action buttons, active canvas transform gizmos, and cart callouts.
- **Typography & Scale**:
  - *Display / Headings*: `Outfit` / `Plus Jakarta Sans` with balanced line wraps and tight letter tracking.
  - *Body Prose*: `Plus Jakarta Sans` / `DM Sans` with comfortable reading measures.
  - *Pricing & Metrics*: Tabular monospace figures (`font-mono tabular-nums`) for stable financial alignment.
- **Zero-Pill Discipline**: Metadata rendered as unboxed inline text with typographic separators (`·`). Interactive tabs styled as crisp segmented switchers rather than pill capsules.

---

## 3. Key Product Decisions & Trade-Offs

- **Canvas & Mockup Engine**:
  - *Chosen Approach*: Multi-layered SVG vector and high-resolution alpha-masked canvas composites with CSS blend modes (`mix-blend-mode: multiply`, realistic shadows, highlight overlays, and texture grain).
  - *Why*: Provides instant 60 FPS performance, zero WebGL crashing across low-end mobile devices, and crisp pixel alignment with sub-millimeter precision.
  - *Alternatives Considered*: Three.js / WebGL 3D meshes (requires heavy 3D asset downloads, complex UV mapping setup, and higher GPU latency).
- **Interactive Transform Controls**:
  - *Chosen Approach*: Direct on-canvas interactive bounding box with corner scale handles, rotation handle, and drag positioner, paired with numeric fine-tuning sliders in the sidebar for accessibility.
  - *Why*: Gives designers professional Figma-grade tactile direct manipulation while maintaining numerical repeatability.
- **State Management & Persistence**:
  - *Chosen Approach*: Client-side reactive state with `localStorage` persistence for active design drafts, uploaded graphics, and cart items.
  - *Why*: Instant offline resilience, zero backend roundtrips for preview rendering, and reliable checkout recovery.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Bar (Brand & Bag Drawer)                    │
└────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│     Live Mockup Viewport      │       │     Customizer & PDP Panel    │
│  - Realistic Garment Base     │       │  - Product & Angle Selector   │
│  - Texture & Shadow Overlays  │       │  - Colorway Swatches          │
│  - Interactive Art Transform  │◄─────►│  - Artwork Upload & Presets   │
│    (Drag, Scale, Rotate)      │       │  - Position & Layer Controls  │
│  - Zoom & Perspective Grid    │       │  - Real-time Price Breakdown  │
│  - Instant PNG Export         │       │  - "Add to Bag" Action        │
└───────────────────────────────┘       └───────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│              Cart & Proof Drawer (Itemized Specs & Checkout)           │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models

- **ProductSilhouette**:
  - `id`: `'backpack' | 'cap' | 'sneaker' | 'tee'`
  - `name`: string, `category`: string, `basePrice`: number
  - `angles`: Array of `{ id, label, printBounds: { x, y, width, height, maxScale, curvature } }`
  - `colorways`: Array of `{ name, hex, accentHex }`
  - `materials`: Array of `{ name, finish, costModifier }`
- **DesignLayer**:
  - `id`: string, `type`: `'image' | 'preset' | 'text'`
  - `url`: string (data URL or SVG preset)
  - `x`: number, `y`: number, `scale`: number, `rotation`: number
  - `opacity`: number, `blendMode`: `'multiply' | 'normal' | 'overlay'`
- **CartItem**:
  - `id`: string, `productId`: string, `productName`: string
  - `colorway`: string, `selectedAngle`: string, `price`: number
  - `quantity`: number, `previewDataUrl`: string, `layerSpecs`: DesignLayer[]

### Interactive State Transitions

- **Product/Angle Switch**: Smoothly switches mockup backdrop while retaining artwork coordinates normalized relative to print area bounds.
- **Drag & Scale Interaction**: Mouse/Touch event handlers with pointer capture calculate delta displacements, preventing canvas jitter and keeping artwork bound inside printable safe margins.
- **Live Pricing Calculation**:
  `Total = BasePrice + (ActivePlacements * 6.50) + (MaterialModifier) - VolumeDiscount(qty)`
- **Export & Proof Sheet**: Canvas snapshot renderer composites the composite view into downloadable high-res PNG for production handover.
