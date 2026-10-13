import { GraphicPreset } from '../types';

export const GRAPHIC_PRESETS: GraphicPreset[] = [
  {
    id: 'tokyo-cypher',
    title: 'Tokyo Cypher // 09',
    category: 'streetwear',
    aspectRatio: 1,
    svgContent: `
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" stroke-width="6" stroke-dasharray="16 8"/>
        <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" stroke-width="2"/>
        <polygon points="200,60 310,250 90,250" fill="none" stroke="currentColor" stroke-width="5"/>
        <circle cx="200" cy="186" r="28" fill="currentColor"/>
        <text x="200" y="295" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" text-anchor="middle" fill="currentColor" letter-spacing="8">TOKYO CYPHER</text>
        <text x="200" y="325" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" text-anchor="middle" fill="currentColor" letter-spacing="4">ARCHIVE / DIV. 09</text>
        <rect x="140" y="340" width="120" height="4" fill="currentColor"/>
      </svg>
    `
  },
  {
    id: 'vortex-racing',
    title: 'Vortex Grand Prix',
    category: 'badge',
    aspectRatio: 1.25,
    svgContent: `
      <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50,200 Q 250,50 450,200 Q 250,350 50,200 Z" fill="none" stroke="currentColor" stroke-width="8"/>
        <ellipse cx="250" cy="200" rx="150" ry="90" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="8 6"/>
        <path d="M 120,200 L 380,200" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>
        <circle cx="250" cy="200" r="45" fill="currentColor"/>
        <circle cx="250" cy="200" r="30" fill="#09090b"/>
        <text x="250" y="115" font-family="'Outfit', sans-serif" font-size="34" font-weight="900" text-anchor="middle" fill="currentColor" letter-spacing="12">VORTEX</text>
        <text x="250" y="310" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="700" text-anchor="middle" fill="currentColor" letter-spacing="6">MOTORSPORT DIVISION</text>
      </svg>
    `
  },
  {
    id: 'astronomia-glyph',
    title: 'Astronomia Celestial',
    category: 'minimal',
    aspectRatio: 1,
    svgContent: `
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" stroke-width="3"/>
        <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>
        <path d="M 200,40 L 200,360 M 40,200 L 360,200" stroke="currentColor" stroke-width="2"/>
        <polygon points="200,100 280,200 200,300 120,200" fill="none" stroke="currentColor" stroke-width="4"/>
        <circle cx="200" cy="200" r="50" fill="none" stroke="currentColor" stroke-width="4"/>
        <circle cx="200" cy="200" r="14" fill="currentColor"/>
        <text x="200" y="340" font-family="'Outfit', sans-serif" font-size="18" font-weight="600" text-anchor="middle" fill="currentColor" letter-spacing="10">ASTRONOMIA</text>
      </svg>
    `
  },
  {
    id: 'off-grid-courier',
    title: 'Off-Grid Heavy Freight',
    category: 'streetwear',
    aspectRatio: 1.3,
    svgContent: `
      <svg viewBox="0 0 520 400" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="50" width="440" height="300" rx="16" fill="none" stroke="currentColor" stroke-width="6"/>
        <line x1="40" y1="130" x2="480" y2="130" stroke="currentColor" stroke-width="4"/>
        <text x="70" y="105" font-family="'Outfit', sans-serif" font-size="32" font-weight="900" fill="currentColor" letter-spacing="4">OFF-GRID</text>
        <text x="450" y="105" font-family="'JetBrains Mono', monospace" font-size="22" font-weight="800" text-anchor="end" fill="currentColor">NO.84</text>
        <text x="70" y="190" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="700" fill="currentColor">ALL-TERRAIN SPEC</text>
        <text x="70" y="225" font-family="'JetBrains Mono', monospace" font-size="13" fill="currentColor" letter-spacing="2">HEAVY DUTY GEAR / EST. 2026</text>
        <!-- Barcode -->
        <g transform="translate(70, 260)">
          <rect x="0" y="0" width="6" height="50" fill="currentColor"/>
          <rect x="10" y="0" width="12" height="50" fill="currentColor"/>
          <rect x="28" y="0" width="4" height="50" fill="currentColor"/>
          <rect x="38" y="0" width="16" height="50" fill="currentColor"/>
          <rect x="62" y="0" width="8" height="50" fill="currentColor"/>
          <rect x="76" y="0" width="18" height="50" fill="currentColor"/>
          <rect x="102" y="0" width="6" height="50" fill="currentColor"/>
          <rect x="114" y="0" width="12" height="50" fill="currentColor"/>
          <rect x="134" y="0" width="4" height="50" fill="currentColor"/>
          <rect x="144" y="0" width="20" height="50" fill="currentColor"/>
          <rect x="172" y="0" width="8" height="50" fill="currentColor"/>
          <rect x="186" y="0" width="14" height="50" fill="currentColor"/>
          <text x="0" y="68" font-family="'JetBrains Mono', monospace" font-size="12" fill="currentColor" letter-spacing="4">4891-9920-OG</text>
        </g>
        <circle cx="410" cy="275" r="38" fill="none" stroke="currentColor" stroke-width="4"/>
        <text x="410" y="282" font-family="'Outfit', sans-serif" font-size="22" font-weight="800" text-anchor="middle" fill="currentColor">OG</text>
      </svg>
    `
  },
  {
    id: 'botanical-folia',
    title: 'Folia Flora Naturalist',
    category: 'minimal',
    aspectRatio: 1,
    svgContent: `
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <path d="M 200,60 C 200,160 130,220 120,320" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
        <path d="M 180,120 Q 240,110 270,140 Q 230,170 170,145" fill="none" stroke="currentColor" stroke-width="3"/>
        <path d="M 160,180 Q 80,180 70,220 Q 120,240 150,205" fill="none" stroke="currentColor" stroke-width="3"/>
        <path d="M 150,240 Q 230,230 250,280 Q 190,300 135,265" fill="none" stroke="currentColor" stroke-width="3"/>
        <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="6 6"/>
        <text x="200" y="360" font-family="'Outfit', sans-serif" font-size="16" font-weight="600" text-anchor="middle" fill="currentColor" letter-spacing="8">HERBARIUM 04</text>
      </svg>
    `
  },
  {
    id: 'acid-sun',
    title: 'Solar Meridian Pulse',
    category: 'typography',
    aspectRatio: 1,
    svgContent: `
      <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="80" fill="currentColor"/>
        <!-- Ray lines -->
        <g stroke="currentColor" stroke-width="5" stroke-linecap="round">
          <line x1="200" y1="80" x2="200" y2="40"/>
          <line x1="200" y1="320" x2="200" y2="360"/>
          <line x1="80" y1="200" x2="40" y2="200"/>
          <line x1="320" y1="200" x2="360" y2="200"/>
          <line x1="115" y1="115" x2="85" y2="85"/>
          <line x1="285" y1="285" x2="315" y2="315"/>
          <line x1="115" y1="285" x2="85" y2="315"/>
          <line x1="285" y1="115" x2="315" y2="85"/>
        </g>
        <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" stroke-width="3"/>
        <text x="200" y="208" font-family="'Outfit', sans-serif" font-size="24" font-weight="900" text-anchor="middle" fill="#09090b" letter-spacing="4">SOLAR</text>
        <text x="200" y="375" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" text-anchor="middle" fill="currentColor" letter-spacing="6">MERIDIAN PROTOCOL</text>
      </svg>
    `
  }
];
