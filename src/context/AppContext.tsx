import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppNotification, 
  CartItem, 
  Category, 
  DeliveryMethod, 
  Offer, 
  Order, 
  OrderStatus, 
  PaymentMethod, 
  Product, 
  Service, 
  ServiceConfiguration, 
  ShopSettings, 
  UploadedFileItem, 
  UserProfile 
} from '../types';
import { 
  initialCategories, 
  initialOffers, 
  initialProducts, 
  initialSampleOrders, 
  initialServices, 
  initialShopSettings, 
  defaultUsers 
} from '../data/initialData';
import { 
  calculateCartTotals, 
  calculateProductPrice, 
  calculateServicePrice, 
  generateOrderNumber 
} from '../utils/priceCalculator';

interface AppContextType {
  // Current user & authentication
  currentUser: UserProfile;
  switchUserRole: (role: 'customer' | 'admin') => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  loginUser: (email: string, pass: string) => boolean;
  logoutUser: () => void;
  registerUser: (name: string, email: string, phone: string, address: string) => boolean;

  // Shop Settings
  shopSettings: ShopSettings;
  updateShopSettings: (settings: Partial<ShopSettings>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];

  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'createdAt'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCartProduct: (product: Product, quantity?: number) => void;
  addToCartService: (service: Service, config: ServiceConfiguration, quantity?: number) => void;
  updateCartQuantity: (itemId: string, newQty: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotals: {
    subtotal: number;
    deliveryCharge: number;
    total: number;
    isFreeDelivery: boolean;
  };
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;

  // Orders
  orders: Order[];
  placeOrder: (details: {
    customerName: string;
    phone: string;
    whatsappNumber?: string;
    deliveryMethod: DeliveryMethod;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    orderNotes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updateAdminNotes: (orderId: string, notes: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Offers
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  toggleOfferActive: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  unreadNotificationsCount: number;

  // Active View / Route state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
  trackedOrderId: string | null;
  setTrackedOrderId: (id: string | null) => void;
  deviceFrame: 'small' | 'mobile' | 'tablet' | 'full';
  setDeviceFrame: (frame: 'small' | 'mobile' | 'tablet' | 'full') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence helpers
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`mukhtar_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const saveStored = (key: string, data: any) => {
    try {
      localStorage.setItem(`mukhtar_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  // State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => 
    loadStored<UserProfile>('user', defaultUsers[0])
  );
  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => 
    loadStored<ShopSettings>('settings', initialShopSettings)
  );
  const [products, setProducts] = useState<Product[]>(() => 
    loadStored<Product[]>('products', initialProducts)
  );
  const [categories] = useState<Category[]>(initialCategories);
  const [services, setServices] = useState<Service[]>(() => 
    loadStored<Service[]>('services', initialServices)
  );
  const [cart, setCart] = useState<CartItem[]>(() => 
    loadStored<CartItem[]>('cart', [])
  );
  const [orders, setOrders] = useState<Order[]>(() => 
    loadStored<Order[]>('orders', initialSampleOrders)
  );
  const [offers, setOffers] = useState<Offer[]>(() => 
    loadStored<Offer[]>('offers', initialOffers)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() => 
    loadStored<AppNotification[]>('notifications', [
      {
        id: 'notif-1',
        userId: 'cust-demo',
        title: 'Order Status Update',
        body: 'Your Flex Printing order #MA-2026-0001 is now PRINTING.',
        orderId: 'ord-101',
        isRead: false,
        createdAt: '2026-02-10T15:10:00Z',
      },
      {
        id: 'notif-2',
        userId: 'cust-demo',
        title: 'Ramadan Special Offer!',
        body: '15% discount on all banners and flex signs above 50 sq ft.',
        isRead: false,
        createdAt: '2026-02-01T10:00:00Z',
      }
    ])
  );

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('Shop Pickup');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [deviceFrame, setDeviceFrame] = useState<'small' | 'mobile' | 'tablet' | 'full'>('mobile');

  // Sync to localStorage
  useEffect(() => saveStored('user', currentUser), [currentUser]);
  useEffect(() => saveStored('settings', shopSettings), [shopSettings]);
  useEffect(() => saveStored('products', products), [products]);
  useEffect(() => saveStored('services', services), [services]);
  useEffect(() => saveStored('cart', cart), [cart]);
  useEffect(() => saveStored('orders', orders), [orders]);
  useEffect(() => saveStored('offers', offers), [offers]);
  useEffect(() => saveStored('notifications', notifications), [notifications]);

  // Auth actions
  const switchUserRole = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(defaultUsers[1]);
      setActiveTab('admin');
    } else {
      setCurrentUser(defaultUsers[0]);
      setActiveTab('home');
    }
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...profile }));
  };

  const loginUser = (email: string, pass: string): boolean => {
    if (email.toLowerCase().includes('admin') || pass === 'admin123') {
      setCurrentUser(defaultUsers[1]);
      return true;
    }
    setCurrentUser({
      uid: 'cust-' + Date.now(),
      name: email.split('@')[0],
      email: email,
      phone: '03149958963',
      address: 'Main Bazar Umarzai',
      role: 'customer',
      createdAt: new Date().toISOString(),
    });
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(defaultUsers[0]);
    setActiveTab('home');
  };

  const registerUser = (name: string, email: string, phone: string, address: string): boolean => {
    setCurrentUser({
      uid: 'cust-' + Date.now(),
      name,
      email,
      phone,
      address,
      role: 'customer',
      createdAt: new Date().toISOString(),
    });
    return true;
  };

  // Shop Settings
  const updateShopSettings = (settings: Partial<ShopSettings>) => {
    setShopSettings(prev => ({ ...prev, ...settings }));
  };

  // Products
  const addProduct = (item: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProd: Product = {
      ...item,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Services
  const addService = (item: Omit<Service, 'id' | 'createdAt'>) => {
    const newSrv: Service = {
      ...item,
      id: 'srv-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setServices(prev => [newSrv, ...prev]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Cart
  const addToCartProduct = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.type === 'PRODUCT' && item.productId === product.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          calculatedPrice: calculateProductPrice(product.price, product.discountPrice, newQty),
        };
        return next;
      } else {
        const price = calculateProductPrice(product.price, product.discountPrice, quantity);
        const newItem: CartItem = {
          id: 'cart-prod-' + Date.now(),
          type: 'PRODUCT',
          productId: product.id,
          name: product.name,
          urduName: product.urduName,
          image: product.images[0] || '',
          unitPrice: product.discountPrice || product.price,
          quantity,
          calculatedPrice: price,
        };
        return [newItem, ...prev];
      }
    });
  };

  const addToCartService = (service: Service, config: ServiceConfiguration, quantity: number = 1) => {
    const calculatedPrice = calculateServicePrice(service.basePrice, service.priceUnit, config, quantity);
    const newItem: CartItem = {
      id: 'cart-srv-' + Date.now(),
      type: 'SERVICE',
      serviceId: service.id,
      name: service.name,
      urduName: service.urduName,
      image: service.image,
      unitPrice: service.basePrice,
      quantity,
      serviceConfig: config,
      calculatedPrice,
    };
    setCart(prev => [newItem, ...prev]);
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        let price = 0;
        if (item.type === 'PRODUCT') {
          price = item.unitPrice * newQty;
        } else if (item.serviceConfig && item.serviceId) {
          const srv = services.find(s => s.id === item.serviceId);
          if (srv) {
            price = calculateServicePrice(srv.basePrice, srv.priceUnit, item.serviceConfig, newQty);
          } else {
            price = item.unitPrice * newQty;
          }
        }
        return { ...item, quantity: newQty, calculatedPrice: price };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotals = calculateCartTotals(
    cart, 
    deliveryMethod, 
    shopSettings.deliveryCharge, 
    shopSettings.freeDeliveryThreshold
  );

  // Orders
  const placeOrder = (details: {
    customerName: string;
    phone: string;
    whatsappNumber?: string;
    deliveryMethod: DeliveryMethod;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    orderNotes?: string;
  }): Order => {
    const orderNum = generateOrderNumber(orders.length + 1);
    const allFiles: UploadedFileItem[] = [];
    cart.forEach(item => {
      if (item.serviceConfig?.uploadedFiles) {
        allFiles.push(...item.serviceConfig.uploadedFiles);
      }
    });

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      userId: currentUser.uid,
      customerName: details.customerName,
      phone: details.phone,
      whatsappNumber: details.whatsappNumber || details.phone,
      items: [...cart],
      subtotal: cartTotals.subtotal,
      deliveryCharge: cartTotals.deliveryCharge,
      totalAmount: cartTotals.total,
      paymentMethod: details.paymentMethod,
      deliveryMethod: details.deliveryMethod,
      deliveryAddress: details.deliveryAddress,
      orderNotes: details.orderNotes,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer via App',
        }
      ],
      uploadedFiles: allFiles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Trigger confirmation notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      userId: currentUser.uid,
      title: 'Order Placed Successfully!',
      body: `Your order #${orderNum} has been received. Mukhtar Ahmed will review it shortly.`,
      orderId: newOrder.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const historyEntry = {
          status,
          timestamp: new Date().toISOString(),
          note: note || `Order status updated to ${status}`,
          updatedBy: currentUser.name,
        };
        return {
          ...order,
          status,
          statusHistory: [...order.statusHistory, historyEntry],
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    }));

    // Add notification for customer
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      setNotifications(prev => [
        {
          id: 'notif-' + Date.now(),
          userId: targetOrder.userId,
          title: `Order #${targetOrder.orderNumber} Status: ${status}`,
          body: note || `Your order is now ${status}. Thank you for choosing Mukhtar Ahmed Printing Store.`,
          orderId: targetOrder.id,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev
      ]);
    }
  };

  const updateAdminNotes = (orderId: string, notes: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, adminNotes: notes, updatedAt: new Date().toISOString() } : order
    ));
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'Cancelled', reason || 'Order cancelled by customer/admin');
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId || o.orderNumber === orderId);
  };

  // Offers
  const addOffer = (item: Omit<Offer, 'id'>) => {
    const newOff: Offer = { ...item, id: 'off-' + Date.now() };
    setOffers(prev => [newOff, ...prev]);
  };

  const toggleOfferActive = (id: string) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, isActive: !o.isActive } : o));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      currentUser,
      switchUserRole,
      updateUserProfile,
      loginUser,
      logoutUser,
      registerUser,

      shopSettings,
      updateShopSettings,

      products,
      addProduct,
      updateProduct,
      deleteProduct,
      categories,

      services,
      addService,
      updateService,
      deleteService,

      cart,
      addToCartProduct,
      addToCartService,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartTotals,
      deliveryMethod,
      setDeliveryMethod,

      orders,
      placeOrder,
      updateOrderStatus,
      updateAdminNotes,
      cancelOrder,
      getOrderById,

      offers,
      addOffer,
      toggleOfferActive,

      notifications,
      markNotificationAsRead,
      unreadNotificationsCount,

      activeTab,
      setActiveTab,
      selectedProductId,
      setSelectedProductId,
      selectedServiceId,
      setSelectedServiceId,
      trackedOrderId,
      setTrackedOrderId,
      deviceFrame,
      setDeviceFrame,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
