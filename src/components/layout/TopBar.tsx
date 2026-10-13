import React, { useState } from 'react';
import { ShoppingBag, X } from 'lucide-react';

interface TopBarProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onSelectCategory?: (category: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  cartItemCount,
  onOpenCart,
}) => {
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);

  const navLinks = [
    { id: 'collection', label: 'Silhouettes' },
    { id: 'print-specs', label: 'Print Specs' },
    { id: 'materials', label: 'Fabrics' },
    { id: 'volume', label: 'Bulk Tiers' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand Wordmark (Single Text Element) */}
          <a
            href="/"
            onClick={(e) => e.preventDefault()}
            className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0 hover:text-orange-400 transition-colors"
          >
            ATELIER STUDIO
          </a>

          {/* Zone 2: 4 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveInfoModal(link.id)}
                className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action (Bag Drawer Trigger) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-900" />
              <span>Bag ({cartItemCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Modal for Header Information Links */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveInfoModal(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {activeInfoModal === 'collection' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-display">Curated Apparel Silhouettes</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Our catalog offers precision-engineered silhouettes designed specifically for high-density custom graphics:
                </p>
                <ul className="text-xs text-neutral-300 space-y-2">
                  <li><strong className="text-white">Tactical Backpack 40L:</strong> 1000D Ballistic Cordura with flat cargo face for large format prints.</li>
                  <li><strong className="text-white">6-Panel Twill Cap:</strong> Pre-curved visor and high-profile structured front crown.</li>
                  <li><strong className="text-white">Retro Runner Sneaker:</strong> Calfskin leather upper with quarter and vamp print zones.</li>
                  <li><strong className="text-white">Boxy Crewneck Tee:</strong> 280 GSM dry-touch heavyweight combed cotton.</li>
                </ul>
              </div>
            )}

            {activeInfoModal === 'print-specs' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-display">Print Quality Specifications</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Industrial Direct-to-Film (DTF) and high-density hybrid screen presses reproduce fine lines up to 1200 DPI with wash-tested color fastness.
                </p>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1.5 text-xs font-mono text-neutral-400">
                  <div>Color Profile: CMYK + High-Density White Underbase</div>
                  <div>Resolution: Up to 1200 × 1200 DPI</div>
                  <div>Durability: 60+ Industrial Wash Cycles Tested</div>
                </div>
              </div>
            )}

            {activeInfoModal === 'materials' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-display">Fabrics & Weaves</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  All textiles are sustainably sourced and ethically manufactured in Portugal and Italy using Oeko-Tex Standard 100 certified fibers.
                </p>
                <div className="text-xs text-neutral-300 space-y-2">
                  <p>• 1000D Cordura Nylon & Recycled Diamond Ripstop</p>
                  <p>• 380 GSM Heavy Chino Twill & Fine-Wale Corduroy</p>
                  <p>• Italian Full-Grain Calfskin & Brushed Nubuck</p>
                  <p>• 280 GSM Combed Organic Cotton</p>
                </div>
              </div>
            )}

            {activeInfoModal === 'volume' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-display">Volume Wholesale Pricing Tiers</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Discounts are applied automatically in the studio based on total batch quantity:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-neutral-400">5 – 24 Units:</span>
                    <div className="font-semibold text-white">5% Off Total</div>
                  </div>
                  <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-neutral-400">25 – 49 Units:</span>
                    <div className="font-semibold text-white">15% Off Total</div>
                  </div>
                  <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-neutral-400">50 – 99 Units:</span>
                    <div className="font-semibold text-white">25% Off Total</div>
                  </div>
                  <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                    <span className="text-neutral-400">100+ Units:</span>
                    <div className="font-semibold text-orange-400">35% Off Total</div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveInfoModal(null)}
              className="mt-4 w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
