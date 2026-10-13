import React, { useState } from 'react';
import { ProductSilhouette, Colorway, MaterialPreset, DesignLayer, ProductType } from '../../types';
import { PRODUCTS } from '../../data/products';
import { ShoppingBag, Check, ShieldCheck, Truck, Layers, Sparkles, FileCode } from 'lucide-react';
import { generateStandaloneHtml, downloadHtmlFile } from '../../utils/exportHtml';

interface ProductConfiguratorProps {
  currentProduct: ProductSilhouette;
  currentAngle: string;
  currentColorway: Colorway;
  currentMaterial: MaterialPreset;
  selectedSize?: string;
  layers: DesignLayer[];
  onSelectProduct: (productId: ProductType) => void;
  onSelectAngle: (angleId: string) => void;
  onSelectColorway: (color: Colorway) => void;
  onSelectMaterial: (material: MaterialPreset) => void;
  onSelectSize: (size: string) => void;
  onAddToCart: (quantity: number) => void;
}

export const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({
  currentProduct,
  currentAngle,
  currentColorway,
  currentMaterial,
  selectedSize,
  layers,
  onSelectProduct,
  onSelectAngle,
  onSelectColorway,
  onSelectMaterial,
  onSelectSize,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isHtmlDownloading, setIsHtmlDownloading] = useState(false);

  // Volume pricing tiers
  const volumeDiscount = quantity >= 100 ? 0.35 : quantity >= 50 ? 0.25 : quantity >= 25 ? 0.15 : quantity >= 5 ? 0.05 : 0;

  // Real-time dynamic cost calculation
  const baseCost = currentProduct.basePrice;
  const printCost = layers.length * currentProduct.printCostPerLayer;
  const materialModifier = currentMaterial.costModifier;
  const undiscountedUnit = baseCost + printCost + materialModifier;
  const unitPrice = Number((undiscountedUnit * (1 - volumeDiscount)).toFixed(2));
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const handleAdd = () => {
    onAddToCart(quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleDownloadHtml = () => {
    setIsHtmlDownloading(true);
    try {
      const svgElement = document.querySelector('svg');
      const svgMarkup = svgElement ? new XMLSerializer().serializeToString(svgElement) : undefined;
      const htmlContent = generateStandaloneHtml({
        product: currentProduct,
        currentAngle,
        colorway: currentColorway,
        material: currentMaterial,
        layers,
        unitPrice,
        selectedSize,
        svgMarkup,
      });

      const filename = `${currentProduct.id}-${currentColorway.name.toLowerCase().replace(/\s+/g, '-')}-tech-pack.html`;
      downloadHtmlFile(filename, htmlContent);
      setTimeout(() => setIsHtmlDownloading(false), 1500);
    } catch {
      setIsHtmlDownloading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-6">
      {/* 1. Silhouette Selector Tabs */}
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <span className="font-medium uppercase tracking-wider text-[11px]">Select Garment Silhouette</span>
          <span>4 Models Available</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRODUCTS.map((p) => {
            const isSelected = p.id === currentProduct.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProduct(p.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-neutral-800 border-orange-500 shadow-md text-white'
                    : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <span className="text-xs font-semibold leading-tight">{p.name.split(' ')[0]}</span>
                <span className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">{p.category}</span>
                <span className="text-[11px] font-mono text-orange-400 font-medium mt-1">
                  ${p.basePrice}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Angle View Switcher */}
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <span className="font-medium uppercase tracking-wider text-[11px]">Inspection Angle</span>
          <span>{currentProduct.angles.length} Perspective Views</span>
        </div>
        <div className="flex items-center gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800/80">
          {currentProduct.angles.map((ang) => {
            const isSelected = ang.id === currentAngle;
            return (
              <button
                key={ang.id}
                onClick={() => onSelectAngle(ang.id)}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {ang.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Garment Colorway Swatches */}
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <span className="font-medium uppercase tracking-wider text-[11px]">
            Colorway: <span className="text-neutral-200 font-semibold">{currentColorway.name}</span>
          </span>
          <span className="font-mono text-[11px] text-neutral-500">{currentColorway.hex}</span>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {currentProduct.colorways.map((c) => {
            const isSelected = c.name === currentColorway.name;
            return (
              <button
                key={c.name}
                onClick={() => onSelectColorway(c)}
                title={c.name}
                className={`relative w-8 h-8 rounded-full border transition-all ${
                  isSelected
                    ? 'scale-110 border-orange-500 ring-2 ring-orange-500/40'
                    : 'border-neutral-700 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Fabric Material Specification */}
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
          <span className="font-medium uppercase tracking-wider text-[11px]">Material & Weave</span>
          {currentMaterial.costModifier > 0 && (
            <span className="text-[11px] text-orange-400 font-mono">
              +${currentMaterial.costModifier} premium
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {currentProduct.materials.map((mat) => {
            const isSelected = mat.id === currentMaterial.id;
            return (
              <button
                key={mat.id}
                onClick={() => onSelectMaterial(mat)}
                className={`flex items-start justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-neutral-800/80 border-orange-500/80 text-white'
                    : 'bg-neutral-950/40 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-neutral-200">{mat.name}</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                    {mat.description}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="text-xs font-mono font-medium text-neutral-300">
                    {mat.costModifier === 0 ? 'Standard' : `+$${mat.costModifier}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Size Selection (If Available) */}
      {currentProduct.sizes && currentProduct.sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium uppercase tracking-wider text-[11px]">Garment Sizing</span>
            <span>Unisex Streetwear Cut</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {currentProduct.sizes.map((s) => {
              const isSelected = s === selectedSize;
              return (
                <button
                  key={s}
                  onClick={() => onSelectSize(s)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors truncate ${
                    isSelected
                      ? 'bg-neutral-800 border-orange-500 text-white shadow-sm'
                      : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Dynamic Pricing Breakdown & Volume Tiers */}
      <div className="bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider text-[11px]">
            Dynamic Production Pricing
          </span>
          {volumeDiscount > 0 && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {Math.round(volumeDiscount * 100)}% Volume Discount
            </span>
          )}
        </div>

        {/* Breakdown Items */}
        <div className="space-y-1.5 text-xs text-neutral-400 border-b border-neutral-800 pb-3">
          <div className="flex justify-between">
            <span>Base Garment ({currentProduct.name.split(' ')[0]})</span>
            <span className="font-mono text-neutral-200 tabular-nums">${baseCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Print Pass ({layers.length} custom artwork placement{layers.length !== 1 ? 's' : ''})</span>
            <span className="font-mono text-neutral-200 tabular-nums">${printCost.toFixed(2)}</span>
          </div>
          {materialModifier > 0 && (
            <div className="flex justify-between">
              <span>Material Upgrade ({currentMaterial.name})</span>
              <span className="font-mono text-neutral-200 tabular-nums">+${materialModifier.toFixed(2)}</span>
            </div>
          )}
          {volumeDiscount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Bulk Savings Tier</span>
              <span className="font-mono tabular-nums">
                -${((undiscountedUnit - unitPrice) * quantity).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Quantity Stepper & Quick Volume Tiers */}
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span>Production Run Quantity</span>
            <span className="font-mono font-medium text-neutral-200">{quantity} units</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 5, 25, 50, 100].map((qty) => (
              <button
                key={qty}
                onClick={() => setQuantity(qty)}
                className={`flex-1 py-1 text-xs font-mono rounded-lg border transition-colors ${
                  quantity === qty
                    ? 'bg-neutral-800 border-orange-500 text-white font-semibold'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {qty}x
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Total Line */}
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <div className="text-xl font-bold font-display text-white tracking-tight">
              ${totalPrice.toFixed(2)}
            </div>
            <div className="text-[11px] text-neutral-500">
              ${unitPrice.toFixed(2)} / unit · Estimated turnaround: 3-5 days
            </div>
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-lg active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-500 hover:bg-orange-400 text-neutral-950 hover:text-black font-bold'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Download Action: Standalone HTML Tech Pack */}
        <button
          onClick={handleDownloadHtml}
          disabled={isHtmlDownloading}
          className="w-full mt-2 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-500/40 rounded-xl text-xs font-medium text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
        >
          {isHtmlDownloading ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>HTML Tech Pack Downloaded</span>
            </>
          ) : (
            <>
              <FileCode className="w-3.5 h-3.5 text-orange-400" />
              <span>Download HTML Tech Pack (.html)</span>
            </>
          )}
        </button>
      </div>

      {/* Trust & Production Markers */}
      <div className="grid grid-cols-2 gap-3 text-xs text-neutral-400 border-t border-neutral-800/80 pt-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
          <span>Industrial Color Fastness</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-neutral-400 shrink-0" />
          <span>Free Express over $150</span>
        </div>
      </div>
    </div>
  );
};
