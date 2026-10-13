import React from 'react';
import { Colorway, ProductType } from '../../../types';

interface SilhouetteProps {
  productType: ProductType;
  angleId: string;
  colorway: Colorway;
  textureOpacity: number;
}

export const SilhouetteBase: React.FC<SilhouetteProps> = ({
  productType,
  angleId,
  colorway,
  textureOpacity,
}) => {
  const baseColor = colorway.hex;
  const accentColor = colorway.accentHex || colorway.hex;
  const trimColor = colorway.trimHex || '#18181b';

  // Common SVG filters and fabric patterns
  const renderDefs = () => (
    <defs>
      {/* Fabric Weave Texture Filter */}
      <filter id="fabric-weave" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" in="noise" result="desat" />
        <feComponentTransfer in="desat" result="contrast">
          <feFuncR type="linear" slope="1.5" intercept="-0.2" />
          <feFuncG type="linear" slope="1.5" intercept="-0.2" />
          <feFuncB type="linear" slope="1.5" intercept="-0.2" />
        </feComponentTransfer>
        <feBlend in="SourceGraphic" in2="contrast" mode="multiply" />
      </filter>

      {/* Backpack Clip Paths */}
      <clipPath id="backpack-front-clip">
        <path d="M 280,300 C 280,290 290,280 300,280 L 500,280 C 510,280 520,290 520,300 L 515,640 C 515,655 500,665 485,665 L 315,665 C 300,665 285,655 285,640 Z" />
      </clipPath>
      <clipPath id="backpack-profile-clip">
        <path d="M 260,300 C 270,290 320,285 360,290 L 460,320 C 470,325 475,340 470,360 L 440,640 C 435,655 420,665 400,665 L 290,650 C 275,645 265,630 260,610 Z" />
      </clipPath>

      {/* Cap Clip Paths */}
      <clipPath id="cap-front-clip">
        <path d="M 280,260 C 310,210 390,190 500,190 C 610,190 690,210 720,260 C 720,330 680,380 500,385 C 320,380 280,330 280,260 Z" />
      </clipPath>
      <clipPath id="cap-side-clip">
        <path d="M 260,260 C 300,200 440,180 560,200 C 660,220 700,270 690,340 C 620,380 480,390 360,380 C 290,360 260,320 260,260 Z" />
      </clipPath>

      {/* Sneaker Clip Paths */}
      <clipPath id="sneaker-profile-clip">
        <path d="M 260,360 C 280,330 360,320 480,330 C 560,335 620,360 640,410 C 620,490 540,510 440,510 C 340,510 270,480 260,430 Z" />
      </clipPath>
      <clipPath id="sneaker-toebox-clip">
        <path d="M 330,300 C 370,220 430,220 470,300 C 500,360 490,480 470,540 C 430,570 370,570 330,540 C 310,480 300,360 330,300 Z" />
      </clipPath>

      {/* Tee Clip Paths */}
      <clipPath id="tee-front-clip">
        <path d="M 280,250 C 320,245 480,245 520,250 C 560,255 580,290 575,660 C 570,700 550,710 500,710 L 300,710 C 250,710 230,700 225,660 C 220,290 240,255 280,250 Z" />
      </clipPath>
      <clipPath id="tee-back-clip">
        <path d="M 270,230 C 330,220 470,220 530,230 C 570,240 590,280 585,670 C 580,710 550,720 500,720 L 300,720 C 250,720 220,710 215,670 C 210,280 230,240 270,230 Z" />
      </clipPath>

      {/* Linear Gradients for 3D Volume */}
      <linearGradient id="body-light" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
      </linearGradient>

      <linearGradient id="drop-shadow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </linearGradient>

      <radialGradient id="vignette-grad" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stopColor="#000000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
      </radialGradient>
    </defs>
  );

  // 1. BACKPACK SILHOUETTES
  const renderBackpack = () => {
    if (angleId === 'profile') {
      return (
        <g id="backpack-profile">
          {/* Ground Shadow */}
          <ellipse cx="380" cy="740" rx="220" ry="28" fill="#000000" opacity="0.35" filter="blur(16px)" />
          
          {/* Main Back Cushion & Harness */}
          <path d="M 220,320 C 210,400 210,600 230,680 L 260,690 L 270,310 Z" fill={trimColor} />
          <path d="M 230,340 C 200,420 190,560 215,650" stroke="#09090b" strokeWidth={18} strokeLinecap="round" fill="none" />
          
          {/* Main Body Side Profile */}
          <path d="M 260,260 C 270,220 340,220 400,240 L 480,280 C 510,310 520,380 500,620 C 490,690 460,710 390,710 L 280,690 C 250,680 240,640 245,600 L 260,260 Z" fill={baseColor} />
          
          {/* Shading Overlay */}
          <path d="M 260,260 C 270,220 340,220 400,240 L 480,280 C 510,310 520,380 500,620 C 490,690 460,710 390,710 L 280,690 C 250,680 240,640 245,600 L 260,260 Z" fill="url(#body-light)" />
          
          {/* Roll Top Collar */}
          <path d="M 260,250 C 280,220 380,210 470,250 L 450,300 C 370,270 290,270 270,300 Z" fill={accentColor} />
          <rect x="350" y="270" width="40" height="20" rx="4" fill={trimColor} />

          {/* Lateral Wing Compression Straps */}
          <path d="M 245,400 L 490,440" stroke={trimColor} strokeWidth={12} strokeLinecap="square" />
          <path d="M 245,540 L 480,560" stroke={trimColor} strokeWidth={12} strokeLinecap="square" />
          {/* Buckles */}
          <rect x="340" y="394" width="24" height="16" rx="3" fill="#27272a" stroke="#52525b" strokeWidth={2} />
          <rect x="340" y="534" width="24" height="16" rx="3" fill="#27272a" stroke="#52525b" strokeWidth={2} />

          {/* Water bottle stretch pouch */}
          <path d="M 400,500 C 460,490 510,510 505,650 C 470,680 430,670 390,660 Z" fill={trimColor} opacity={0.8} />
        </g>
      );
    }

    // Default: Front Angle
    return (
      <g id="backpack-front">
        {/* Ground Ambient Shadow */}
        <ellipse cx="400" cy="745" rx="240" ry="32" fill="#000000" opacity="0.38" filter="blur(18px)" />

        {/* Shoulder Straps Behind */}
        <path d="M 280,180 C 210,210 180,340 185,550 C 188,610 210,660 250,680" stroke={trimColor} strokeWidth={26} strokeLinecap="round" fill="none" />
        <path d="M 520,180 C 590,210 620,340 615,550 C 612,610 590,660 550,680" stroke={trimColor} strokeWidth={26} strokeLinecap="round" fill="none" />

        {/* Top Carry Webbing Handle */}
        <path d="M 350,150 C 350,105 450,105 450,150" stroke={trimColor} strokeWidth={20} strokeLinecap="round" fill="none" />

        {/* Main Backpack Body Shell */}
        <path d="M 240,240 C 250,210 290,195 350,195 L 450,195 C 510,195 550,210 560,240 L 575,640 C 580,685 540,715 480,715 L 320,715 C 260,715 220,685 225,640 Z" fill={baseColor} />

        {/* Shading Overlay */}
        <path d="M 240,240 C 250,210 290,195 350,195 L 450,195 C 510,195 550,210 560,240 L 575,640 C 580,685 540,715 480,715 L 320,715 C 260,715 220,685 225,640 Z" fill="url(#body-light)" />

        {/* Roll-Top Folded Collar */}
        <path d="M 245,180 L 555,180 C 565,180 570,195 565,220 L 555,265 C 550,285 530,295 490,295 L 310,295 C 270,295 250,285 245,265 L 235,220 C 230,195 235,180 245,180 Z" fill={accentColor} />
        <path d="M 240,295 L 560,295" stroke="#000000" strokeWidth={4} opacity={0.3} />

        {/* Center Vertical Webbing Strap & Heavy Aluminum G-Hook */}
        <rect x="388" y="180" width="24" height="200" fill={trimColor} />
        {/* Metal G-Hook Clasp */}
        <path d="M 382,280 L 418,280 C 424,280 428,286 428,294 L 428,310 C 428,318 420,324 412,324 L 388,324 C 380,324 374,316 376,306 L 382,280 Z" fill="#3f3f46" stroke="#71717a" strokeWidth={2} />
        <rect x="390" y="294" width="20" height="8" rx="2" fill="#18181b" />

        {/* Front Cargo Pocket Stitch Flap */}
        <path d="M 270,410 C 270,390 290,380 320,380 L 480,380 C 510,380 530,390 530,410 L 525,660 C 525,675 510,685 480,685 L 320,685 C 290,685 275,675 275,660 Z" fill={baseColor} stroke={trimColor} strokeWidth={2} strokeOpacity={0.35} />

        {/* Front Aquaguard Matte Zipper */}
        <line x1="300" y1="415" x2="500" y2="415" stroke="#09090b" strokeWidth={5} strokeLinecap="round" />
        <line x1="300" y1="415" x2="500" y2="415" stroke="#3f3f46" strokeWidth={1.5} strokeDasharray="3 3" />
        {/* Zipper Pull Tag with Cord */}
        <rect x="340" y="415" width="8" height="24" rx="2" fill="#f97316" />

        {/* Reinforced Leather Base Corner Gussets */}
        <path d="M 230,640 L 290,715 L 235,715 Z" fill={trimColor} opacity={0.9} />
        <path d="M 570,640 L 510,715 L 565,715 Z" fill={trimColor} opacity={0.9} />
      </g>
    );
  };

  // 2. CAP SILHOUETTES
  const renderCap = () => {
    if (angleId === 'side') {
      return (
        <g id="cap-side">
          {/* Ground Ambient Shadow */}
          <ellipse cx="480" cy="580" rx="280" ry="24" fill="#000000" opacity={0.36} filter="blur(16px)" />

          {/* Pre-Curved Visor Brim (Side Profile) */}
          <path d="M 480,440 C 620,445 740,430 790,400 C 785,420 680,465 520,465 L 470,450 Z" fill={trimColor} />
          {/* Visor Underside Shadow */}
          <path d="M 520,465 C 640,465 740,440 780,415 C 750,440 650,475 510,475 Z" fill="#000000" opacity={0.45} />

          {/* Main Crown Shell */}
          <path d="M 230,420 C 220,310 320,180 500,180 C 620,180 700,280 690,440 C 630,460 520,465 440,450 C 340,450 250,440 230,420 Z" fill={baseColor} />
          <path d="M 230,420 C 220,310 320,180 500,180 C 620,180 700,280 690,440 C 630,460 520,465 440,450 C 340,450 250,440 230,420 Z" fill="url(#body-light)" />

          {/* Crown Seam Panel Lines */}
          <path d="M 500,180 C 490,280 470,360 450,445" stroke="#000000" strokeWidth={2.5} strokeDasharray="4 3" opacity={0.3} fill="none" />
          <path d="M 500,180 C 580,260 620,350 640,435" stroke="#000000" strokeWidth={2.5} strokeDasharray="4 3" opacity={0.3} fill="none" />

          {/* Top Squatchee Button */}
          <ellipse cx="500" cy="180" rx="14" ry="10" fill={trimColor} />

          {/* Embroidered Breathable Eyelet */}
          <circle cx="420" cy="280" r="7" fill={trimColor} stroke="#ffffff" strokeWidth={1.5} strokeOpacity={0.3} />

          {/* Rear Arch Opening & Brass Buckle Strap */}
          <path d="M 230,415 C 245,385 270,375 295,385 C 295,420 250,435 230,415 Z" fill="#09090b" opacity={0.75} />
          <path d="M 235,420 L 285,420" stroke="#71717a" strokeWidth={6} strokeLinecap="round" />
        </g>
      );
    }

    // Default: Front Angle
    return (
      <g id="cap-front">
        {/* Ground Ambient Shadow */}
        <ellipse cx="500" cy="620" rx="290" ry="28" fill="#000000" opacity={0.36} filter="blur(18px)" />

        {/* Visor Brim Base (Curved Arc Arch) */}
        <path d="M 200,430 C 280,390 720,390 800,430 C 740,510 260,510 200,430 Z" fill={accentColor} />
        {/* Visor Stitching Rows */}
        <path d="M 240,442 C 340,420 660,420 760,442" stroke="#000000" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.35} fill="none" />
        <path d="M 255,460 C 350,438 650,438 745,460" stroke="#000000" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.35} fill="none" />
        <path d="M 275,478 C 360,456 640,456 725,478" stroke="#000000" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.35} fill="none" />

        {/* Visor Bottom Edge Rim Shadow */}
        <path d="M 200,430 C 260,510 740,510 800,430 C 760,490 240,490 200,430 Z" fill="#000000" opacity={0.45} />

        {/* Structured Front 6-Panel Crown Arch */}
        <path d="M 240,420 C 230,280 340,160 500,160 C 660,160 770,280 760,420 C 700,390 300,390 240,420 Z" fill={baseColor} />
        <path d="M 240,420 C 230,280 340,160 500,160 C 660,160 770,280 760,420 C 700,390 300,390 240,420 Z" fill="url(#body-light)" />

        {/* Center Vertical Seam Line */}
        <line x1="500" y1="160" x2="500" y2="395" stroke="#000000" strokeWidth={3} strokeDasharray="4 2" opacity={0.35} />

        {/* Angled Dart Seams */}
        <path d="M 500,160 C 410,220 330,320 280,410" stroke="#000000" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.25} fill="none" />
        <path d="M 500,160 C 590,220 670,320 720,410" stroke="#000000" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.25} fill="none" />

        {/* Embroidered Eyelets */}
        <circle cx="390" cy="270" r="7" fill={trimColor} stroke="#ffffff" strokeWidth={1.5} strokeOpacity={0.3} />
        <circle cx="610" cy="270" r="7" fill={trimColor} stroke="#ffffff" strokeWidth={1.5} strokeOpacity={0.3} />

        {/* Top Center Squatchee Button */}
        <ellipse cx="500" cy="160" rx="16" ry="12" fill={trimColor} />
      </g>
    );
  };

  // 3. SNEAKER SILHOUETTES
  const renderSneaker = () => {
    if (angleId === 'toebox') {
      return (
        <g id="sneaker-toebox">
          {/* Ground Ambient Shadow */}
          <ellipse cx="400" cy="460" rx="160" ry="260" fill="#000000" opacity={0.32} filter="blur(22px)" />

          {/* Rubber Foxing Outsole Edge */}
          <path d="M 290,240 C 350,130 450,130 510,240 C 560,340 550,580 500,680 C 440,730 360,730 300,680 C 250,580 240,340 290,240 Z" fill="#d4cebe" stroke="#a39d8d" strokeWidth={4} />

          {/* Suede Toe Bumper Mudguard */}
          <path d="M 305,250 C 355,150 445,150 495,250 C 495,310 305,310 305,250 Z" fill={accentColor} />
          <path d="M 310,250 C 360,165 440,165 490,250" stroke="#000000" strokeWidth={2} strokeDasharray="4 2" opacity={0.35} fill="none" />

          {/* Main Leather Vamp */}
          <path d="M 310,290 C 360,250 440,250 490,290 L 480,520 C 440,550 360,550 320,520 Z" fill={baseColor} />
          <path d="M 310,290 C 360,250 440,250 490,290 L 480,520 C 440,550 360,550 320,520 Z" fill="url(#body-light)" />

          {/* Perforated Breathability Holes */}
          <g fill="#000000" opacity={0.35}>
            <circle cx="400" cy="270" r="3" />
            <circle cx="380" cy="285" r="3" /><circle cx="420" cy="285" r="3" />
            <circle cx="365" cy="305" r="3" /><circle cx="400" cy="305" r="3" /><circle cx="435" cy="305" r="3" />
          </g>

          {/* Eyestay & Flat Woven Laces */}
          <path d="M 350,380 L 450,380 M 345,420 L 455,420 M 345,460 L 455,460 M 350,500 L 450,500" stroke="#edece8" strokeWidth={12} strokeLinecap="round" />
          <path d="M 350,380 L 450,380 M 345,420 L 455,420 M 345,460 L 455,460 M 350,500 L 450,500" stroke="#000000" strokeWidth={2} opacity={0.25} strokeLinecap="round" />

          {/* Padded Collar Interior */}
          <ellipse cx="400" cy="620" rx="65" ry="45" fill="#18181b" />
          <ellipse cx="400" cy="630" rx="45" ry="30" fill="#27272a" />
        </g>
      );
    }

    // Default: Lateral Profile Angle
    return (
      <g id="sneaker-profile">
        {/* Ground Ambient Shadow */}
        <ellipse cx="460" cy="610" rx="340" ry="24" fill="#000000" opacity={0.38} filter="blur(16px)" />

        {/* Vintage Gum / Rubber Tread Outsole */}
        <path d="M 170,550 L 760,550 C 770,550 780,560 775,575 L 755,595 C 750,600 740,605 730,605 L 190,605 C 180,605 170,598 165,585 Z" fill="#b08d57" />
        {/* Outsole Grip Ridges */}
        <path d="M 210,605 L 210,590 M 260,605 L 260,590 M 310,605 L 310,590 M 360,605 L 360,590 M 410,605 L 410,590 M 460,605 L 460,590 M 510,605 L 510,590 M 560,605 L 560,590 M 610,605 L 610,590 M 660,605 L 660,590 M 710,605 L 710,590" stroke="#876532" strokeWidth={4} />

        {/* Molded Textured Midsole / Cupsole with Stitch Line */}
        <path d="M 160,520 C 180,510 240,510 320,515 L 740,515 C 765,515 780,530 770,555 L 165,555 C 155,540 155,525 160,520 Z" fill="#f4f1e8" stroke="#dcd6c5" strokeWidth={3} />
        <line x1="175" y1="535" x2="760" y2="535" stroke="#99917d" strokeWidth={2} strokeDasharray="5 3" />

        {/* Main Leather Upper Base */}
        <path d="M 180,515 C 190,470 240,430 300,430 L 390,430 L 490,320 C 510,300 550,300 580,330 L 680,410 C 720,440 760,470 750,515 Z" fill={baseColor} />
        <path d="M 180,515 C 190,470 240,430 300,430 L 390,430 L 490,320 C 510,300 550,300 580,330 L 680,410 C 720,440 760,470 750,515 Z" fill="url(#body-light)" />

        {/* Front Toe Suede Mudguard Wrap */}
        <path d="M 170,515 C 165,470 200,425 260,425 L 300,515 Z" fill={accentColor} />
        <path d="M 175,510 C 170,475 200,435 255,435" stroke="#000000" strokeWidth={2} strokeDasharray="4 2" opacity={0.3} fill="none" />

        {/* Lateral Quarter Panel & Arch */}
        <path d="M 280,515 L 350,420 L 520,420 L 600,515 Z" fill={baseColor} stroke={trimColor} strokeWidth={1.5} strokeOpacity={0.3} />

        {/* Retro Curved Racing Stripe / Chevron Accent */}
        <path d="M 330,440 C 400,450 490,440 580,410 C 540,460 460,495 380,500 Z" fill={trimColor} />

        {/* Padded Heel Collar & Achilles Notch */}
        <path d="M 640,410 C 660,370 710,360 740,390 C 760,420 760,470 750,515 L 680,515 Z" fill={accentColor} />
        <path d="M 620,380 C 650,340 700,340 730,370" stroke={trimColor} strokeWidth={14} strokeLinecap="round" fill="none" />

        {/* Eyestay Eylets & White Flat Laces */}
        <path d="M 340,410 L 490,320" stroke={accentColor} strokeWidth={18} strokeLinecap="round" />
        <g stroke="#ffffff" strokeWidth={8} strokeLinecap="round">
          <line x1="360" y1="400" x2="385" y2="400" />
          <line x1="395" y1="375" x2="420" y2="375" />
          <line x1="430" y1="350" x2="455" y2="350" />
          <line x1="465" y1="325" x2="490" y2="325" />
        </g>
        {/* Lace Shadow */}
        <g stroke="#000000" strokeWidth={1.5} opacity={0.25} strokeLinecap="round">
          <line x1="360" y1="404" x2="385" y2="404" />
          <line x1="395" y1="379" x2="420" y2="379" />
          <line x1="430" y1="354" x2="455" y2="354" />
        </g>
      </g>
    );
  };

  // 4. STREETWEAR TEE SILHOUETTES
  const renderTee = () => {
    const isBack = angleId === 'back';

    return (
      <g id={`tee-${angleId}`}>
        {/* Soft Ambient Ground Floor Shadow */}
        <ellipse cx="400" cy="740" rx="320" ry="26" fill="#000000" opacity={0.32} filter="blur(20px)" />

        {/* Main Boxy T-Shirt Body Shell */}
        <path
          d="
            M 310,135
            C 340,165 460,165 490,135
            L 640,185
            L 730,310
            L 660,370
            L 590,290
            L 595,700
            C 595,715 580,725 560,725
            L 240,725
            C 220,725 205,715 205,700
            L 210,290
            L 140,370
            L 70,310
            L 160,185
            Z
          "
          fill={baseColor}
        />

        {/* Shading, Creases, and Volume Overlay */}
        <path
          d="
            M 310,135
            C 340,165 460,165 490,135
            L 640,185
            L 730,310
            L 660,370
            L 590,290
            L 595,700
            C 595,715 580,725 560,725
            L 240,725
            C 220,725 205,715 205,700
            L 210,290
            L 140,370
            L 70,310
            L 160,185
            Z
          "
          fill="url(#body-light)"
        />

        {/* Sleeve Underarm Crease Shadow Lines */}
        <path d="M 210,290 C 230,340 240,420 220,480" stroke="#000000" strokeWidth={4} opacity={0.18} fill="none" strokeLinecap="round" />
        <path d="M 590,290 C 570,340 560,420 580,480" stroke="#000000" strokeWidth={4} opacity={0.18} fill="none" strokeLinecap="round" />

        {/* Natural Fabric Drape Creases */}
        <path d="M 230,680 C 270,660 310,670 330,690" stroke="#000000" strokeWidth={3} opacity={0.12} fill="none" />
        <path d="M 470,690 C 500,665 540,665 570,685" stroke="#000000" strokeWidth={3} opacity={0.12} fill="none" />
        <path d="M 380,240 C 370,320 360,400 375,480" stroke="#ffffff" strokeWidth={6} opacity={0.08} fill="none" />

        {/* Thick 1.25" Ribbed Collar */}
        {isBack ? (
          // Back View High Rib Collar
          <path
            d="M 310,135 C 360,148 440,148 490,135 C 485,120 440,110 400,110 C 360,110 315,120 310,135 Z"
            fill={accentColor}
            stroke="#000000"
            strokeWidth={1.5}
            strokeOpacity={0.35}
          />
        ) : (
          // Front View Crewneck Collar with Inner Neck Shadow
          <g>
            <path d="M 310,135 C 330,195 470,195 490,135 C 470,165 330,165 310,135 Z" fill="#000000" opacity={0.35} />
            <path
              d="M 310,135 C 330,185 470,185 490,135 C 480,160 320,160 310,135 Z"
              fill={accentColor}
              stroke="#000000"
              strokeWidth={2}
              strokeOpacity={0.25}
            />
            {/* Fine Ribbing Hatch Lines */}
            <path d="M 340,158 L 340,172 M 370,164 L 370,178 M 400,166 L 400,180 M 430,164 L 430,178 M 460,158 L 460,172" stroke="#000000" strokeWidth={1.5} opacity={0.2} />
          </g>
        )}

        {/* Twin-Needle Hem Stitches */}
        <line x1="220" y1="710" x2="580" y2="710" stroke="#000000" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.25} />
        <line x1="220" y1="714" x2="580" y2="714" stroke="#000000" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.25} />

        {/* Sleeve Hems */}
        <line x1="85" y1="320" x2="150" y2="375" stroke="#000000" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.25} />
        <line x1="715" y1="320" x2="650" y2="375" stroke="#000000" strokeWidth={1.5} strokeDasharray="4 2" opacity={0.25} />
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 800 800"
      className="w-full h-full select-none pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderDefs()}

      {/* Render matching silhouette */}
      {productType === 'backpack' && renderBackpack()}
      {productType === 'cap' && renderCap()}
      {productType === 'sneaker' && renderSneaker()}
      {productType === 'tee' && renderTee()}

      {/* Fabric Texture Layer */}
      <rect
        x="0"
        y="0"
        width="800"
        height="800"
        fill="#000000"
        opacity={textureOpacity}
        filter="url(#fabric-weave)"
        style={{ mixBlendMode: 'overlay' }}
      />
    </svg>
  );
};
