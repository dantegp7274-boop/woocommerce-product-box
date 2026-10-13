import React, { useState, useEffect } from 'react';
import { ProductType, ProductSilhouette, Colorway, MaterialPreset, DesignLayer, CartItem, ProductionOrder, TrackingStatus } from './types';
import { PRODUCTS } from './data/products';
import { GRAPHIC_PRESETS } from './data/presets';
import { INITIAL_ORDERS } from './data/orders';
import { TopBar } from './components/layout/TopBar';
import { MockupRenderer } from './components/mockups/MockupRenderer';
import { DesignToolbar } from './components/controls/DesignToolbar';
import { ProductConfigurator } from './components/controls/ProductConfigurator';
import { CartDrawer } from './components/cart/CartDrawer';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentProductId, setCurrentProductId] = useState<ProductType>('backpack');
  const currentProduct = PRODUCTS.find((p) => p.id === currentProductId) || PRODUCTS[0];

  const [currentAngle, setCurrentAngle] = useState<string>(currentProduct.defaultAngle);
  const [currentColorway, setCurrentColorway] = useState<Colorway>(currentProduct.colorways[0]);
  const [currentMaterial, setCurrentMaterial] = useState<MaterialPreset>(currentProduct.materials[0]);
  const [selectedSize, setSelectedSize] = useState<string>(currentProduct.sizes?.[0] || '');

  // Active Design Layers
  const [layers, setLayers] = useState<DesignLayer[]>([
    {
      id: 'default-layer-1',
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
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('default-layer-1');
  const [showSafeZone, setShowSafeZone] = useState(true);

  // Cart Drawer State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Order History State
  const [orders, setOrders] = useState<ProductionOrder[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_cart_items', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Save Orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Handle switching product silhouette
  const handleSelectProduct = (productId: ProductType) => {
    const nextProduct = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
    setCurrentProductId(productId);
    setCurrentAngle(nextProduct.defaultAngle);
    setCurrentColorway(nextProduct.colorways[0]);
    setCurrentMaterial(nextProduct.materials[0]);
    if (nextProduct.sizes && nextProduct.sizes.length > 0) {
      setSelectedSize(nextProduct.sizes[0]);
    } else {
      setSelectedSize('');
    }
  };

  // Add Layer
  const handleAddLayer = (layerData: Omit<DesignLayer, 'id'>) => {
    const newId = `layer-${Date.now()}`;
    const newLayer: DesignLayer = {
      ...layerData,
      id: newId,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
  };

  // Update Layer
  const handleUpdateLayer = (id: string, updates: Partial<DesignLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
    );
  };

  // Remove Layer
  const handleRemoveLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  // Duplicate Layer
  const handleDuplicateLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    const duplicated: DesignLayer = {
      ...layer,
      id: `layer-${Date.now()}`,
      name: `${layer.name} (Copy)`,
      x: Math.min(30, layer.x + 5),
      y: Math.min(30, layer.y + 5),
    };
    setLayers((prev) => [...prev, duplicated]);
    setSelectedLayerId(duplicated.id);
  };

  // Add to Cart
  const handleAddToCart = (quantity: number) => {
    const volumeDiscount = quantity >= 100 ? 0.35 : quantity >= 50 ? 0.25 : quantity >= 25 ? 0.15 : quantity >= 5 ? 0.05 : 0;
    const baseCost = currentProduct.basePrice;
    const printCost = layers.length * currentProduct.printCostPerLayer;
    const materialCost = currentMaterial.costModifier;
    const unitPrice = Number(((baseCost + printCost + materialCost) * (1 - volumeDiscount)).toFixed(2));

    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      productId: currentProduct.id,
      productName: currentProduct.name,
      colorway: currentColorway,
      material: currentMaterial,
      size: selectedSize || undefined,
      selectedAngle: currentAngle,
      unitPrice,
      quantity,
      layers: [...layers],
      previewSnapshot: '',
      createdAt: Date.now(),
    };

    setCartItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Create Order from Checkout
  const handleCreateOrder = (newOrder: ProductionOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Advance Order Status Simulator (Printing -> Quality Check -> Shipped -> Delivered)
  const handleAdvanceOrderStatus = (orderId: string) => {
    const statusCycle: Record<TrackingStatus, { next: TrackingStatus; note: string }> = {
      'Pre-Flight': {
        next: 'Printing',
        note: 'High-density DTF thermal press in progress in main atelier bay.',
      },
      'Printing': {
        next: 'Quality Check',
        note: 'Passed spectrophotometer color check. Curing and tensile seam inspection active.',
      },
      'Quality Check': {
        next: 'Shipped',
        note: 'Packaged in recyclable archive box. Handed off to carrier and tracking active.',
      },
      'Shipped': {
        next: 'Delivered',
        note: 'Delivered and signed for at destination studio reception.',
      },
      'Delivered': {
        next: 'Printing',
        note: 'Reprint job initialized for testing run.',
      },
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const currentTransition = statusCycle[ord.trackingStatus] || statusCycle['Printing'];
        return {
          ...ord,
          trackingStatus: currentTransition.next,
          statusHistory: [
            ...ord.statusHistory,
            {
              status: currentTransition.next,
              timestamp: Date.now(),
              note: currentTransition.note,
            },
          ],
        };
      })
    );
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* 1. Header (Compliant with Top Bar Contract) */}
      <TopBar
        cartItemCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Main Studio Workstation Split View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left Column: Live Mockup Viewport */}
        <div className="w-full lg:w-7/12 sticky top-24 flex flex-col gap-4">
          <div className="h-[520px] sm:h-[600px] lg:h-[660px]">
            <MockupRenderer
              product={currentProduct}
              currentAngle={currentAngle}
              colorway={currentColorway}
              textureOpacity={currentMaterial.textureOpacity}
              material={currentMaterial}
              unitPrice={Number(
                (
                  currentProduct.basePrice +
                  layers.length * currentProduct.printCostPerLayer +
                  currentMaterial.costModifier
                ).toFixed(2)
              )}
              selectedSize={selectedSize}
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onUpdateLayer={handleUpdateLayer}
              showSafeZone={showSafeZone}
              onToggleSafeZone={() => setShowSafeZone((v) => !v)}
            />
          </div>

          {/* Quick Preset Selector Ribbon Below Canvas */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Instant Prints:</span>
            </div>
            <div className="flex items-center gap-2">
              {GRAPHIC_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    handleAddLayer({
                      name: p.title,
                      type: 'preset',
                      url: p.svgContent,
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotation: 0,
                      opacity: 100,
                      blendMode: 'multiply',
                      aspectRatio: p.aspectRatio,
                    })
                  }
                  className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg text-xs text-neutral-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  +{p.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customizer & Design Tools */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          {/* E-Commerce Product Configurator (Silhouettes, Colorways, Pricing, Cart) */}
          <ProductConfigurator
            currentProduct={currentProduct}
            currentAngle={currentAngle}
            currentColorway={currentColorway}
            currentMaterial={currentMaterial}
            selectedSize={selectedSize}
            layers={layers}
            onSelectProduct={handleSelectProduct}
            onSelectAngle={setCurrentAngle}
            onSelectColorway={setCurrentColorway}
            onSelectMaterial={setCurrentMaterial}
            onSelectSize={setSelectedSize}
            onAddToCart={handleAddToCart}
          />

          {/* Design Toolbar (Presets, Upload, Typography, Adjustments) */}
          <DesignToolbar
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onAddLayer={handleAddLayer}
            onUpdateLayer={handleUpdateLayer}
            onRemoveLayer={handleRemoveLayer}
            onDuplicateLayer={handleDuplicateLayer}
          />
        </div>
      </main>

      {/* 3. Shopping Bag & Order History Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        orders={orders}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onCreateOrder={handleCreateOrder}
        onAdvanceOrderStatus={handleAdvanceOrderStatus}
      />
    </div>
  );
}
