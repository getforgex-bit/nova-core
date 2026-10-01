/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActiveView,
  CartItem,
  ConfiguratorSlot,
  HardwareComponent,
  PrebuiltPack,
  TechService,
} from './types';
import { INITIAL_CONFIGURATOR_SLOTS } from './data/defaultSlots';
import { HARDWARE_CATALOG } from './data/hardware';
import { generateOrderPdf } from './utils/generateOrderPdf';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { CartDrawer } from './components/CartDrawer';
import { SlotPickerModal } from './components/SlotPickerModal';
import { RulesDrawer } from './components/RulesDrawer';
import { QuickQuoteModal } from './components/QuickQuoteModal';
import { ServiceBookingModal } from './components/ServiceBookingModal';

import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { CustomBuildView } from './views/CustomBuildView';
import { PacksView } from './views/PacksView';
import { ServicesView } from './views/ServicesView';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('inicio-presentacion');

  // Initial cart with 2 items as shown by [02] in mockup
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cpu-7800x3d',
      name: 'AMD Ryzen 7 7800X3D',
      price: 8999,
      quantity: 1,
      sku: 'CPU-ZEN4-01',
      category: 'PROCESADORES (CPU)',
      image: HARDWARE_CATALOG[0].image,
    },
    {
      id: 'ram-fury-ddr5',
      name: 'Kingston Fury Beast DDR5 32GB',
      price: 2790,
      quantity: 1,
      sku: 'MEM-DDR5-03',
      category: 'MEMORIAS RAM',
      image: HARDWARE_CATALOG[4].image,
    },
  ]);

  // Modal / Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [bookingService, setBookingService] = useState<TechService | null>(null);

  // Configurator slots
  const [slots, setSlots] = useState<ConfiguratorSlot[]>(INITIAL_CONFIGURATOR_SLOTS);
  const [slotToChange, setSlotToChange] = useState<ConfiguratorSlot | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false,
    title: '',
    message: '',
  });

  const triggerToast = (title: string, message: string) => {
    setToast({ visible: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Cart operations
  const handleAddToCart = (
    name: string,
    price: number,
    sku?: string,
    image?: string,
    category?: string
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === name);
      if (existing) {
        return prev.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: 'item-' + Date.now(),
          name,
          price,
          quantity: 1,
          sku,
          image,
          category,
        },
      ];
    });
    triggerToast('CARRITO ACTUALIZADO', `${name} ($${price.toLocaleString('es-MX')} MXN)`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    triggerToast('COMPONENTE RETIRADO', 'El artículo ha sido eliminado del pedido.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Transfer item into custom build
  const handleUseInBuild = (component: HardwareComponent) => {
    setSlots((prev) => {
      const matchingSlotIndex = prev.findIndex((s) => s.category === component.category);
      if (matchingSlotIndex !== -1) {
        const updated = [...prev];
        updated[matchingSlotIndex] = {
          ...updated[matchingSlotIndex],
          component,
        };
        return updated;
      }
      return prev;
    });
    triggerToast(
      'TRANSFERIDO A ENSAMBLE',
      `${component.name} acoplado a la matriz de diseño.`
    );
  };

  // Buy a pre-configured pack
  const handleBuyPack = (pack: PrebuiltPack) => {
    handleAddToCart(
      pack.name,
      pack.price,
      pack.ref,
      pack.image,
      'PACK PREDETERMINADO'
    );
    setIsCartOpen(true);
  };

  // Customize a pack in the builder
  const handleCustomizePack = (pack: PrebuiltPack) => {
    // If the pack has specific matching parts in catalog, find and set them
    if (pack.id === 'pack-ultra-gaming-4k') {
      const cpu = HARDWARE_CATALOG.find((c) => c.id === 'cpu-7800x3d');
      const gpu = HARDWARE_CATALOG.find((c) => c.id === 'gpu-4070s');
      if (cpu && gpu) {
        setSlots((prev) =>
          prev.map((s) => {
            if (s.category === 'cpu') return { ...s, component: cpu };
            if (s.category === 'gpu') return { ...s, component: gpu };
            return s;
          })
        );
      }
    }
    setActiveView('ensamblaje-a-medida');
    triggerToast('MATRIZ CARGADA', `Configuración base de [${pack.name}] lista para personalizar.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Slot swap from modal
  const handleSelectComponentForSlot = (slotNumber: string, newComponent: HardwareComponent) => {
    setSlots((prev) =>
      prev.map((s) => (s.slotNumber === slotNumber ? { ...s, component: newComponent } : s))
    );
    triggerToast('SLOT ACTUALIZADO', `Slot ${slotNumber} configurado con ${newComponent.name}.`);
  };

  // Proceed order from configurator
  const handleProceedBuildOrder = (total: number, partsCount: number) => {
    handleAddToCart(
      `Ensamble a Medida Certificado (${partsCount} componentes)`,
      total,
      'NC-CUSTOM-01',
      undefined,
      'ENSAMBLE A MEDIDA'
    );
    setIsCartOpen(true);
  };

  const handleShareQuote = () => {
    try {
      const buildItems: CartItem[] = slots.map((s) => ({
        id: s.slotNumber,
        name: `[SLOT ${s.slotNumber}] ${s.component.name}`,
        price: s.component.price,
        quantity: 1,
        sku: s.component.sku,
        category: s.category,
      }));
      const folio = 'NC-BUDGET-' + Math.floor(100000 + Math.random() * 900000);
      const doc = generateOrderPdf({
        items: buildItems,
        orderRef: folio,
        customerName: 'ESTACIÓN DE TRABAJO A MEDIDA',
      });
      doc.save(`NOVA_CORE_PRESUPUESTO_${folio}.pdf`);
      triggerToast('PDF DESCARGADO', `Presupuesto técnico ${folio} guardado.`);
    } catch {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        triggerToast('ENLACE COPIADO', 'Presupuesto técnico copiado al portapapeles.');
      } else {
        triggerToast('PRESUPUESTO REGISTRADO', 'Referencia técnica guardada en sesión.');
      }
    }
  };

  const handleConfirmServiceBooking = (serviceTitle: string) => {
    triggerToast('TURNO AGENDADO', `Recepción programada para ${serviceTitle}.`);
  };

  const cartTotalCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#1c1c18] flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Header */}
      <Header
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 bg-[#fcf9f2]">
        {activeView === 'inicio-presentacion' && (
          <HomeView
            onNavigate={(view) => {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {activeView === 'catalogo-de-componentes' && (
          <CatalogView
            onAddToCart={handleAddToCart}
            onUseInBuild={(comp) => {
              handleUseInBuild(comp);
            }}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {activeView === 'ensamblaje-a-medida' && (
          <CustomBuildView
            slots={slots}
            onOpenSlotPicker={(slot) => setSlotToChange(slot)}
            onProceedOrder={handleProceedBuildOrder}
            onShareQuote={handleShareQuote}
            onOpenQuickQuote={() => setIsQuickQuoteOpen(true)}
          />
        )}

        {activeView === 'packs-predeterminados' && (
          <PacksView
            onBuyPack={handleBuyPack}
            onCustomizePack={handleCustomizePack}
            onBookService={(srv) => setBookingService(srv)}
          />
        )}

        {activeView === 'servicios-tecnicos' && (
          <ServicesView
            onBookService={(srv) => setBookingService(srv)}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Sliding Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <SlotPickerModal
        slot={slotToChange}
        allSlots={slots}
        onClose={() => setSlotToChange(null)}
        onSelectComponent={handleSelectComponentForSlot}
      />

      <RulesDrawer isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <QuickQuoteModal
        isOpen={isQuickQuoteOpen}
        onClose={() => setIsQuickQuoteOpen(false)}
        onNavigateToCustomBuild={() => {
          setActiveView('ensamblaje-a-medida');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAddToCart={(name, price) => {
          handleAddToCart(name, price, 'QUICK-CFG', undefined, 'COTIZACIÓN RÁPIDA');
          setIsCartOpen(true);
        }}
      />

      <ServiceBookingModal
        service={bookingService}
        onClose={() => setBookingService(null)}
        onConfirm={handleConfirmServiceBooking}
      />

      {/* Floating System Toast */}
      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
      />
    </div>
  );
}
