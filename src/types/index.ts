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
  displayOrder: number;
  name: {en: string, fr: string};
  description?: string;
  isActive: boolean;
  properties: {
    useClasp: boolean,
    useCharms: boolean,
    minAmountCharm: number,
    canBeMixed: boolean,
  }
  createdAt: number;
  updatedAt: number;
}

export interface CharmCategory {
  id?: string;
  displayOrder: number;
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
  matterId: string;
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

export interface ProductDetailSelection {
  id: number;
  idValue: number;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  matterId: string;
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
  matterId: string;
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
  
  paymentStatus: "pending" | "succeeded" | "failed" | "canceled" | "pod";
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  comment: string;
  createdAt: number;
  updatedAt: number;

  //Gestion des prix
  productPrice: number;
  totalAmount: number;
  finalPrice: number;

  // Gestion des frais et réductions
  deliveryPrice: number;
  reduction: number;
}

export interface OrderItem {
  productIds: string[];
  productQuantity: number;
  productDetailsSelection?: ProductDetailSelection[];
  selectedCharms: CharmSelection[];
  selectedClasp?: string;
  totalPrice: number;
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
  pourcentage: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface EventPromotion {
  id?: string;
  label: {fr: string, en: string};
  isActive: boolean;
  value: number;
  appliedOnProducts: boolean;
  promotedCategories: string[];
  appliedOnFinalProduct: boolean;
  pourcentage: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Schedule {
  id?: string;
  // Détails Client
  name: string;
  tel: string;
  email: string;
  // Détails rdv
  date: number;
  startHour: string;
  endHour: string;
  type: string;
  // Status Rdv
  isConfirmed: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Matter {
  id?: string;
  name: {en: string, fr: string};
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Composition {
  id?: string;
  name: string;
  products: string[];
  categoryId: string;
  matterId: string;
  mixedProducts: boolean;
  clasp?: Clasp;
  selectedCharms: CharmSelection[];
  totalPrice: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}