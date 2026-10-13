import React, { useRef, useState, useCallback } from 'react';
import { ProductSilhouette, DesignLayer, Colorway, MaterialPreset } from '../../types';
import { SilhouetteBase } from './templates/Silhouettes';
import { Move, RotateCw, Maximize2, ZoomIn, ZoomOut, RefreshCw, Eye, EyeOff, Download, FileCode, Check } from 'lucide-react';
import { generateStandaloneHtml, downloadHtmlFile } from '../../utils/exportHtml';

interface MockupRendererProps {
  product: ProductSilhouette;
  currentAngle: string;
  colorway: Colorway;
  textureOpacity: number;
  material?: MaterialPreset;
  unitPrice?: number;
  selectedSize?: string;
  layers: DesignLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  showSafeZone: boolean;
  onToggleSafeZone: () => void;
}

export const MockupRenderer: React.FC<MockupRendererProps> = ({
  product,
  currentAngle,
  colorway,
  textureOpacity,
  material,
  unitPrice,
  selectedSize,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  showSafeZone,
  onToggleSafeZone,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const printZone = product.printZones[currentAngle] || Object.values(product.printZones)[0];
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  // Viewport zoom & pan
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Direct manipulation transform state
  const [activeTransform, setActiveTransform] = useState<'move' | 'scale' | 'rotate' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, initialLayerX: 0, initialLayerY: 0, initialScale: 1, initialRotation: 0 });

  // Centering snap indicators
  const [isSnappedX, setIsSnappedX] = useState(false);
  const [isSnappedY, setIsSnappedY] = useState(false);

  // Export notification
  const [isExporting, setIsExporting] = useState(false);

  // Handle Layer Drag (Move)
  const handlePointerDownMove = (e: React.PointerEvent, layer: DesignLayer) => {
    e.stopPropagation();
    onSelectLayer(layer.id);
    setActiveTransform('move');
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialScale: layer.scale,
      initialRotation: layer.rotation,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Handle Corner Scale
  const handlePointerDownScale = (e: React.PointerEvent, layer: DesignLayer) => {
    e.stopPropagation();
    setActiveTransform('scale');
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialScale: layer.scale,
      initialRotation: layer.rotation,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Handle Rotation
  const handlePointerDownRotate = (e: React.PointerEvent, layer: DesignLayer) => {
    e.stopPropagation();
    setActiveTransform('rotate');
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialLayerX: layer.x,
      initialLayerY: layer.y,
      initialScale: layer.scale,
      initialRotation: layer.rotation,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer Move (Transform dispatch)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!activeTransform || !selectedLayer || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - dragStart.x) / (rect.width * zoom);
      const deltaY = (e.clientY - dragStart.y) / (rect.height * zoom);

      if (activeTransform === 'move') {
        let newX = dragStart.initialLayerX + deltaX * 100;
        let newY = dragStart.initialLayerY + deltaY * 100;

        // Snapping within ±1.5% of center
        const snapThreshold = 1.5;
        let snappedX = false;
        let snappedY = false;

        if (Math.abs(newX) < snapThreshold) {
          newX = 0;
          snappedX = true;
        }
        if (Math.abs(newY) < snapThreshold) {
          newY = 0;
          snappedY = true;
        }

        setIsSnappedX(snappedX);
        setIsSnappedY(snappedY);

        // Constrain to print bounds (-48% to 48%)
        const clampedX = Math.max(-48, Math.min(48, newX));
        const clampedY = Math.max(-48, Math.min(48, newY));

        onUpdateLayer(selectedLayer.id, { x: clampedX, y: clampedY });
      } else if (activeTransform === 'scale') {
        // Distance from start to current
        const scaleFactor = 1 + (deltaX - deltaY) * 1.8;
        const newScale = Math.max(0.25, Math.min(2.8, dragStart.initialScale * scaleFactor));
        onUpdateLayer(selectedLayer.id, { scale: Number(newScale.toFixed(2)) });
      } else if (activeTransform === 'rotate') {
        const angleDeg = deltaX * 180;
        let newRot = Math.round((dragStart.initialRotation + angleDeg) % 360);
        if (newRot > 180) newRot -= 360;
        if (newRot < -180) newRot += 360;
        // Snap to 0, 90, -90, 180
        if (Math.abs(newRot) < 3) newRot = 0;
        if (Math.abs(newRot - 90) < 3) newRot = 90;
        if (Math.abs(newRot + 90) < 3) newRot = -90;
        onUpdateLayer(selectedLayer.id, { rotation: newRot });
      }
    },
    [activeTransform, selectedLayer, dragStart, zoom, onUpdateLayer]
  );

  const handlePointerUp = () => {
    setActiveTransform(null);
    setIsSnappedX(false);
    setIsSnappedY(false);
  };

  // Canvas Pan Handlers
  const handleStagePointerDown = (e: React.PointerEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      onSelectLayer(null);
      if (e.button === 0) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
    }
  };

  const handleStagePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else {
      handlePointerMove(e);
    }
  };

  const handleStagePointerUp = () => {
    setIsPanning(false);
    handlePointerUp();
  };

  // High Resolution Snapshot PNG Export
  const handleExportPNG = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);

    try {
      const svgElement = containerRef.current.querySelector('svg');
      if (!svgElement) return;

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1600;
        canvas.height = 1600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#18181b';
          ctx.fillRect(0, 0, 1600, 1600);
          ctx.drawImage(image, 0, 0, 1600, 1600);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `${product.id}-${colorway.name.toLowerCase().replace(/\s+/g, '-')}-proof.png`;
          downloadLink.href = pngUrl;
          downloadLink.click();
        }
        URL.revokeObjectURL(blobURL);
        setIsExporting(false);
      };
      image.src = blobURL;
    } catch {
      setIsExporting(false);
    }
  };

  // Standalone HTML Tech Pack Export
  const [isExportingHtml, setIsExportingHtml] = useState(false);
  const handleExportHTML = () => {
    if (!containerRef.current) return;
    setIsExportingHtml(true);
    try {
      const svgElement = containerRef.current.querySelector('svg');
      const svgMarkup = svgElement ? new XMLSerializer().serializeToString(svgElement) : undefined;
      const htmlContent = generateStandaloneHtml({
        product,
        currentAngle,
        colorway,
        material: material || product.materials[0],
        layers,
        unitPrice: unitPrice || product.basePrice,
        selectedSize,
        svgMarkup,
      });

      const filename = `${product.id}-${colorway.name.toLowerCase().replace(/\s+/g, '-')}-tech-pack.html`;
      downloadHtmlFile(filename, htmlContent);
      setTimeout(() => setIsExportingHtml(false), 1500);
    } catch {
      setIsExportingHtml(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden select-none">
      {/* Top Floating Viewport Info */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 text-xs text-neutral-400">
        <span className="font-semibold text-neutral-200 tracking-wide uppercase font-display">{product.name}</span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span>{product.angles.find((a) => a.id === currentAngle)?.label}</span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span className="font-mono text-neutral-400 tabular-nums">
          {printZone.widthMm} × {printZone.heightMm} mm
        </span>
      </div>

      {/* Top Right Floating Toolbar: Safe Zone, Export PNG, Export HTML */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-xl shadow-lg">
        <button
          onClick={onToggleSafeZone}
          title={showSafeZone ? 'Hide Safe Print Boundary' : 'Show Safe Print Boundary'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            showSafeZone ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
          }`}
        >
          {showSafeZone ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Safe Zone</span>
        </button>

        <div className="w-[1px] h-4 bg-neutral-800" />

        <button
          onClick={handleExportPNG}
          disabled={isExporting}
          title="Export high-resolution production mockup proof (PNG)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
        </button>

        <button
          onClick={handleExportHTML}
          disabled={isExportingHtml}
          title="Download standalone HTML tech pack with interactive vector mockup and print specs"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-orange-400 hover:text-orange-300 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer border border-orange-500/30 bg-orange-500/10"
        >
          {isExportingHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
          <span>{isExportingHtml ? 'HTML Saved' : 'Download HTML'}</span>
        </button>
      </div>

      {/* Interactive Main Viewport Canvas */}
      <div
        ref={containerRef}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        className="relative w-full h-full flex items-center justify-center cursor-default overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Subtle Viewport Studio Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Zoomed/Panned Container */}
        <div
          className="relative w-[560px] h-[560px] max-w-[90vw] max-h-[90vw] transition-transform duration-75 flex items-center justify-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Base Vector Silhouette */}
          <div className="absolute inset-0 w-full h-full">
            <SilhouetteBase
              productType={product.id}
              angleId={currentAngle}
              colorway={colorway}
              textureOpacity={textureOpacity}
            />
          </div>

          {/* Printable Safe Area Container */}
          <div
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: `${printZone.xPercent}%`,
              top: `${printZone.yPercent}%`,
              width: `${printZone.widthPercent}%`,
              height: `${printZone.heightPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Visual Safe Boundary Overlay */}
            {showSafeZone && (
              <div className="absolute inset-0 border border-dashed border-orange-500/60 bg-orange-500/5 rounded-lg pointer-events-none flex flex-col justify-between p-1.5 animate-fadeIn">
                <div className="flex justify-between items-center text-[9px] font-mono text-orange-400">
                  <span>PRINT SAFE</span>
                  <span>{printZone.widthMm}mm</span>
                </div>
                {/* Center crosshair */}
                <div className="absolute inset-0 m-auto w-3 h-3 flex items-center justify-center opacity-40">
                  <div className="w-full h-[1px] bg-orange-400" />
                  <div className="h-full w-[1px] bg-orange-400 absolute" />
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-orange-400">
                  <span>AREA</span>
                  <span>{printZone.heightMm}mm</span>
                </div>
              </div>
            )}

            {/* Centering Snap Guides */}
            {isSnappedX && (
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] pointer-events-none z-30" />
            )}
            {isSnappedY && (
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] pointer-events-none z-30" />
            )}

            {/* Design Layers Rendered Within Print Area */}
            {layers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;

              return (
                <div
                  key={layer.id}
                  onPointerDown={(e) => handlePointerDownMove(e, layer)}
                  className={`absolute pointer-events-auto cursor-grab active:cursor-grabbing transition-shadow ${
                    isSelected ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    left: `calc(50% + ${layer.x}%)`,
                    top: `calc(50% + ${layer.y}%)`,
                    transform: `translate(-50%, -50%) rotate(${layer.rotation}deg) scale(${layer.scale})`,
                    opacity: layer.opacity / 100,
                  }}
                >
                  {/* Layer Content */}
                  <div
                    className="relative flex items-center justify-center select-none"
                    style={{
                      mixBlendMode: layer.blendMode,
                    }}
                  >
                    {layer.type === 'text' && layer.textConfig ? (
                      <div
                        style={{
                          fontFamily: layer.textConfig.fontFamily,
                          fontSize: `${layer.textConfig.fontSize}px`,
                          fontWeight: layer.textConfig.isBold ? 700 : 500,
                          color: layer.textConfig.color,
                          letterSpacing: `${layer.textConfig.letterSpacing}px`,
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}
                      >
                        {layer.textConfig.text}
                      </div>
                    ) : layer.type === 'preset' ? (
                      <div
                        className="w-36 h-36 flex items-center justify-center text-neutral-100"
                        dangerouslySetInnerHTML={{ __html: layer.url }}
                      />
                    ) : (
                      <img
                        src={layer.url}
                        alt={layer.name}
                        className="max-w-[180px] max-h-[180px] object-contain pointer-events-none drop-shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  {/* Active Transform Gizmo Bounding Box */}
                  {isSelected && (
                    <div className="absolute -inset-2 border-2 border-orange-500 rounded-md pointer-events-none">
                      {/* Top Rotation Stem & Handle */}
                      <div
                        onPointerDown={(e) => handlePointerDownRotate(e, layer)}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-orange-500 hover:bg-orange-400 text-white rounded-full flex items-center justify-center cursor-alias pointer-events-auto shadow-md transition-transform hover:scale-110"
                        title="Rotate Artwork"
                      >
                        <RotateCw className="w-2.5 h-2.5" />
                      </div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-orange-500 pointer-events-none" />

                      {/* Four Corner Scale Handles */}
                      <div
                        onPointerDown={(e) => handlePointerDownScale(e, layer)}
                        className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-orange-500 rounded-sm cursor-nwse-resize pointer-events-auto shadow-sm"
                        title="Scale Artwork"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDownScale(e, layer)}
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-orange-500 rounded-sm cursor-nesw-resize pointer-events-auto shadow-sm"
                        title="Scale Artwork"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDownScale(e, layer)}
                        className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-orange-500 rounded-sm cursor-nesw-resize pointer-events-auto shadow-sm"
                        title="Scale Artwork"
                      />
                      <div
                        onPointerDown={(e) => handlePointerDownScale(e, layer)}
                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-orange-500 rounded-sm cursor-nwse-resize pointer-events-auto shadow-sm"
                        title="Scale Artwork"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Floating Viewport Controls: Zoom & Position */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 p-1 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 rounded-xl shadow-lg">
        <button
          onClick={() => setZoom((z: number) => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
          title="Zoom Out"
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="px-2 font-mono text-xs text-neutral-300 tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z: number) => Math.min(2.2, Number((z + 0.15).toFixed(2))))}
          title="Zoom In"
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          title="Reset View"
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Direct Manipulation Guide Tooltip */}
      {selectedLayer && (
        <div className="absolute bottom-4 right-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-xl text-xs text-neutral-400 shadow-lg">
          <Move className="w-3.5 h-3.5 text-orange-400" />
          <span>Drag to move</span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Corners to scale</span>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <RotateCw className="w-3.5 h-3.5 text-orange-400" />
          <span>Top pin to rotate</span>
        </div>
      )}
    </div>
  );
};
