import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFlexBannerPrice,
  calculatePagePrintingPrice,
  calculateDesignPrice,
  calculateProductPrice,
  calculateCartTotals,
  isValidPakistaniPhone,
  generateOrderNumber,
  formatPKR,
} from './priceCalculator';

test('calculateFlexBannerPrice calculates standard 4x3 banner at Rs. 35/sqft for 2 pieces', () => {
  // 4 * 3 * 35 * 2 = 840
  const price = calculateFlexBannerPrice(4, 3, 35, 2);
  assert.equal(price, 840);
});

test('calculateFlexBannerPrice handles single piece and zero dimensions gracefully', () => {
  const price = calculateFlexBannerPrice(10, 2, 40, 1);
  assert.equal(price, 800);

  assert.equal(calculateFlexBannerPrice(0, 5, 35, 1), 0);
  assert.equal(calculateFlexBannerPrice(5, -2, 35, 1), 0);
});

test('calculatePagePrintingPrice calculates 20 pages B&W at Rs. 10 for 2 copies', () => {
  // 20 * 10 * 2 = 400
  const price = calculatePagePrintingPrice(20, 10, 2, false, false);
  assert.equal(price, 400);
});

test('calculatePagePrintingPrice handles color printing and lamination correctly', () => {
  // 10 pages, color (Rs. 20/page min), 1 copy, with lamination (Rs. 25/page) -> 10*20 + 10*25 = 200 + 250 = 450
  const price = calculatePagePrintingPrice(10, 5, 1, true, true);
  assert.equal(price, 450);
});

test('calculateDesignPrice adds addons correctly', () => {
  const base = 500;
  const addons = [
    { name: 'Urgent 2-Hour Delivery', price: 200 },
    { name: 'Source CDR / PSD file', price: 300 }
  ];
  assert.equal(calculateDesignPrice(base, addons), 1000);
});

test('calculateProductPrice applies discount price when available', () => {
  // HP toner normal price 6000, discounted 5500, qty 2 -> 11000
  const withDiscount = calculateProductPrice(6000, 5500, 2);
  assert.equal(withDiscount, 11000);

  // Without discount
  const normal = calculateProductPrice(1350, undefined, 3);
  assert.equal(normal, 4050);
});

test('calculateCartTotals calculates subtotal, free delivery threshold and delivery charge', () => {
  const dummyItems = [
    {
      id: 'item-1',
      type: 'PRODUCT' as const,
      name: 'Test Toner',
      image: '',
      unitPrice: 2000,
      quantity: 1,
      calculatedPrice: 2000,
    }
  ];

  // Under threshold: 2000 + 150 = 2150
  const result1 = calculateCartTotals(dummyItems, 'Home Delivery', 150, 3000);
  assert.equal(result1.subtotal, 2000);
  assert.equal(result1.deliveryCharge, 150);
  assert.equal(result1.total, 2150);
  assert.equal(result1.isFreeDelivery, false);

  // Shop pickup has 0 delivery charge
  const resultPickup = calculateCartTotals(dummyItems, 'Shop Pickup', 150, 3000);
  assert.equal(resultPickup.deliveryCharge, 0);
  assert.equal(resultPickup.total, 2000);

  // Above threshold gets free delivery
  const expensiveItems = [
    {
      id: 'item-2',
      type: 'PRODUCT' as const,
      name: 'Printer',
      image: '',
      unitPrice: 35000,
      quantity: 1,
      calculatedPrice: 35000,
    }
  ];
  const resultFree = calculateCartTotals(expensiveItems, 'Home Delivery', 150, 3000);
  assert.equal(resultFree.deliveryCharge, 0);
  assert.equal(resultFree.total, 35000);
  assert.equal(resultFree.isFreeDelivery, true);
});

test('isValidPakistaniPhone validates standard Pakistani mobile numbers', () => {
  assert.equal(isValidPakistaniPhone('03149958963'), true);
  assert.equal(isValidPakistaniPhone('0314-9958963'), true);
  assert.equal(isValidPakistaniPhone('+923149958963'), true);
  assert.equal(isValidPakistaniPhone('923149958963'), true);
  assert.equal(isValidPakistaniPhone('03001234567'), true);

  // Invalid numbers
  assert.equal(isValidPakistaniPhone('12345'), false);
  assert.equal(isValidPakistaniPhone('0213456789'), false); // landline
  assert.equal(isValidPakistaniPhone('abcdefghijk'), false);
});

test('generateOrderNumber generates clean year-padded format', () => {
  const currentYear = new Date().getFullYear();
  assert.equal(generateOrderNumber(1), `MA-${currentYear}-0001`);
  assert.equal(generateOrderNumber(42), `MA-${currentYear}-0042`);
});

test('formatPKR formats currency cleanly', () => {
  assert.equal(formatPKR(1500), 'Rs. 1,500');
});
