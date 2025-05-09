/**
 * Enumeração para as categorias de produtos
 */
export enum ProductCategory {
  PIZZAS = 'PIZZAS',
  BEBIDAS = 'BEBIDAS',
  SOBREMESAS = 'SOBREMESAS',
  COMBOS = 'COMBOS'
}

/**
 * Interface para informações da categoria
 */
export interface Category {
  id: ProductCategory;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface PizzaOption {
  id: string;
  name: string;
  type: 'SIZE' | 'DOUGH' | 'CRUST' | 'EXTRA';
  additionalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  type: 'PIZZA' | 'DRINK' | 'DESSERT' | 'OTHER';
  available: boolean;
  imageUrl: string;
  category: ProductCategory;
  categoryInfo?: Category;
  availableOptions?: PizzaOption[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  notes?: string;
  selectedOptions?: PizzaOption[];
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH';
  details: string;
  isDefault?: boolean;
}

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  total: number;
  deliveryFee: number;
  estimatedDeliveryTime?: number; // in minutes
}

export interface DeliveryLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  discountType: 'PERCENTAGE' | 'FIXED_VALUE';
  discountValue: number;
  code?: string;
  startDate: string;
  endDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}