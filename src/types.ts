export type ProductType = 'backpack' | 'cap' | 'sneaker' | 'tee';

export type BlendMode = 'multiply' | 'normal' | 'overlay' | 'screen';

export interface PrintZone {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  xPercent: number; // Center X in container (0-100)
  yPercent: number; // Center Y in container (0-100)
  widthPercent: number;
  heightPercent: number;
  clipPathId: string;
  curvature?: number; // Visual distortion hint
}

export interface Colorway {
  name: string;
  hex: string;
  accentHex?: string;
  trimHex?: string;
}

export interface ProductAngle {
  id: string;
  label: string;
}

export interface MaterialPreset {
  id: string;
  name: string;
  description: string;
  costModifier: number;
  textureOpacity: number;
}

export interface ProductSilhouette {
  id: ProductType;
  name: string;
  tagline: string;
  category: string;
  basePrice: number;
  printCostPerLayer: number;
  angles: ProductAngle[];
  defaultAngle: string;
  printZones: Record<string, PrintZone>; // key is angle id
  colorways: Colorway[];
  materials: MaterialPreset[];
  sizes?: string[];
  specs: {
    weight: string;
    fabric: string;
    origin: string;
    printMethod: string;
  };
}

export interface TextConfig {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  isBold: boolean;
  letterSpacing: number;
  isCurved: boolean;
  curveRadius: number;
}

export interface DesignLayer {
  id: string;
  name: string;
  type: 'image' | 'preset' | 'text';
  url: string; // Data URL or SVG string
  x: number; // Percentage offset from center of print zone (-50 to 50)
  y: number; // Percentage offset from center of print zone (-50 to 50)
  scale: number; // 0.2 to 2.5
  rotation: number; // -180 to 180 degrees
  opacity: number; // 0 to 100
  blendMode: BlendMode;
  aspectRatio: number;
  textConfig?: TextConfig;
}

export interface CartItem {
  id: string;
  productId: ProductType;
  productName: string;
  colorway: Colorway;
  material: MaterialPreset;
  size?: string;
  selectedAngle: string;
  unitPrice: number;
  quantity: number;
  layers: DesignLayer[];
  previewSnapshot: string;
  createdAt: number;
}

export interface GraphicPreset {
  id: string;
  title: string;
  category: 'streetwear' | 'minimal' | 'typography' | 'badge';
  svgContent: string;
  aspectRatio: number;
}

export type TrackingStatus = 'Pre-Flight' | 'Printing' | 'Quality Check' | 'Shipped' | 'Delivered';

export interface OrderStatusStep {
  status: TrackingStatus;
  timestamp: number;
  note: string;
}

export interface ProductionOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  recipient: {
    company: string;
    name: string;
    email: string;
    address: string;
  };
  trackingStatus: TrackingStatus;
  statusHistory: OrderStatusStep[];
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  createdAt: number;
}
