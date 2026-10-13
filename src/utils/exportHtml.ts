import { ProductSilhouette, Colorway, MaterialPreset, DesignLayer } from '../types';

interface ExportHtmlParams {
  product: ProductSilhouette;
  currentAngle: string;
  colorway: Colorway;
  material: MaterialPreset;
  layers: DesignLayer[];
  unitPrice: number;
  selectedSize?: string;
  svgMarkup?: string;
}

export function generateStandaloneHtml({
  product,
  currentAngle,
  colorway,
  material,
  layers,
  unitPrice,
  selectedSize,
  svgMarkup,
}: ExportHtmlParams): string {
  const printZone = product.printZones[currentAngle] || Object.values(product.printZones)[0];
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const sku = `ATL-${product.id.toUpperCase().slice(0, 3)}-${colorway.name.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Layers breakdown rows
  const layersHtml = layers
    .map(
      (l, idx) => `
      <tr>
        <td style="padding: 10px 14px; border-bottom: 1px solid #27272a; font-family: monospace; color: #a1a1aa;">0${idx + 1}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #27272a; font-weight: 600; color: #ffffff;">${l.name}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #27272a; font-family: monospace; color: #ea580c; text-transform: uppercase;">${l.type}</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #27272a; font-family: monospace; color: #d4d4d8;">X: ${l.x.toFixed(1)}% / Y: ${l.y.toFixed(1)}%</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #27272a; font-family: monospace; color: #d4d4d8;">${Math.round(l.scale * 100)}% (${l.rotation}°)</td>
        <td style="padding: 10px 14px; border-bottom: 1px solid #27272a; font-family: monospace; color: #a1a1aa; text-transform: uppercase;">${l.blendMode}</td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Production Tech Pack | ${product.name} - ${colorway.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #09090b;
      color: #f4f4f5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      padding: 32px 20px;
    }
    .container {
      max-width: 1080px;
      margin: 0 auto;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .header {
      padding: 32px;
      border-bottom: 1px solid #27272a;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background: #121215;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #ffffff;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #a1a1aa;
      margin-top: 4px;
    }
    .sku-badge {
      font-family: monospace;
      font-size: 13px;
      padding: 6px 14px;
      background: #27272a;
      border: 1px solid #3f3f46;
      border-radius: 8px;
      color: #fb923c;
    }
    .main-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      padding: 32px;
    }
    @media (min-width: 900px) {
      .main-grid {
        grid-template-columns: 1.1fr 1fr;
      }
    }
    .visual-stage {
      background: #09090b;
      border: 1px solid #27272a;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 480px;
      position: relative;
    }
    .visual-stage svg {
      width: 100%;
      max-width: 440px;
      height: auto;
      display: block;
    }
    .safe-zone-pill {
      margin-top: 16px;
      font-size: 12px;
      color: #a1a1aa;
      font-family: monospace;
      background: #18181b;
      padding: 4px 12px;
      border-radius: 999px;
      border: 1px solid #27272a;
    }
    .specs-panel {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .spec-card {
      background: #121215;
      border: 1px solid #27272a;
      border-radius: 12px;
      padding: 18px;
    }
    .spec-card-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #a1a1aa;
      margin-bottom: 12px;
      font-weight: 700;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 6px 0;
      border-bottom: 1px solid #1f1f23;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #71717a;
    }
    .info-val {
      font-weight: 600;
      color: #f4f4f5;
    }
    .color-swatch {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 4px;
      margin-right: 6px;
      vertical-align: middle;
      border: 1px solid #52525b;
    }
    .table-container {
      padding: 0 32px 32px 32px;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    th {
      padding: 12px 14px;
      background: #121215;
      color: #a1a1aa;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      border-bottom: 1px solid #27272a;
    }
    .signoff-section {
      background: #121215;
      border-top: 1px solid #27272a;
      padding: 24px 32px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      font-size: 12px;
      color: #71717a;
    }
    .actions {
      display: flex;
      gap: 12px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #ea580c;
      color: #ffffff;
      border: none;
    }
    .btn-primary:hover {
      background: #c2410c;
    }
    .btn-secondary {
      background: #27272a;
      color: #f4f4f5;
      border: 1px solid #3f3f46;
    }
    .btn-secondary:hover {
      background: #3f3f46;
    }
    @media print {
      body { background: #ffffff; color: #000000; padding: 0; }
      .container { border: none; box-shadow: none; background: #ffffff; }
      .header, .visual-stage, .spec-card, th, .signoff-section { background: #ffffff; color: #000000; border-color: #cccccc; }
      .info-val, .brand-title { color: #000000; }
      .actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <header class="header">
      <div>
        <h1 class="brand-title">Atelier Digital Tech Pack</h1>
        <p class="brand-subtitle">Commercial Production Specification & Print Proof Sheet · Issued ${dateStr}</p>
      </div>
      <div class="sku-badge">
        SKU: ${sku}
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-grid">
      <!-- Visual Garment Stage -->
      <div class="visual-stage">
        ${svgMarkup || `<div style="text-align:center; color:#71717a;">[Garment Vector Preview: ${product.name}]</div>`}
        <div class="safe-zone-pill">
          Print Zone: ${printZone.name} · ${printZone.widthMm} × ${printZone.heightMm} mm
        </div>
      </div>

      <!-- Specification Cards -->
      <div class="specs-panel">
        <div class="spec-card">
          <div class="spec-card-title">Garment Specifications</div>
          <div class="info-row">
            <span class="info-label">Silhouette</span>
            <span class="info-val">${product.name}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Colorway</span>
            <span class="info-val">
              <span class="color-swatch" style="background-color: ${colorway.hex};"></span>
              ${colorway.name} (${colorway.hex})
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">Fabric / Material</span>
            <span class="info-val">${material.name}</span>
          </div>
          ${
            selectedSize
              ? `
          <div class="info-row">
            <span class="info-label">Size Specification</span>
            <span class="info-val">${selectedSize}</span>
          </div>
          `
              : ''
          }
          <div class="info-row">
            <span class="info-label">Base Weight</span>
            <span class="info-val">${product.specs.weight}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Origin</span>
            <span class="info-val">${product.specs.origin}</span>
          </div>
        </div>

        <div class="spec-card">
          <div class="spec-card-title">Printing & Finishing Standards</div>
          <div class="info-row">
            <span class="info-label">Print Process</span>
            <span class="info-val">${product.specs.printMethod}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Resolution / Profile</span>
            <span class="info-val">1200 DPI · CMYK + Double White Channel</span>
          </div>
          <div class="info-row">
            <span class="info-label">Active Artwork Layers</span>
            <span class="info-val">${layers.length} Placements</span>
          </div>
          <div class="info-row">
            <span class="info-label">Estimated Unit Cost</span>
            <span class="info-val" style="color: #fb923c;">$${unitPrice.toFixed(2)} USD</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Artwork Layers Data Table -->
    <div class="table-container">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #a1a1aa; margin-bottom: 12px; font-weight: 700;">
        Artwork Layer Coordinates & Blend Modes
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Artwork Name</th>
            <th>Source Type</th>
            <th>Offset Coordinates</th>
            <th>Scale & Rotation</th>
            <th>Blend Finish</th>
          </tr>
        </thead>
        <tbody>
          ${layersHtml || `<tr><td colspan="6" style="padding:16px; text-align:center; color:#71717a;">No active artwork layers applied (Blank specimen)</td></tr>`}
        </tbody>
      </table>
    </div>

    <!-- Sign-Off Footer & Quick Actions -->
    <div class="signoff-section">
      <div>
        <span>Production Authorized: ____________________</span>
        <span style="margin-left: 24px;">Date: ____________________</span>
      </div>
      <div class="actions">
        <button onclick="window.print()" class="btn btn-primary">
          Print / Save PDF Tech Pack
        </button>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadHtmlFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
