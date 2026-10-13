// Webshop Types

// ─── Authentication & User ───────────────────────────────────────────────

export interface WebshopUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  contactPersonId?: string; // Link to ATLAS contact
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: WebshopUser | null;
  loading: boolean;
  error: string | null;
}

// ─── Products ────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  price: number;
  condition: string;
  grade: string;
  gradingCompany?: string;
  quantity: number;
  images?: string[] | null;
  cardImage?: string | null;
  category: string;
  productType: string;
  isFeatured?: boolean;
  isGraded?: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  grade: string;
  condition: string;
}

// ─── Cart Holds ──────────────────────────────────────────────────────────

export type CartHoldStatus = 'ACTIVE' | 'RELEASED' | 'EXPIRED' | 'PURCHASED';

export interface CartHold {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productPrice: number;
  heldAt: string;
  expiresAt: string;
  releasedAt?: string;
  status: CartHoldStatus;
  releaseReason?: string;
}

// ─── Orders ──────────────────────────────────────────────────────────────

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  grade: string;
  condition: string;
}

export interface WebshopOrder {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  
  shippingFirstName: string;
  shippingLastName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone?: string;
  
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ─── Checkout Flow ──────────────────────────────────────────────────────

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface CheckoutData {
  shippingAddress: CheckoutAddress;
  usePersonalAddress: boolean; // If true, unchanged from contact
  differenceAddress?: CheckoutAddress; // If not using personal
}
