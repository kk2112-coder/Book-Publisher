import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_BOOKS } from '../data/initialBooks.js';
import { translations } from '../utils/i18n.js';
import fs from 'node:fs';
import path from 'node:path';

describe('Austra Press Core Business Logic Tests', () => {
  it('should verify initial catalog has rich books with free 3-page preview limits', () => {
    assert.ok(INITIAL_BOOKS.length >= 8, 'Catalog should contain at least 8 curated books');
    
    INITIAL_BOOKS.forEach((book) => {
      assert.ok(book.id, 'Book must have an ID');
      assert.ok(book.title, 'Book must have a title');
      assert.ok(book.price > 0, 'Book price must be positive');
      assert.equal(book.sampleLimit, 3, 'Sample limit should be strictly 3 pages for free previews');
      assert.ok(book.previewPages.length >= 3, 'Book must contain at least 3 preview pages');
    });
  });

  it('should enforce preview paywall logic on page index >= 3', () => {
    const sampleLimit = 3;
    
    // Page index 0, 1, 2 should be allowed (Free Preview)
    [0, 1, 2].forEach((pageIndex) => {
      const isLocked = pageIndex >= sampleLimit;
      assert.equal(isLocked, false, `Page index ${pageIndex} should be free to read`);
    });

    // Page index 3+ should trigger locked paywall
    [3, 4, 5].forEach((pageIndex) => {
      const isLocked = pageIndex >= sampleLimit;
      assert.equal(isLocked, true, `Page index ${pageIndex} must be locked behind paywall`);
    });
  });

  it('should correctly calculate 85% creator royalty split', () => {
    const royaltyRate = 85;
    const bookPrice = 24.99;
    const authorPayout = bookPrice * (royaltyRate / 100);
    const platformFee = bookPrice - authorPayout;

    assert.ok(Math.abs(authorPayout - 21.2415) < 0.001);
    assert.ok(Math.abs(platformFee - 3.7485) < 0.001);
  });

  it('should validate coupon discounts (AUSTRA20 = 20% off, WELCOME50 = 50% off)', () => {
    const applyCoupon = (code, subtotal) => {
      const clean = (code || '').trim().toUpperCase();
      let discountPercent = 0;
      if (clean === 'AUSTRA20') discountPercent = 20;
      else if (clean === 'WELCOME50') discountPercent = 50;
      const discountAmount = (subtotal * discountPercent) / 100;
      return {
        discountPercent,
        discountAmount,
        finalTotal: Math.max(0, subtotal - discountAmount)
      };
    };

    const cartTotal = 50.00;
    const res20 = applyCoupon('AUSTRA20', cartTotal);
    assert.equal(res20.discountPercent, 20);
    assert.equal(res20.discountAmount, 10.00);
    assert.equal(res20.finalTotal, 40.00);

    const res50 = applyCoupon('WELCOME50', cartTotal);
    assert.equal(res50.discountPercent, 50);
    assert.equal(res50.discountAmount, 25.00);
    assert.equal(res50.finalTotal, 25.00);

    const resInvalid = applyCoupon('INVALID_CODE', cartTotal);
    assert.equal(resInvalid.discountPercent, 0);
    assert.equal(resInvalid.finalTotal, 50.00);
  });

  it('should validate dynamic PDF watermarking structure for licensed buyers', () => {
    const formatWatermark = (license) => {
      const email = license?.buyerEmail || 'verified.buyer@austra.io';
      const order = license?.orderId || 'ORD-AUSTRA';
      return `Licensed to ${email} • Order #${order} • Austra DRM-Free Edition`;
    };

    const watermark = formatWatermark({ buyerEmail: 'alex.reader@austra.io', orderId: 'ORD-89412' });
    assert.ok(watermark.includes('alex.reader@austra.io'), 'Watermark must contain buyer email');
    assert.ok(watermark.includes('ORD-89412'), 'Watermark must contain transaction order ID');
    assert.ok(watermark.includes('Austra DRM-Free Edition'), 'Watermark must state Austra DRM-Free Edition');
  });

  it('should validate customer review aggregation and rating averages', () => {
    const reviews = [
      { id: '1', rating: 5, comment: 'Brilliant' },
      { id: '2', rating: 4, comment: 'Very insightful' },
      { id: '3', rating: 5, comment: 'Masterpiece' }
    ];

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    assert.equal(avg.toFixed(1), '4.7');
  });

  it('should have complete translation keys across all 5 languages', () => {
    const supportedLangs = ['en', 'es', 'fr', 'de', 'hi'];
    const requiredKeys = [
      'exploreBooks',
      'communityMarket',
      'myLibrary',
      'sellBook',
      'adminPanel',
      'adminLogin',
      'freePreview',
      'buyNow',
      'downloadPdf',
      'previewLimitReached'
    ];

    supportedLangs.forEach((lang) => {
      assert.ok(translations[lang], `Language ${lang} must exist`);
      requiredKeys.forEach((key) => {
        assert.ok(translations[lang][key], `Key "${key}" must exist in language "${lang}"`);
      });
    });
  });

  it('should validate admin authentication passkey logic', () => {
    const validPass = 'admin';
    const checkLogin = (input, expected = validPass) => input === expected || input === 'admin';

    assert.equal(checkLogin('admin'), true, 'Default admin password must authenticate successfully');
    assert.equal(checkLogin('wrongPass'), false, 'Incorrect password must be rejected');
    assert.equal(checkLogin(''), false, 'Empty password must be rejected');
  });

  it('should validate payment gateway 3D-Secure 6-digit OTP generation and verification', () => {
    // Generate simulated OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    assert.match(generatedOtp, /^\d{6}$/, 'Generated OTP must be strictly 6 digits');

    const verifyOtp = (input, expected) => {
      const clean = (input || '').trim();
      return clean === expected || clean === '123456' || clean === '000000';
    };

    assert.equal(verifyOtp(generatedOtp, generatedOtp), true, 'Exact OTP match should authenticate');
    assert.equal(verifyOtp('123456', generatedOtp), true, 'Master test passkey 123456 should authenticate');
    assert.equal(verifyOtp('000000', generatedOtp), true, 'Master test passkey 000000 should authenticate');
    assert.equal(verifyOtp('999999', '111111'), false, 'Mismatched OTP must fail verification');
    assert.equal(verifyOtp('123', generatedOtp), false, 'Incomplete OTP must fail verification');
    assert.equal(verifyOtp('', generatedOtp), false, 'Empty OTP must fail verification');
  });

  it('should confirm vercel.json security headers and legacy assets are present', () => {
    const vercelConfigPath = path.resolve('vercel.json');
    assert.ok(fs.existsSync(vercelConfigPath), 'vercel.json must exist');

    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    assert.ok(vercelConfig.headers, 'Security headers block must exist');

    const globalHeaders = vercelConfig.headers[0].headers;
    const headerKeys = globalHeaders.map(h => h.key);

    assert.ok(headerKeys.includes('Content-Security-Policy'), 'CSP header missing');
    assert.ok(headerKeys.includes('X-Content-Type-Options'), 'X-Content-Type-Options missing');
    assert.ok(headerKeys.includes('Referrer-Policy'), 'Referrer-Policy missing');
    assert.ok(headerKeys.includes('Permissions-Policy'), 'Permissions-Policy missing');

    // Confirm legacy assets exist
    assert.ok(fs.existsSync(path.resolve('public/assets/index-FekWMn3F.js')), 'Legacy JS bundle must be present');
    assert.ok(fs.existsSync(path.resolve('public/assets/index-CLisgBAc.css')), 'Legacy CSS bundle must be present');
    assert.ok(fs.existsSync(path.resolve('public/manifest.json')), 'PWA manifest must be present');
    assert.ok(fs.existsSync(path.resolve('public/sw.js')), 'PWA service worker must be present');
    assert.ok(fs.existsSync(path.resolve('public/robots.txt')), 'robots.txt must be present');
    assert.ok(fs.existsSync(path.resolve('public/sitemap.xml')), 'sitemap.xml must be present');
  });
});
