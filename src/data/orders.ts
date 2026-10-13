import { ProductionOrder } from '../types';
import { PRODUCTS } from './products';
import { GRAPHIC_PRESETS } from './presets';

export const INITIAL_ORDERS: ProductionOrder[] = [
  {
    id: 'ord-89412',
    orderNumber: 'ATL-89412',
    createdAt: Date.now() - 1000 * 60 * 35, // 35 minutes ago
    trackingStatus: 'Printing',
    carrier: 'DHL Express On-Demand',
    trackingNumber: 'DHL-9842-7710-ATL',
    estimatedDelivery: 'Oct 16, 2026',
    recipient: {
      company: 'Kanto Streetwear Studio',
      name: 'Kenji Sato',
      email: 'kenji@kantostudio.jp',
      address: '2-14-8 Shibuya, Tokyo',
    },
    subtotal: 104,
    shipping: 0,
    total: 104,
    statusHistory: [
      {
        status: 'Pre-Flight',
        timestamp: Date.now() - 1000 * 60 * 35,
        note: 'Vector artwork ripped at 1200 DPI. Underbase white channel registered.',
      },
      {
        status: 'Printing',
        timestamp: Date.now() - 1000 * 60 * 12,
        note: 'High-density DTF press in progress on 280 GSM heavyweight cotton.',
      },
    ],
    items: [
      {
        id: 'ord-item-1',
        productId: 'tee',
        productName: 'Heavyweight Boxy Crewneck Tee',
        colorway: PRODUCTS[3].colorways[1], // Vintage Bone Chalk
        material: PRODUCTS[3].materials[0],
        size: 'Large (Relaxed)',
        selectedAngle: 'front',
        unitPrice: 52,
        quantity: 2,
        previewSnapshot: '',
        createdAt: Date.now() - 1000 * 60 * 35,
        layers: [
          {
            id: 'l-seed-1',
            name: 'Tokyo Cypher // 09',
            type: 'preset',
            url: GRAPHIC_PRESETS[0].svgContent,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 100,
            blendMode: 'multiply',
            aspectRatio: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'ord-84192',
    orderNumber: 'ATL-84192',
    createdAt: Date.now() - 1000 * 60 * 140, // 2.3 hours ago
    trackingStatus: 'Quality Check',
    carrier: 'FedEx International Priority',
    trackingNumber: 'FDX-4410-8821-ATL',
    estimatedDelivery: 'Oct 15, 2026',
    recipient: {
      company: 'District Design Lab',
      name: 'Elena Rostova',
      email: 'elena@districtlab.co',
      address: '772 Spadina Ave, Toronto, ON',
    },
    subtotal: 253,
    shipping: 0,
    total: 253,
    statusHistory: [
      {
        status: 'Pre-Flight',
        timestamp: Date.now() - 1000 * 60 * 140,
        note: 'Print scale verified against Cordura safe panel boundaries.',
      },
      {
        status: 'Printing',
        timestamp: Date.now() - 1000 * 60 * 85,
        note: 'Thermal transfer complete with flex-polymer seal.',
      },
      {
        status: 'Quality Check',
        timestamp: Date.now() - 1000 * 60 * 25,
        note: 'Tensile stitch test and color-fastness spectrophotometer verification passed.',
      },
    ],
    items: [
      {
        id: 'ord-item-2',
        productId: 'backpack',
        productName: 'Tactical Roll-Top Backpack 40L',
        colorway: PRODUCTS[0].colorways[0], // Onyx Black
        material: PRODUCTS[0].materials[0], // Cordura
        selectedAngle: 'front',
        unitPrice: 126.5,
        quantity: 2,
        previewSnapshot: '',
        createdAt: Date.now() - 1000 * 60 * 140,
        layers: [
          {
            id: 'l-seed-2',
            name: 'Off-Grid Heavy Freight',
            type: 'preset',
            url: GRAPHIC_PRESETS[3].svgContent,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 100,
            blendMode: 'multiply',
            aspectRatio: 1.3,
          },
        ],
      },
    ],
  },
  {
    id: 'ord-77310',
    orderNumber: 'ATL-77310',
    createdAt: Date.now() - 1000 * 60 * 60 * 18, // 18 hours ago
    trackingStatus: 'Shipped',
    carrier: 'UPS Worldwide Express',
    trackingNumber: '1Z992A880491024810',
    estimatedDelivery: 'Tomorrow by 10:30 AM',
    recipient: {
      company: 'Vortex Atelier Studio',
      name: 'Marcus Vance',
      email: 'marcus@vortexatelier.com',
      address: '500 Mercer St, Seattle, WA',
    },
    subtotal: 172,
    shipping: 0,
    total: 172,
    statusHistory: [
      {
        status: 'Pre-Flight',
        timestamp: Date.now() - 1000 * 60 * 60 * 18,
        note: 'Crown curvature profile mapped.',
      },
      {
        status: 'Printing',
        timestamp: Date.now() - 1000 * 60 * 60 * 14,
        note: 'High-density micro-print applied.',
      },
      {
        status: 'Quality Check',
        timestamp: Date.now() - 1000 * 60 * 60 * 10,
        note: 'Passed 10-point garment inspection. Steam-pressed and barcoded.',
      },
      {
        status: 'Shipped',
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
        note: 'Handed over to carrier at Lisbon Logistics Hub. Out for transit.',
      },
    ],
    items: [
      {
        id: 'ord-item-3',
        productId: 'cap',
        productName: 'Structured 6-Panel Twill Cap',
        colorway: PRODUCTS[1].colorways[2], // Forest Evergreen
        material: PRODUCTS[1].materials[0],
        size: 'One Size (Adjustable Strap: 54 - 62 cm)',
        selectedAngle: 'front',
        unitPrice: 43,
        quantity: 4,
        previewSnapshot: '',
        createdAt: Date.now() - 1000 * 60 * 60 * 18,
        layers: [
          {
            id: 'l-seed-3',
            name: 'Vortex Grand Prix',
            type: 'preset',
            url: GRAPHIC_PRESETS[1].svgContent,
            x: 0,
            y: 0,
            scale: 0.9,
            rotation: 0,
            opacity: 100,
            blendMode: 'multiply',
            aspectRatio: 1.25,
          },
        ],
      },
    ],
  },
];
