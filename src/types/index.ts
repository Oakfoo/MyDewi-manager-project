export interface Customer {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryProduct {
  id?: string;
  name: {en: string, fr: string};
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharmCategory {
  id?: string;
  name: {en: string, fr: string};
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Charm {
  id?: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  categoryId: string;
  isActive: boolean;
  stock: number;
  minStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  categoryId: string;
  images: string[];
  isActive: boolean;
  stock: number;
  minStock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id?: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  selectedCharms: CharmSelection[];
  totalPrice: number;
}

export interface CharmSelection {
  charmId: string;
  quantity: number;
}