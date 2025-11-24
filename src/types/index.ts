import { Timestamp } from "firebase/firestore";

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: number;
  updatedAt: number;
}

export interface CategoryProduct {
  id?: string;
  name: {en: string, fr: string};
  description?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CharmCategory {
  id?: string;
  name: {en: string, fr: string};
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Charm {
  id?: string;
  name: string;
  image?: string;
  price: number;
  categoryId: string;
  isActive: boolean;
  stock: number | 0;
  minStock: number | 0;
  providerId: string;
  providerRef: string;
  createdAt: number;
  updatedAt: number;
}

export interface ProductDetail {
  name: { en: string, fr: string};
  values: string[];
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  images: string[];
  isActive: boolean;
  stock: number | 0;
  minStock: number | 0;
  details: ProductDetail[];
  createdAt: number;
  updatedAt: number;
}

export interface Clasp {
  id?: string;
  isActive: boolean;
  name: string;
  image: string;
  stock: number;
  minStock: number;
  createdAt: number;
  updatedAt: number;
}

export interface Order {
  id?: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: "pending" | "succeeded" | "failed" | "canceled" | "cash";
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  comment: string;
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  productId: string;
  productQuantity: number;
  selectedCharms: CharmSelection[];
  totalPrice: number;
}

export interface MinimalOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  productQuantity: number;
  selectedCharms?: MinimalOrderItem[];
}

export interface CharmSelection {
  charmId: string;
  charmQuantity: number;
}

export interface PromoCode {
  id?: string;
  label: string;
  deliveryFree:boolean;
  reduction: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EventPromotion {
  id?: string;
  isActive: boolean;
  pourcentage: number;
  startDate: number;
  endDate: number;
}