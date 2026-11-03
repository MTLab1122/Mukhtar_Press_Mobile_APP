import { CartItem, DeliveryMethod, Order, ServiceConfiguration } from '../types';

/**
 * Price Calculator Engine for Mukhtar Ahmed Printing & Computer Store
 */

export function calculateFlexBannerPrice(
  widthFeet: number,
  heightFeet: number,
  pricePerSquareFoot: number,
  quantity: number = 1
): number {
  if (widthFeet <= 0 || heightFeet <= 0 || pricePerSquareFoot <= 0 || quantity <= 0) {
    return 0;
  }
  const squareFeet = widthFeet * heightFeet;
  return Math.round(squareFeet * pricePerSquareFoot * quantity);
}

export function calculatePagePrintingPrice(
  pages: number,
  pricePerPage: number,
  copies: number = 1,
  isColor: boolean = false,
  hasLamination: boolean = false
): number {
  if (pages <= 0 || pricePerPage <= 0 || copies <= 0) {
    return 0;
  }
  // Color multiplier typically 3x-4x in Pakistan local printing, or specific addon
  let ratePerPage = pricePerPage;
  if (isColor && pricePerPage < 15) {
    // If base price was B&W (e.g. Rs. 5), color is Rs. 20
    ratePerPage = Math.max(pricePerPage * 3, 20);
  }
  let basePrice = pages * ratePerPage * copies;
  if (hasLamination) {
    // Lamination per page usually Rs. 20-30
    basePrice += pages * copies * 25;
  }
  return Math.round(basePrice);
}

export function calculateDesignPrice(
  basePrice: number,
  addons: { name: string; price: number }[] = []
): number {
  const addonsTotal = addons.reduce((sum, a) => sum + (a.price || 0), 0);
  return Math.round((basePrice || 0) + addonsTotal);
}

export function calculateServicePrice(
  basePrice: number,
  priceUnit: string,
  config: ServiceConfiguration,
  quantity: number = 1
): number {
  switch (priceUnit) {
    case 'per_square_foot': {
      const w = config.widthFeet || 1;
      const h = config.heightFeet || 1;
      const q = quantity || config.copies || 1;
      let price = calculateFlexBannerPrice(w, h, basePrice, q);
      if (config.designRequired) {
        price += 300; // Rs. 300 basic flex composing charge if customer needs design
      }
      return price;
    }
    case 'per_page': {
      const pages = config.pages || 1;
      const copies = config.copies || quantity || 1;
      return calculatePagePrintingPrice(
        pages,
        basePrice,
        copies,
        config.isColor,
        config.hasLamination
      );
    }
    case 'per_design': {
      let total = basePrice;
      if (config.selectedAddons && config.selectedAddons.length > 0) {
        total += config.selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
      }
      return Math.round(total * (quantity || 1));
    }
    case 'per_card': {
      // Visiting cards or PVC cards
      const count = config.cardQuantity || quantity || 100;
      return Math.round(basePrice * count);
    }
    case 'per_stamp': {
      let price = basePrice * (quantity || 1);
      if (config.stampType === 'Self Inking / Shiny') {
        price += 400; // addon for automatic self-inking mechanism
      }
      return Math.round(price);
    }
    case 'per_piece':
    default: {
      let price = basePrice * (quantity || 1);
      if (config.selectedAddons && config.selectedAddons.length > 0) {
        price += config.selectedAddons.reduce((acc, curr) => acc + curr.price, 0);
      }
      return Math.round(price);
    }
  }
}

export function calculateProductPrice(
  price: number,
  discountPrice?: number,
  quantity: number = 1
): number {
  const effectivePrice = (discountPrice && discountPrice > 0 && discountPrice < price)
    ? discountPrice
    : price;
  return Math.round(effectivePrice * Math.max(1, quantity));
}

export function calculateCartTotals(
  items: CartItem[],
  deliveryMethod: DeliveryMethod,
  standardDeliveryFee: number = 150,
  freeDeliveryThreshold: number = 3000
) {
  const subtotal = items.reduce((sum, item) => sum + item.calculatedPrice, 0);
  
  let deliveryCharge = 0;
  if (deliveryMethod === 'Home Delivery') {
    if (subtotal > 0 && subtotal >= freeDeliveryThreshold) {
      deliveryCharge = 0;
    } else {
      deliveryCharge = standardDeliveryFee;
    }
  }

  const total = subtotal + deliveryCharge;

  return {
    subtotal,
    deliveryCharge,
    total,
    isFreeDelivery: deliveryMethod === 'Home Delivery' && subtotal >= freeDeliveryThreshold,
  };
}

export function formatPKR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function generateOrderNumber(counter: number = 1): string {
  const year = new Date().getFullYear();
  const padded = String(counter).padStart(4, '0');
  return `MA-${year}-${padded}`;
}

export function isValidPakistaniPhone(phone: string): boolean {
  // Accepts formats like: 03149958963, 0314-9958963, +923149958963, 923149958963, 03001234567
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const pkRegex = /^((\+92)|(0092)|(92)|(0))?3[0-9]{9}$/;
  return pkRegex.test(cleaned);
}

export function normalizePakistaniPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+92')) return '0' + cleaned.substring(3);
  if (cleaned.startsWith('0092')) return '0' + cleaned.substring(4);
  if (cleaned.startsWith('92')) return '0' + cleaned.substring(2);
  return cleaned;
}

export function generateWhatsAppOrderUrl(
  whatsappPhone: string,
  order: Partial<Order>
): string {
  const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('0')
    ? '92' + cleanPhone.substring(1)
    : cleanPhone;

  const itemsList = (order.items || [])
    .map((item, idx) => {
      let details = '';
      if (item.type === 'SERVICE' && item.serviceConfig) {
        const parts: string[] = [];
        if (item.serviceConfig.widthFeet && item.serviceConfig.heightFeet) {
          parts.push(`${item.serviceConfig.widthFeet}x${item.serviceConfig.heightFeet} ft`);
        }
        if (item.serviceConfig.pages) {
          parts.push(`${item.serviceConfig.pages} pages, ${item.serviceConfig.copies || 1} copies`);
        }
        if (item.serviceConfig.cardQuantity) {
          parts.push(`${item.serviceConfig.cardQuantity} cards`);
        }
        if (item.serviceConfig.stampType) {
          parts.push(item.serviceConfig.stampType);
        }
        if (parts.length > 0) {
          details = ` (${parts.join(', ')})`;
        }
      }
      return `${idx + 1}. ${item.name}${details} x ${item.quantity} = ${formatPKR(item.calculatedPrice)}`;
    })
    .join('\n');

  const message = [
    `*Assalam-o-Alaikum, I want to place an order.*`,
    ``,
    `*Order Number:* ${order.orderNumber || 'New Order'}`,
    `*Name:* ${order.customerName || 'Customer'}`,
    `*Phone:* ${order.phone || ''}`,
    `*Delivery Method:* ${order.deliveryMethod || 'Shop Pickup'}`,
    order.deliveryAddress ? `*Delivery Address:* ${order.deliveryAddress}` : '',
    ``,
    `*Items:*`,
    itemsList,
    ``,
    `*Subtotal:* ${formatPKR(order.subtotal || 0)}`,
    `*Delivery Charges:* ${formatPKR(order.deliveryCharge || 0)}`,
    `*Total Amount:* ${formatPKR(order.totalAmount || 0)}`,
    `*Payment Method:* ${order.paymentMethod || 'Cash on Shop Pickup'}`,
    order.orderNotes ? `\n*Special Notes:* ${order.orderNotes}` : '',
    ``,
    `_Sent from Mukhtar Printing & Store App (Main Bazar Umarzai)_`
  ]
    .filter(line => line !== '')
    .join('\n');

  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
}
