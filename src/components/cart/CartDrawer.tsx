import React, { useState } from 'react';
import { CartItem, ProductionOrder, TrackingStatus } from '../../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Package,
  Clock,
  Truck,
  Check,
  Copy,
  FastForward,
  Printer,
  Sparkles,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orders: ProductionOrder[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCreateOrder: (newOrder: ProductionOrder) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  orders,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCreateOrder,
  onAdvanceOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'bag' | 'history'>('bag');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  // Form fields for checkout
  const [companyName, setCompanyName] = useState('Archive Atelier Studio');
  const [contactName, setContactName] = useState('Dante Alvarez');
  const [contactEmail, setContactEmail] = useState('dantegp7274@gmail.com');
  const [shippingAddress, setShippingAddress] = useState('440 Fashion Boulevard, Suite 120');

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const shippingCost = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 15;
  const grandTotal = subtotal + shippingCost;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: ProductionOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ATL-${randomNum}`,
      items: [...items],
      subtotal,
      shipping: shippingCost,
      total: grandTotal,
      recipient: {
        company: companyName,
        name: contactName,
        email: contactEmail,
        address: shippingAddress,
      },
      trackingStatus: 'Printing',
      statusHistory: [
        {
          status: 'Pre-Flight',
          timestamp: Date.now() - 1000 * 60 * 2,
          note: 'Artwork color separations compiled and approved for digital press.',
        },
        {
          status: 'Printing',
          timestamp: Date.now(),
          note: 'High-density DTF thermal press in progress in main atelier bay.',
        },
      ],
      trackingNumber: `DHL-${Math.floor(1000 + Math.random() * 9000)}-${randomNum}-ATL`,
      carrier: 'DHL Express On-Demand',
      estimatedDelivery: '3 Business Days',
      createdAt: Date.now(),
    };

    onCreateOrder(newOrder);
    setOrderConfirmed(true);

    setTimeout(() => {
      onClearCart();
      setIsCheckoutModalOpen(false);
      setOrderConfirmed(false);
      setActiveTab('history');
    }, 1800);
  };

  const handleCopyTracking = (tracking: string, id: string) => {
    navigator.clipboard?.writeText(tracking);
    setCopiedTrackingId(id);
    setTimeout(() => setCopiedTrackingId(null), 2000);
  };

  if (!isOpen) return null;

  const STATUS_STEPS: TrackingStatus[] = ['Pre-Flight', 'Printing', 'Quality Check', 'Shipped'];

  const getStatusIndex = (status: TrackingStatus) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx === -1 ? 0 : idx;
  };

  const getStatusColor = (status: TrackingStatus) => {
    switch (status) {
      case 'Pre-Flight':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Printing':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Quality Check':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Shipped':
      case 'Delivered':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-neutral-400 bg-neutral-800 border-neutral-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 flex flex-col shadow-2xl">
          {/* Header & View Switcher */}
          <div className="p-5 border-b border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <h2 className="text-base font-semibold text-white font-display">
                  Atelier Fulfillment
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Tab Controls: Active Bag vs Order History */}
            <div className="flex items-center p-1 bg-neutral-950 rounded-xl border border-neutral-800/80">
              <button
                onClick={() => setActiveTab('bag')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'bag'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Active Bag</span>
                <span className="font-mono text-[10px] bg-neutral-700 text-neutral-300 rounded px-1.5">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Order History</span>
                <span className="font-mono text-[10px] bg-neutral-700 text-neutral-300 rounded px-1.5">
                  {orders.length}
                </span>
              </button>
            </div>
          </div>

          {/* TAB 1: ACTIVE BAG VIEW */}
          {activeTab === 'bag' && (
            <>
              {/* Free Shipping Progress Indicator */}
              <div className="bg-neutral-950 p-4 border-b border-neutral-800/80">
                <div className="flex justify-between text-xs text-neutral-300 mb-1.5">
                  <span>
                    {subtotal >= freeShippingThreshold
                      ? 'Unlocked Free Express Courier Delivery!'
                      : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Express`}
                  </span>
                  <span className="font-mono text-neutral-400 tabular-nums">
                    {Math.round(progressToFreeShipping)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 flex flex-col items-center">
                    <Package className="w-12 h-12 opacity-30 mb-3" />
                    <p className="text-sm font-medium text-neutral-400">Your bag is empty</p>
                    <p className="text-xs text-neutral-600 mt-1 max-w-[240px]">
                      Customize a backpack, cap, sneaker, or tee to start a production run.
                    </p>
                    {orders.length > 0 && (
                      <button
                        onClick={() => setActiveTab('history')}
                        className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        View {orders.length} Existing Orders
                      </button>
                    )}
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3.5 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Color indicator swatch & icon */}
                          <div
                            className="w-10 h-10 rounded-lg border border-neutral-700 flex items-center justify-center shrink-0 shadow-inner"
                            style={{ backgroundColor: item.colorway.hex }}
                          >
                            <span className="text-[9px] font-mono font-bold text-white uppercase drop-shadow-md">
                              {item.productId.slice(0, 3)}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-white leading-tight">
                              {item.productName}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                              <span>{item.colorway.name}</span>
                              <span aria-hidden="true" className="text-neutral-700">·</span>
                              <span>{item.material.name.split(' ')[0]}</span>
                              {item.size && (
                                <>
                                  <span aria-hidden="true" className="text-neutral-700">·</span>
                                  <span className="text-orange-400">{item.size.split(' ')[0]}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Artwork summary */}
                      <div className="text-[11px] text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-800 flex items-center justify-between">
                        <span>
                          {item.layers.length > 0
                            ? `${item.layers.length} custom artwork placement${item.layers.length > 1 ? 's' : ''}`
                            : 'Blank specimen (no prints)'}
                        </span>
                        <span className="text-neutral-500 font-mono text-[10px]">
                          {item.selectedAngle} angle
                        </span>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60">
                        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-white tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-semibold text-white tabular-nums">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-[10px] text-neutral-500 font-mono">
                            ${item.unitPrice.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {items.length > 0 && (
                <div className="p-5 bg-neutral-950 border-t border-neutral-800 space-y-3">
                  <div className="space-y-1.5 text-xs text-neutral-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-neutral-200 tabular-nums">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express Courier Shipping</span>
                      <span className="font-mono text-neutral-200 tabular-nums">
                        {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-neutral-800">
                      <span>Production Total</span>
                      <span className="font-mono text-orange-400 tabular-nums">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckoutModalOpen(true)}
                    className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Order Proof</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: ORDER HISTORY VIEW (Simulating Printing, Quality Check, Shipped) */}
          {activeTab === 'history' && (
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Production Run Queue</span>
                <span className="font-mono">{orders.length} orders tracked</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 flex flex-col items-center">
                  <Clock className="w-12 h-12 opacity-30 mb-3" />
                  <p className="text-sm font-medium text-neutral-400">No Orders in History</p>
                  <p className="text-xs text-neutral-600 mt-1 max-w-[240px]">
                    Confirm an order from your active bag to track its production stages.
                  </p>
                </div>
              ) : (
                orders.map((order) => {
                  const currentIdx = getStatusIndex(order.trackingStatus);
                  const isDelivered = order.trackingStatus === 'Delivered';

                  return (
                    <div
                      key={order.id}
                      className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 flex flex-col gap-4 shadow-sm"
                    >
                      {/* Top Order Row */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-xs">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(
                                order.trackingStatus
                              )}`}
                            >
                              {order.trackingStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Placed {new Date(order.createdAt).toLocaleDateString()} · {order.recipient.company}
                          </p>
                        </div>

                        {/* Interactive Status Simulation Advance Button */}
                        <button
                          onClick={() => onAdvanceOrderStatus(order.id)}
                          title="Simulate advancing to next factory stage"
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg text-[10px] font-medium transition-colors cursor-pointer border border-neutral-700/80"
                        >
                          <FastForward className="w-3 h-3 text-orange-400" />
                          <span>Advance Status</span>
                        </button>
                      </div>

                      {/* 4-Step Production Status Stepper */}
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-4 gap-1 relative">
                          {/* Background Track Line */}
                          <div className="absolute top-2.5 left-2 right-2 h-0.5 bg-neutral-800 -z-0" />
                          {/* Active Highlight Line */}
                          <div
                            className="absolute top-2.5 left-2 h-0.5 bg-orange-500 transition-all duration-300 -z-0"
                            style={{
                              width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 96}%`,
                            }}
                          />

                          {STATUS_STEPS.map((step, idx) => {
                            const isPast = idx < currentIdx;
                            const isCurrent = idx === currentIdx;

                            return (
                              <div
                                key={step}
                                className="flex flex-col items-center text-center relative z-10"
                              >
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-all ${
                                    isCurrent
                                      ? 'bg-orange-500 text-neutral-950 font-bold ring-4 ring-orange-500/20'
                                      : isPast
                                      ? 'bg-neutral-700 text-white'
                                      : 'bg-neutral-900 border border-neutral-800 text-neutral-600'
                                  }`}
                                >
                                  {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                                </div>
                                <span
                                  className={`text-[9px] mt-1.5 leading-tight font-medium ${
                                    isCurrent
                                      ? 'text-orange-400 font-semibold'
                                      : isPast
                                      ? 'text-neutral-300'
                                      : 'text-neutral-600'
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Status Live Note Callout */}
                      <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2.5 text-xs">
                        <div className="flex items-center gap-1.5 text-neutral-300 font-medium mb-1">
                          {order.trackingStatus === 'Printing' && (
                            <Printer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          {order.trackingStatus === 'Quality Check' && (
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          )}
                          {order.trackingStatus === 'Shipped' && (
                            <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                          {order.trackingStatus === 'Pre-Flight' && (
                            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          )}
                          <span className="text-[11px] uppercase tracking-wider text-neutral-400">
                            Current Stage Description:
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug">
                          {order.statusHistory[order.statusHistory.length - 1]?.note ||
                            'Processing in automated queue.'}
                        </p>
                      </div>

                      {/* Tracking Carrier & Shipping Info */}
                      <div className="flex items-center justify-between text-xs text-neutral-400 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800/80">
                        <div className="min-w-0 pr-2">
                          <div className="text-[10px] text-neutral-500 uppercase font-mono">
                            {order.carrier}
                          </div>
                          <div className="font-mono text-neutral-300 text-xs truncate">
                            {order.trackingNumber}
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopyTracking(order.trackingNumber, order.id)}
                          className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors shrink-0 cursor-pointer"
                        >
                          {copiedTrackingId === order.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Item Line summary inside order */}
                      <div className="space-y-1.5 border-t border-neutral-800/80 pt-2.5">
                        <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">
                          Order Contents:
                        </div>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-neutral-300 truncate pr-2">
                              {item.quantity}x {item.productName} ({item.colorway.name})
                            </span>
                            <span className="font-mono text-neutral-400 shrink-0 tabular-nums">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center text-xs font-semibold text-white pt-1 border-t border-neutral-800/50">
                          <span>Total Invoiced</span>
                          <span className="font-mono text-orange-400 tabular-nums">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Proof & Verification Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setOrderConfirmed(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {orderConfirmed ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white font-display">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Routing directly to the factory floor. Loading your real-time tracking tracker now...
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Review Production Proof & Delivery
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Verify client recipient information for direct factory delivery.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">Company / Brand Name</label>
                    <input
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 mb-1">Contact Name</label>
                      <input
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Shipping Email</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Delivery Address</label>
                    <input
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-neutral-400">Total Due Upon Proof Approval:</span>
                    <div className="text-base font-bold text-white font-mono">${grandTotal.toFixed(2)}</div>
                  </div>
                  <span className="text-emerald-400 font-mono text-[11px]">Factory Direct</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg cursor-pointer"
                >
                  Authorize Factory Run
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
