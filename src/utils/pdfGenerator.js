import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, beautifully formatted PDF for a given book with dynamic buyer watermarking.
 * @param {Object} book - Book object containing title, author, description, chapters, etc.
 * @param {Object} watermarkOptions - Buyer license metadata (buyerEmail, orderId, licenseDate)
 */
export const downloadBookPDF = (book, watermarkOptions = {}) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    const buyerEmail = watermarkOptions.buyerEmail || 'alex.reader@austra.io';
    const orderId = watermarkOptions.orderId || `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const issueDate = watermarkOptions.licenseDate || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    // --- COVER PAGE ---
    // Background dark cover
    doc.setFillColor(15, 17, 26);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Glowing border styling
    doc.setDrawColor(255, 106, 0);
    doc.setLineWidth(1.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    doc.setDrawColor(255, 150, 50);
    doc.setLineWidth(0.5);
    doc.rect(18, 18, pageWidth - 36, pageHeight - 36);

    // Publisher Tag
    doc.setTextColor(255, 120, 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('AUSTRA PRESS - OFFICIAL PUBLICATION', pageWidth / 2, 45, { align: 'center' });

    // Category
    doc.setTextColor(160, 170, 190);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`[ ${book.category?.toUpperCase() || 'GENERAL LITERATURE'} ]`, pageWidth / 2, 55, { align: 'center' });

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    const splitTitle = doc.splitTextToSize(book.title.toUpperCase(), contentWidth - 20);
    doc.text(splitTitle, pageWidth / 2, 100, { align: 'center' });

    // Subtitle / Tagline
    if (book.subtitle) {
      doc.setTextColor(210, 215, 230);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(13);
      const splitSubtitle = doc.splitTextToSize(book.subtitle, contentWidth - 20);
      doc.text(splitSubtitle, pageWidth / 2, 130, { align: 'center' });
    }

    // Horizontal Accent Line
    doc.setDrawColor(255, 106, 0);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 30, 150, pageWidth / 2 + 30, 150);

    // Author
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('Authored by', pageWidth / 2, 175, { align: 'center' });

    doc.setTextColor(255, 130, 45);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(book.author, pageWidth / 2, 187, { align: 'center' });

    // Edition & Digital DRM Watermark on Cover
    doc.setTextColor(130, 140, 160);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Digital Collector Edition  •  Authorized DRM-Free License`, pageWidth / 2, pageHeight - 38, { align: 'center' });
    doc.setTextColor(255, 150, 60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`Licensed to: ${buyerEmail}  |  Order #${orderId}  |  ${issueDate}`, pageWidth / 2, pageHeight - 31, { align: 'center' });
    doc.setTextColor(100, 110, 130);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Austra Press Cryptographic Seal ID: AP-${book.id}-${Math.floor(1000 + Math.random() * 9000)}`, pageWidth / 2, pageHeight - 24, { align: 'center' });

    // --- INSIDE PAGES ---
    // Helper function to add a standard interior page
    const addInteriorPage = (title = '') => {
      doc.addPage();
      // Clean cream/light page for reading comfort
      doc.setFillColor(252, 252, 250);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Top running header
      doc.setTextColor(130, 135, 145);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(book.title.toUpperCase(), margin, 12);
      doc.text('AUSTRA DIGITAL LIBRARY', pageWidth - margin, 12, { align: 'right' });

      doc.setDrawColor(220, 220, 225);
      doc.setLineWidth(0.3);
      doc.line(margin, 15, pageWidth - margin, 15);

      // Bottom Running License Watermark (Subtle Security Footer)
      doc.setTextColor(170, 175, 185);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.text(`Authorized copy for ${buyerEmail} • License #${orderId} • Austra Press Sovereign Edition`, margin, pageHeight - 11);

      // Bottom page number
      const pageNum = doc.getNumberOfPages();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 95, 110);
      doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 11, { align: 'right' });

      // Page Title if provided
      if (title) {
        doc.setTextColor(20, 25, 35);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(title, margin, 28);

        doc.setDrawColor(255, 106, 0);
        doc.setLineWidth(0.8);
        doc.line(margin, 31, margin + 40, 31);
      }
    };

    // Page 2: Copyright & Synopsis
    addInteriorPage('About This Edition');
    let currentY = 40;

    doc.setTextColor(70, 75, 85);
    doc.setFont('times', 'normal');
    doc.setFontSize(11);

    const descLines = doc.splitTextToSize(book.description || 'No description provided.', contentWidth);
    doc.text(descLines, margin, currentY);
    currentY += descLines.length * 6 + 15;

    // Book Metadata Box
    doc.setFillColor(243, 244, 248);
    doc.rect(margin, currentY, contentWidth, 38, 'F');
    doc.setDrawColor(225, 230, 240);
    doc.rect(margin, currentY, contentWidth, 38);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(50, 60, 80);
    doc.text('BOOK SPECIFICATIONS & SOVEREIGN LICENSE', margin + 6, currentY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Author: ${book.author}`, margin + 6, currentY + 16);
    doc.text(`Category: ${book.category || 'Literature'}`, margin + 6, currentY + 23);
    doc.text(`Published By: Austra Press Worldwide`, margin + 6, currentY + 30);

    doc.text(`Release Date: ${book.releaseDate || '2026'}`, margin + 85, currentY + 16);
    doc.text(`Licensed To: ${buyerEmail}`, margin + 85, currentY + 23);
    doc.text(`Formats: Interactive Web & DRM-Free PDF`, margin + 85, currentY + 30);

    currentY += 52;

    doc.setFont('times', 'italic');
    doc.setTextColor(110, 115, 125);
    doc.text('Copyright © 2026 Austra Press Inc. All rights reserved.', margin, currentY);
    doc.text('Purchased directly through the official Austra Publisher Marketplace.', margin, currentY + 6);

    // Page 3: Table of contents
    addInteriorPage('Table of Contents');
    currentY = 42;

    const chapters = book.chapters && book.chapters.length > 0 ? book.chapters : [
      { id: 1, title: 'Chapter 1: The First Horizon', content: book.previewPages?.[0] || 'In the dawn of our digital epoch, the borders between thought and architecture dissolved into pure light.' },
      { id: 2, title: 'Chapter 2: Signals in the Void', content: book.previewPages?.[1] || 'Echoes of distant networks resonated across the interconnected system.' },
      { id: 3, title: 'Chapter 3: Edge Architectures', content: book.previewPages?.[2] || 'Distributing intelligence transformed how civilizations constructed meaning.' },
      { id: 4, title: 'Chapter 4: The Convergence', content: 'As the final node locked into alignment, the complete paradigm materialized before them.' },
      { id: 5, title: 'Chapter 5: Endless Synthesis', content: 'Beyond the edge lay infinite possibilities for those daring enough to pioneer new frontiers.' }
    ];

    chapters.forEach((chap, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 35, 45);
      doc.text(`${chap.title}`, margin, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 125, 135);
      doc.text(`............................................................................................`, margin + 60, currentY);
      doc.text(`Ch. ${idx + 1}`, pageWidth - margin - 10, currentY, { align: 'right' });
      currentY += 12;
    });

    // Content Pages for each chapter
    chapters.forEach((chap) => {
      addInteriorPage(chap.title);
      let pageY = 42;
      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(40, 45, 55);

      const fullText = chap.content || (book.previewPages ? book.previewPages.join('\n\n') : 'Chapter text content goes here.');
      const textLines = doc.splitTextToSize(fullText, contentWidth);

      for (let i = 0; i < textLines.length; i++) {
        if (pageY > pageHeight - 25) {
          addInteriorPage(`${chap.title} (Cont.)`);
          pageY = 38;
          doc.setFont('times', 'normal');
          doc.setFontSize(11);
          doc.setTextColor(40, 45, 55);
        }
        doc.text(textLines[i], margin, pageY);
        pageY += 6;
      }
    });

    // Save PDF with AustraPress naming
    const cleanFileName = book.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`${cleanFileName}_AustraPress.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
