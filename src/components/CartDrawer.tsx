import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const iva = Math.round(subtotal * 0.16);
  const total = subtotal;

  const handleCheckout = () => {
    const randomRef = 'NC-ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderRef(randomRef);
    setCheckoutComplete(true);
  };

  const handleFinish = () => {
    setCheckoutComplete(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside aria-label="Bolsa de Pedido" className="relative w-full max-w-md bg-[#ffffff] border-l border-black shadow-2xl flex flex-col justify-between z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#b3c5ff]">
              shopping_bag
            </span>
            <span className="font-mono text-[12px] uppercase font-bold tracking-wider">
              [BOLSA DE PEDIDO NOVA CORE]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-[#b3c5ff] transition-colors p-1 cursor-pointer"
            title="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {checkoutComplete ? (
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-[#b3c5ff]">
                verified
              </span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold tracking-widest block">
                ORDEN CERTIFICADA
              </span>
              <h3 className="font-['Space_Grotesk'] text-[24px] uppercase text-black font-bold">
                Pedido Confirmado
              </h3>
              <p className="font-mono text-[12px] text-[#444748]">FOLIO: {orderRef}</p>
            </div>
            <p className="font-sans text-[13px] text-[#444748] max-w-xs leading-relaxed">
              Tu orden ha ingresado a la cola de verificación del laboratorio. Un ingeniero técnico
              te contactará para afinar entrega y garantía oficial.
            </p>
            <div className="bg-[#f1eee7] p-3 w-full text-left font-mono text-[11px] space-y-1 border border-[#c4c7c7]">
              <div className="flex justify-between">
                <span>ESTADO:</span>
                <span className="text-black font-bold">COLA DE LABORATORIO</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL AUTORIZADO:</span>
                <span className="text-black font-bold">${total.toLocaleString('es-MX')} MXN</span>
              </div>
              <div className="flex justify-between">
                <span>GARANTÍA:</span>
                <span className="text-[#0050cc] font-bold">DIRECTA NOVA CORE</span>
              </div>
            </div>
            <button
              onClick={handleFinish}
              className="w-full bg-black text-white py-3 font-mono text-[12px] uppercase font-bold tracking-wider hover:bg-[#0050cc] transition-colors cursor-pointer"
            >
              Cerrar y Regresar
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#ebe8e1]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <span className="material-symbols-outlined text-[48px] text-[#c4c7c7]">
                    production_quantity_limits
                  </span>
                  <span className="font-mono text-[12px] uppercase text-[#747878]">
                    No hay componentes en la orden
                  </span>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {item.sku && (
                          <span className="font-mono text-[9px] bg-[#f1eee7] px-1 text-[#444748] border border-[#c4c7c7]">
                            {item.sku}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-[#0050cc] uppercase font-bold">
                          {item.category || 'COMPONENTE'}
                        </span>
                      </div>
                      <h4 className="font-sans text-[13px] font-semibold text-black truncate mt-0.5">
                        {item.name}
                      </h4>
                      <span className="font-mono text-[12px] text-black font-bold">
                        ${item.price.toLocaleString('es-MX')} MXN
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-black bg-[#f6f3ec]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-black hover:bg-[#ebe8e1] font-mono text-[12px] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-mono text-[11px] font-bold text-black min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-black hover:bg-[#ebe8e1] font-mono text-[12px] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#747878] hover:text-[#ba1a1a] transition-colors p-1 cursor-pointer"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-4 bg-[#f6f3ec] border-t border-black space-y-3">
                <div className="space-y-1 font-mono text-[12px]">
                  <div className="flex justify-between text-[#444748]">
                    <span>SUBTOTAL NETO:</span>
                    <span>${subtotal.toLocaleString('es-MX')} MXN</span>
                  </div>
                  <div className="flex justify-between text-[#444748]">
                    <span>I.V.A. (16% INCLUIDO):</span>
                    <span>${iva.toLocaleString('es-MX')} MXN</span>
                  </div>
                  <div className="border-t border-[#c4c7c7] pt-2 flex justify-between font-bold text-black text-[14px]">
                    <span>TOTAL COTIZADO:</span>
                    <span>${total.toLocaleString('es-MX')} MXN</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 font-mono text-[12px] uppercase font-bold tracking-wider hover:bg-[#0050cc] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Confirmar Pedido de Hardware</span>
                </button>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
};
