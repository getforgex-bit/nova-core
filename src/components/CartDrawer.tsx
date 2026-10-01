import React, { useState } from 'react';
import { CartItem } from '../types';
import { HARDWARE_CATALOG } from '../data/hardware';
import { generateOrderPdf } from '../utils/generateOrderPdf';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [jsonExportSuccess, setJsonExportSuccess] = useState(false);

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

  const handleDownloadPdf = () => {
    if (items.length === 0) return;
    setIsGeneratingPdf(true);
    try {
      const folioToUse = orderRef || 'NC-ORD-' + Math.floor(100000 + Math.random() * 900000);
      const doc = generateOrderPdf({
        items,
        orderRef: folioToUse,
      });
      doc.save(`NOVA_CORE_ORDEN_${folioToUse}.pdf`);
    } catch (err) {
      console.error('Error al generar resumen PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportJson = () => {
    if (items.length === 0) return;
    setIsExportingJson(true);
    try {
      const folioToUse = orderRef || 'NC-CFG-' + Math.floor(100000 + Math.random() * 900000);

      const hardwareSpecifications = items.map((item, index) => {
        const catalogMatch = HARDWARE_CATALOG.find(
          (c) =>
            c.id === item.id ||
            c.sku.toLowerCase() === (item.sku || '').toLowerCase() ||
            c.name.toLowerCase() === item.name.toLowerCase()
        );

        return {
          itemIndex: index + 1,
          id: item.id,
          sku: item.sku || catalogMatch?.sku || `NC-SKU-${index + 1}`,
          brand: catalogMatch?.brand || 'NOVA CORE CERTIFIED',
          name: item.name,
          category: item.category || catalogMatch?.category || 'hardware',
          quantity: item.quantity,
          unitPriceMXN: item.price,
          totalPriceMXN: item.price * item.quantity,
          technicalSummary:
            catalogMatch?.subtitle || 'Componente verificado bajo estándar industrial',
          tdpWattage:
            catalogMatch?.tdpWattage ||
            (item.category?.toLowerCase().includes('cpu')
              ? 105
              : item.category?.toLowerCase().includes('gpu')
              ? 200
              : null),
          badges: {
            primary: catalogMatch?.badgeTopLeft || null,
            secondary: catalogMatch?.badgeBottomRight || null,
          },
          detailedSpecifications: catalogMatch?.specs || [
            { label: 'CALIDAD:', value: 'CERTIFICADA POR LABORATORIO NOVA CORE' },
          ],
        };
      });

      const totalTdpWatts = hardwareSpecifications.reduce(
        (sum, item) => sum + (item.tdpWattage || 0) * item.quantity,
        0
      );

      const exportPayload = {
        meta: {
          system: 'NOVA CORE LABS // INDUSTRIAL HARDWARE ARCHITECTURE',
          exportType: 'HARDWARE_CONFIG_SPECIFICATION',
          schemaVersion: '2.4.0',
          exportedAt: new Date().toISOString(),
          configurationFolio: folioToUse,
          status: checkoutComplete ? 'ORDER_CONFIRMED' : 'DRAFT_SPECIFICATION',
          laboratoryGuarantee: '36 Meses de Garantía Directa NOVA CORE Lab',
          certification: 'ISO-9001:2026 HARDWARE INTEGRATION COMPLIANT',
        },
        financialSummary: {
          currency: 'MXN',
          subtotalNeto: subtotal,
          iva16Percent: iva,
          totalNetoAutorizado: total,
          itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
          uniqueSkus: items.length,
        },
        telemetry: {
          estimatedTotalTdpWatts: totalTdpWatts,
          recommendedPsuWattage: Math.ceil((totalTdpWatts * 1.35) / 50) * 50,
          efficiencyTarget: '80 PLUS GOLD OR HIGHER',
        },
        hardwareConfiguration: hardwareSpecifications,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NOVA_CORE_CONFIG_${folioToUse}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setJsonExportSuccess(true);
      setTimeout(() => setJsonExportSuccess(false), 3000);
    } catch (err) {
      console.error('Error al exportar configuración JSON:', err);
    } finally {
      setIsExportingJson(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        aria-label="Bolsa de Pedido"
        className="relative w-full max-w-md bg-[#ffffff] border-l border-black shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
      >
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
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-2 py-1 font-mono text-[10px] uppercase font-bold text-[#b3c5ff] hover:text-white border border-[#b3c5ff] hover:border-white transition-colors flex items-center gap-1 cursor-pointer"
                  title="Descargar Resumen de Orden PDF"
                >
                  <span className="material-symbols-outlined text-[13px]">picture_as_pdf</span>
                  <span>PDF</span>
                </button>
                <button
                  onClick={handleExportJson}
                  disabled={isExportingJson}
                  className="px-2 py-1 font-mono text-[10px] uppercase font-bold text-[#b3c5ff] hover:text-white border border-[#b3c5ff] hover:border-white transition-colors flex items-center gap-1 cursor-pointer"
                  title="Exportar configuración de hardware a formato JSON"
                >
                  <span className="material-symbols-outlined text-[13px]">data_object</span>
                  <span>JSON</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-white hover:text-[#b3c5ff] transition-colors p-1 cursor-pointer"
              title="Cerrar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
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

            <div className="w-full space-y-2 pt-2">
              {jsonExportSuccess && (
                <div className="bg-emerald-50 border border-emerald-600 text-emerald-800 px-3 py-1.5 text-[10px] font-mono flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Especificaciones JSON exportadas con éxito al equipo local.</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full bg-white text-black border border-black py-2.5 px-2 font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-[#f1eee7] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  title="Descargar comprobante oficial PDF"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                    picture_as_pdf
                  </span>
                  <span>{isGeneratingPdf ? 'Generando...' : 'Comprobante PDF'}</span>
                </button>

                <button
                  onClick={handleExportJson}
                  disabled={isExportingJson}
                  className="w-full bg-white text-black border border-black py-2.5 px-2 font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-[#f1eee7] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  title="Exportar configuración técnica en JSON"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                    data_object
                  </span>
                  <span>{isExportingJson ? 'Exportando...' : 'Exportar JSON'}</span>
                </button>
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-black text-white py-3 font-mono text-[12px] uppercase font-bold tracking-wider hover:bg-[#0050cc] transition-colors cursor-pointer"
              >
                Cerrar y Regresar
              </button>
            </div>
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

                <div className="space-y-2 pt-1">
                  {jsonExportSuccess && (
                    <div className="bg-emerald-50 border border-emerald-600 text-emerald-800 px-3 py-1.5 text-[10px] font-mono flex items-center gap-1.5 animate-fadeIn">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>Configuración JSON exportada y guardada exitosamente.</span>
                    </div>
                  )}

                  {/* Dual Export Actions: PDF & JSON */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="w-full bg-white text-black border border-black py-2.5 px-2 font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-[#f1eee7] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      title="Descargar resumen técnico en PDF con identidad visual NOVA CORE"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                        picture_as_pdf
                      </span>
                      <span>
                        {isGeneratingPdf ? 'Generando...' : 'Resumen PDF'}
                      </span>
                    </button>

                    <button
                      onClick={handleExportJson}
                      disabled={isExportingJson}
                      className="w-full bg-white text-black border border-black py-2.5 px-2 font-mono text-[10px] uppercase font-bold tracking-wider hover:bg-[#f1eee7] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      title="Exportar configuración técnica actual a archivo JSON para proyectos futuros"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#0050cc]">
                        data_object
                      </span>
                      <span>
                        {isExportingJson ? 'Exportando...' : 'Exportar JSON'}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 font-mono text-[12px] uppercase font-bold tracking-wider hover:bg-[#0050cc] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    <span>Confirmar Pedido de Hardware</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
};

