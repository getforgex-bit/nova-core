import { jsPDF } from 'jspdf';
import { CartItem } from '../types';

export interface OrderPdfOptions {
  items: CartItem[];
  orderRef?: string;
  customerName?: string;
}

export function generateOrderPdf({
  items,
  orderRef,
  customerName = 'USUARIO LAB CERTIFICADO',
}: OrderPdfOptions): jsPDF {
  const folio = orderRef || 'NC-ORD-' + Math.floor(100000 + Math.random() * 900000);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. TOP BLACK TECHNICAL BAR
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, pageWidth, 12, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.text('NOVA CORE // HARDWARE LAB [SYS.24]', margin, 7.5);
  doc.text('HOJA DE RESUMEN TÉCNICO & ORDEN DE COMPRA', pageWidth - margin, 7.5, { align: 'right' });

  // 2. BRAND & HEADER BLOCK
  let currentY = 22;

  // Blue Accent box
  doc.setFillColor(0, 80, 204); // #0050cc
  doc.rect(margin, currentY, 14, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('NC', margin + 7, currentY + 9, { align: 'center' });

  // Brand Titles
  doc.setTextColor(17, 17, 17);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('NOVA CORE', margin + 18, currentY + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('HIGH PERFORMANCE COMPUTING & HARDWARE ENGINEERING // ESTÁNDAR SUIZO', margin + 18, currentY + 11);

  // Folio box on top-right
  doc.setFillColor(246, 243, 236);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.3);
  doc.rect(pageWidth - margin - 58, currentY - 2, 58, 16, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('FOLIO DE CONTROL:', pageWidth - margin - 55, currentY + 3);

  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 80, 204);
  doc.text(folio, pageWidth - margin - 55, currentY + 9);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  doc.text(dateStr, pageWidth - margin - 55, currentY + 13);

  // 3. METADATA CARDS (ORDER SPECIFICATION)
  currentY += 22;

  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(252, 249, 242);
  doc.rect(margin, currentY, contentWidth, 20, 'FD');

  const colWidth = contentWidth / 3;

  // Col 1: Cliente & Destino
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('TITULAR / DESTINATARIO', margin + 4, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text(customerName.toUpperCase(), margin + 4, currentY + 10);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('CUENTA CERTIFICADA • PRIVILEGIOS LAB', margin + 4, currentY + 15);

  // Col 2: Alianza & Trazabilidad
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('ORIGEN DE COMPONENTES', margin + colWidth + 4, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text('GRUPO CVA / INTCOMEX OFICIAL', margin + colWidth + 4, currentY + 10);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 80, 204);
  doc.text('TRAZABILIDAD S/N REGISTRADA', margin + colWidth + 4, currentY + 15);

  // Col 3: Estado & Garantía
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('ESTADO DE LA ORDEN', margin + colWidth * 2 + 4, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(17, 17, 17);
  doc.text('COLA DE ENSAMBLE / VALIDACIÓN', margin + colWidth * 2 + 4, currentY + 10);
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('GARANTÍA DIRECTA 12 MESES', margin + colWidth * 2 + 4, currentY + 15);

  // Divider lines inside metadata box
  doc.setDrawColor(220, 220, 220);
  doc.line(margin + colWidth, currentY, margin + colWidth, currentY + 20);
  doc.line(margin + colWidth * 2, currentY, margin + colWidth * 2, currentY + 20);

  // 4. ITEMS TABLE HEADER
  currentY += 26;

  doc.setFillColor(17, 17, 17);
  doc.rect(margin, currentY, contentWidth, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(7);

  const colSku = margin + 3;
  const colDesc = margin + 32;
  const colQty = margin + 118;
  const colUnit = margin + 138;
  const colTotal = margin + 164;

  doc.text('SKU / CAT', colSku, currentY + 4.8);
  doc.text('DESCRIPCIÓN DEL COMPONENTE DE HARDWARE', colDesc, currentY + 4.8);
  doc.text('CANT', colQty, currentY + 4.8);
  doc.text('P. UNITARIO', colUnit, currentY + 4.8);
  doc.text('TOTAL (MXN)', colTotal, currentY + 4.8);

  currentY += 7;

  // 5. TABLE ROWS
  let subtotal = 0;
  let totalItemsCount = 0;

  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    totalItemsCount += item.quantity;

    const rowHeight = 9;
    const isEven = index % 2 === 0;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 246, isEven ? 255 : 241);
    doc.rect(margin, currentY, contentWidth, rowHeight, 'F');

    // Bottom hairline
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    // SKU
    doc.setFont('courier', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(0, 80, 204);
    const skuText = item.sku || (item.category ? item.category.toUpperCase() : `HW-0${index + 1}`);
    doc.text(skuText.substring(0, 16), colSku, currentY + 5.5);

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    const trimmedName = item.name.length > 48 ? item.name.substring(0, 48) + '...' : item.name;
    doc.text(trimmedName, colDesc, currentY + 5.5);

    // Quantity
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text(String(item.quantity).padStart(2, '0'), colQty + 2, currentY + 5.5);

    // Unit Price
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    doc.text(`$${item.price.toLocaleString('es-MX')}`, colUnit, currentY + 5.5);

    // Row Total
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(17, 17, 17);
    doc.text(`$${itemTotal.toLocaleString('es-MX')}`, colTotal, currentY + 5.5);

    currentY += rowHeight;
  });

  // Table outer border
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.3);
  doc.rect(margin, currentY - items.length * 9 - 7, contentWidth, items.length * 9 + 7);

  // 6. TOTALS & FINANCIAL SUMMARY BLOCK
  currentY += 8;

  const iva = Math.round(subtotal * 0.16);
  const total = subtotal; // Already includes IVA or standard net pricing in MXN

  // Left column: Swiss Quality Certificate & Technical Notice
  const leftColWidth = contentWidth * 0.55;
  const rightColWidth = contentWidth * 0.42;
  const rightColX = margin + contentWidth - rightColWidth;

  doc.setFillColor(246, 243, 236);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.3);
  doc.rect(margin, currentY, leftColWidth, 42, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(17, 17, 17);
  doc.text('[CERTIFICACIÓN & PROTOCOLO DE LABORATORIO]', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(60, 60, 60);
  doc.text('• Montaje bajo norma antiestática ESD y torque dynamométrico ISO.', margin + 4, currentY + 12);
  doc.text('• Prueba continua de estrés de voltaje y estabilidad térmica.', margin + 4, currentY + 17);
  doc.text('• Flasheo a la última versión de microcódigo UEFI/BIOS estable.', margin + 4, currentY + 22);
  doc.text('• Cotización con validez contractual de 72 horas hábiles.', margin + 4, currentY + 27);

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 80, 204);
  doc.text('INGENIERÍA VALIDADA // NOVA CORE HARDWARE LAB MEXICO', margin + 4, currentY + 36);

  // Right column: Financial Summary
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.3);
  doc.rect(rightColX, currentY, rightColWidth, 42, 'FD');

  let finY = currentY + 6;
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('UNIDADES TOTALES:', rightColX + 4, finY);
  doc.setTextColor(17, 17, 17);
  doc.text(`${totalItemsCount} UDS`, rightColX + rightColWidth - 4, finY, { align: 'right' });

  finY += 7;
  doc.setTextColor(100, 100, 100);
  doc.text('SUBTOTAL HARDWARE:', rightColX + 4, finY);
  doc.setTextColor(17, 17, 17);
  doc.text(`$${(subtotal - iva).toLocaleString('es-MX')} MXN`, rightColX + rightColWidth - 4, finY, { align: 'right' });

  finY += 7;
  doc.setTextColor(100, 100, 100);
  doc.text('I.V.A. (16% TRASLADADO):', rightColX + 4, finY);
  doc.setTextColor(17, 17, 17);
  doc.text(`$${iva.toLocaleString('es-MX')} MXN`, rightColX + rightColWidth - 4, finY, { align: 'right' });

  finY += 4;
  doc.setDrawColor(17, 17, 17);
  doc.line(rightColX + 4, finY, rightColX + rightColWidth - 4, finY);

  finY += 7;
  // Total Box
  doc.setFillColor(17, 17, 17);
  doc.rect(rightColX + 2, finY - 4, rightColWidth - 4, 12, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.text('TOTAL AUTORIZADO:', rightColX + 5, finY + 3.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(179, 197, 255); // #b3c5ff
  doc.text(`$${total.toLocaleString('es-MX')} MXN`, rightColX + rightColWidth - 5, finY + 3.5, { align: 'right' });

  // 7. SWISS GRID FOOTER & SIGNATURE AREA
  currentY += 50;

  // Signatures
  doc.setDrawColor(180, 180, 180);
  doc.line(margin + 10, currentY + 12, margin + 70, currentY + 12);
  doc.line(pageWidth - margin - 70, currentY + 12, pageWidth - margin - 10, currentY + 12);

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 100, 100);
  doc.text('AUTORIZACIÓN TÉCNICA LAB', margin + 40, currentY + 16, { align: 'center' });
  doc.text('FIRMA / CONFORMIDAD CLIENTE', pageWidth - margin - 40, currentY + 16, { align: 'center' });

  // Bottom Footer Bar
  doc.setDrawColor(17, 17, 17);
  doc.setLineWidth(0.4);
  doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  doc.text('NOVA CORE // HARDWARE LAB • GUADALAJARA HIGH-TECH INDUSTRIAL PARK • CERTIFICACIÓN ISO 9001:2015', margin, pageHeight - 9);
  doc.text('DOCUMENTO GENERADO EN TIEMPO REAL • ORIGINAL PARA CLIENTE', pageWidth - margin, pageHeight - 9, { align: 'right' });

  return doc;
}
