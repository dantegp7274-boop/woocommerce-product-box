import React, { useState, useRef } from 'react';
import { DesignLayer, GraphicPreset, BlendMode, TextConfig } from '../../types';
import { GRAPHIC_PRESETS } from '../../data/presets';
import {
  Upload,
  Sparkles,
  Type,
  Layers,
  Trash2,
  Copy,
  RotateCcw,
  AlignCenter,
  Maximize,
  Sliders,
  Check,
} from 'lucide-react';

interface DesignToolbarProps {
  layers: DesignLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onAddLayer: (layer: Omit<DesignLayer, 'id'>) => void;
  onUpdateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  onRemoveLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
}

export const DesignToolbar: React.FC<DesignToolbarProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onAddLayer,
  onUpdateLayer,
  onRemoveLayer,
  onDuplicateLayer,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'text' | 'adjust'>('presets');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text generator state
  const [customText, setCustomText] = useState('ATELIER 26');
  const [textFontSize, setTextFontSize] = useState(36);
  const [textFontFamily, setTextFontFamily] = useState("'Outfit', sans-serif");
  const [textColor, setTextColor] = useState('#ffffff');
  const [textIsBold, setTextIsBold] = useState(true);
  const [textLetterSpacing, setTextLetterSpacing] = useState(4);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  // Handle Image File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const aspect = img.width / img.height;
        onAddLayer({
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'image',
          url: dataUrl,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 100,
          blendMode: 'multiply',
          aspectRatio: aspect,
        });
        setActiveTab('adjust');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    // Reset file input value so same file can be re-selected
    e.target.value = '';
  };

  // Handle Preset Graphic Selection
  const handleSelectPreset = (preset: GraphicPreset) => {
    onAddLayer({
      name: preset.title,
      type: 'preset',
      url: preset.svgContent,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 100,
      blendMode: 'multiply',
      aspectRatio: preset.aspectRatio,
    });
    setActiveTab('adjust');
  };

  // Handle Adding Text Layer
  const handleAddTextLayer = () => {
    if (!customText.trim()) return;

    const textConfig: TextConfig = {
      text: customText.trim(),
      fontSize: textFontSize,
      fontFamily: textFontFamily,
      color: textColor,
      isBold: textIsBold,
      letterSpacing: textLetterSpacing,
      isCurved: false,
      curveRadius: 100,
    };

    onAddLayer({
      name: `Type: ${customText.slice(0, 12)}`,
      type: 'text',
      url: '',
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 100,
      blendMode: 'normal',
      aspectRatio: 2,
      textConfig,
    });
    setActiveTab('adjust');
  };

  const blendModeOptions: { mode: BlendMode; label: string; desc: string }[] = [
    { mode: 'multiply', label: 'Fabric Weave', desc: 'Ink sinks naturally into cotton & cordura folds' },
    { mode: 'normal', label: 'Solid Vinyl', desc: 'Vibrant opaque high-density transfer' },
    { mode: 'overlay', label: 'Vintage Distress', desc: 'High-contrast washed streetwear look' },
    { mode: 'screen', label: 'Discharge Ink', desc: 'Luminescent metallic or bleached effect' },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-5">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800/80">
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'presets' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Presets</span>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'upload' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'text' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Typography</span>
        </button>
        <button
          onClick={() => setActiveTab('adjust')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'adjust' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Adjust</span>
          {layers.length > 0 && (
            <span className="text-[10px] font-mono bg-neutral-700 text-neutral-300 rounded px-1.5">
              {layers.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: CURATED PRESETS */}
      {activeTab === 'presets' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Instant Artwork Library</span>
            <span>Click to add onto canvas</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {GRAPHIC_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="group relative flex flex-col items-center justify-center p-3 bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800/80 hover:border-orange-500/50 rounded-xl transition-all duration-150 cursor-pointer text-left"
              >
                <div
                  className="w-16 h-16 text-neutral-300 group-hover:text-white transition-colors flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: preset.svgContent }}
                />
                <span className="mt-2 text-[11px] font-medium text-neutral-300 group-hover:text-orange-400 truncate w-full text-center">
                  {preset.title}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono">
                  {preset.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: UPLOAD ARTWORK */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            onChange={handleFileUpload}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-neutral-700 hover:border-orange-500/80 bg-neutral-950/40 hover:bg-neutral-950/70 rounded-xl cursor-pointer transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-orange-400 group-hover:bg-neutral-700 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-200 group-hover:text-white">
                Choose Image or Drag & Drop
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                PNG, SVG, or JPEG up to 25MB · Transparent PNG recommended
              </p>
            </div>
            <button
              type="button"
              className="mt-1 px-4 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-white rounded-lg transition-colors whitespace-nowrap"
            >
              Browse Files
            </button>
          </div>

          <div className="text-xs text-neutral-500 leading-relaxed bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/60">
            <span className="font-semibold text-neutral-300">Print Quality Guarantee:</span> Artwork is rendered at native resolution and matched against commercial Direct-to-Film (DTF) color profiles.
          </div>
        </div>
      )}

      {/* TAB 3: TYPOGRAPHY GENERATOR */}
      {activeTab === 'text' && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Custom Headline or Monogram
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. TOKYO DIVISION 09"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-orange-500 font-display uppercase tracking-wider"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Typeface
              </label>
              <select
                value={textFontFamily}
                onChange={(e) => setTextFontFamily(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-orange-500"
              >
                <option value="'Outfit', sans-serif">Outfit (Athletic Display)</option>
                <option value="'Plus Jakarta Sans', sans-serif">Jakarta (Clean Modern)</option>
                <option value="'JetBrains Mono', monospace">Mono (Industrial Spec)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Ink Color
              </label>
              <div className="flex items-center gap-1.5">
                {['#ffffff', '#18181b', '#f97316', '#3b82f6', '#10b981', '#eab308'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTextColor(c)}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      textColor === c ? 'scale-110 border-orange-500 ring-2 ring-orange-500/30' : 'border-neutral-700'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Font Size</span>
                <span className="font-mono tabular-nums">{textFontSize}px</span>
              </div>
              <input
                type="range"
                min="18"
                max="72"
                value={textFontSize}
                onChange={(e) => setTextFontSize(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Tracking</span>
                <span className="font-mono tabular-nums">{textLetterSpacing}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={textLetterSpacing}
                onChange={(e) => setTextLetterSpacing(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={textIsBold}
                onChange={(e) => setTextIsBold(e.target.checked)}
                className="accent-orange-500 rounded"
              />
              <span>Heavyweight Bold</span>
            </label>
          </div>

          <button
            onClick={handleAddTextLayer}
            className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Type className="w-4 h-4" />
            <span>Apply Text Print to Garment</span>
          </button>
        </div>
      )}

      {/* TAB 4: LAYER ADJUSTMENT & CONTROLS */}
      {activeTab === 'adjust' && (
        <div className="flex flex-col gap-4">
          {layers.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>No active artwork layers yet.</span>
              <p className="mt-1 text-neutral-600">Pick a preset graphic or upload an image to start customizing.</p>
            </div>
          ) : (
            <>
              {/* Layers Stack List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                  Active Layers ({layers.length})
                </span>
                <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                  {layers.map((layer) => {
                    const isSelected = layer.id === selectedLayerId;
                    return (
                      <div
                        key={layer.id}
                        onClick={() => onSelectLayer(layer.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-neutral-800 border border-orange-500/50 text-white'
                            : 'bg-neutral-950/60 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {layer.type === 'text' ? (
                            <Type className="w-4 h-4 text-orange-400 shrink-0" />
                          ) : layer.type === 'preset' ? (
                            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                          ) : (
                            <img
                              src={layer.url}
                              alt=""
                              className="w-5 h-5 object-contain rounded shrink-0 bg-neutral-900"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span className="text-xs truncate font-medium">{layer.name}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateLayer(layer.id);
                            }}
                            title="Duplicate Layer"
                            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700/60 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveLayer(layer.id);
                            }}
                            title="Delete Layer"
                            className="p-1 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-700/60 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Layer Fine-Tuning */}
              {selectedLayer && (
                <div className="flex flex-col gap-3 pt-2 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-200">
                      Fine-Tune: {selectedLayer.name}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateLayer(selectedLayer.id, { x: 0, y: 0, rotation: 0, scale: 1 })
                      }
                      title="Reset Position & Scale"
                      className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Quick Center Alignment Tools */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onUpdateLayer(selectedLayer.id, { x: 0 })}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-lg text-xs text-neutral-300 transition-colors"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                      <span>Center Horiz.</span>
                    </button>
                    <button
                      onClick={() => onUpdateLayer(selectedLayer.id, { y: 0 })}
                      className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-lg text-xs text-neutral-300 transition-colors"
                    >
                      <Maximize className="w-3.5 h-3.5" />
                      <span>Center Vert.</span>
                    </button>
                  </div>

                  {/* Numeric Sliders */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between text-xs text-neutral-400 mb-1">
                        <span>Scale</span>
                        <span className="font-mono tabular-nums">{Math.round(selectedLayer.scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.25"
                        max="2.5"
                        step="0.05"
                        value={selectedLayer.scale}
                        onChange={(e) =>
                          onUpdateLayer(selectedLayer.id, { scale: Number(e.target.value) })
                        }
                        className="w-full accent-orange-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-neutral-400 mb-1">
                        <span>Rotation</span>
                        <span className="font-mono tabular-nums">{selectedLayer.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={selectedLayer.rotation}
                        onChange={(e) =>
                          onUpdateLayer(selectedLayer.id, { rotation: Number(e.target.value) })
                        }
                        className="w-full accent-orange-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-neutral-400 mb-1">
                        <span>Opacity</span>
                        <span className="font-mono tabular-nums">{selectedLayer.opacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={selectedLayer.opacity}
                        onChange={(e) =>
                          onUpdateLayer(selectedLayer.id, { opacity: Number(e.target.value) })
                        }
                        className="w-full accent-orange-500"
                      />
                    </div>
                  </div>

                  {/* Print Blend Mode Selector */}
                  <div className="pt-2">
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Print Finish & Inking Blend
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {blendModeOptions.map((opt) => {
                        const isCurrent = selectedLayer.blendMode === opt.mode;
                        return (
                          <button
                            key={opt.mode}
                            onClick={() =>
                              onUpdateLayer(selectedLayer.id, { blendMode: opt.mode })
                            }
                            className={`p-2 rounded-lg text-left border transition-all ${
                              isCurrent
                                ? 'bg-orange-500/10 border-orange-500 text-white'
                                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span>{opt.label}</span>
                              {isCurrent && <Check className="w-3 h-3 text-orange-400" />}
                            </div>
                            <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                              {opt.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
