export type PriceUnit = 
  | 'per_square_foot' 
  | 'per_page' 
  | 'per_design' 
  | 'per_card' 
  | 'per_stamp' 
  | 'per_piece';

export interface Product {
  id: string;
  name: string;
  urduName?: string;
  description: string;
  categoryId: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  unit: string; // piece, pack, box, ream, bottle
  images: string[];
  tags: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  urduName: string;
  icon: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ServiceOption {
  id: string;
  name: string;
  type: 'select' | 'checkbox' | 'radio' | 'dimension' | 'number';
  label: string;
  choices?: { label: string; value: string; priceAddon?: number }[];
  defaultValue?: any;
}

export interface Service {
  id: string;
  name: string;
  urduName: string;
  shortDescription: string;
  detailedDescription: string;
  categoryId: string;
  basePrice: number;
  priceUnit: PriceUnit;
  estimatedTime: string;
  options: ServiceOption[];
  requiresFileUpload: boolean;
  image: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  previewUrl?: string;
  uploadedAt: string;
}

export interface ServiceConfiguration {
  widthFeet?: number;
  heightFeet?: number;
  pages?: number;
  copies?: number;
  isColor?: boolean;
  hasLamination?: boolean;
  materialType?: string;
  designRequired?: boolean;
  paperType?: string;
  cardQuantity?: number;
  stampType?: string;
  specialInstructions?: string;
  uploadedFiles: UploadedFileItem[];
  selectedAddons?: { name: string; price: number }[];
}

export interface CartItem {
  id: string; // unique cart entry ID
  type: 'PRODUCT' | 'SERVICE';
  productId?: string;
  serviceId?: string;
  name: string;
  urduName?: string;
  image: string;
  unitPrice: number;
  quantity: number;
  serviceConfig?: ServiceConfiguration;
  calculatedPrice: number; // total for this item
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Designing' 
  | 'Printing' 
  | 'Ready for Pickup' 
  | 'Out for Delivery' 
  | 'Completed' 
  | 'Cancelled';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export type DeliveryMethod = 'Shop Pickup' | 'Home Delivery';
export type PaymentMethod = 'Cash on Delivery' | 'Cash on Shop Pickup' | 'JazzCash / EasyPaisa / Bank';

export interface Order {
  id: string;
  orderNumber: string; // e.g. MA-2026-0001
  userId: string;
  customerName: string;
  phone: string;
  whatsappNumber?: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  orderNotes?: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  uploadedFiles: UploadedFileItem[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  address: string;
  landmark: string;
  city: string;
  coordinates: { lat: number; lng: number };
  timings: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  jazzCashNumber: string;
  jazzCashTitle: string;
  easyPaisaNumber: string;
  easyPaisaTitle: string;
  bankName: string;
  bankAccountTitle: string;
  bankIban: string;
}

export interface Offer {
  id: string;
  title: string;
  urduTitle?: string;
  description: string;
  discountPercentage: number;
  code: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  orderId?: string;
  isRead: boolean;
  createdAt: string;
}
