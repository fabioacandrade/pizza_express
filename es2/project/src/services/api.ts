// API base configuration
import { ApiResponse, AuthResponse, Category, Product, PizzaOption, User, Order, Address, PaymentMethod } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Generic fetch function for API calls with error handling
 */
export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Parse JSON response
    const data = await response.json();

    console.log('data', data);
    
    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * API service for categories
 */
export const categoryApi = {
  getAll: () => apiFetch<Category[]>('/categories'),
  getById: (id: string) => apiFetch<Category>(`/categories/${id}`),
};

/**
 * API service for products
 */
export const productApi = {
  getAll: () => apiFetch<Product[]>('/products'),
  getByCategory: (categoryId: string) => apiFetch<Product[]>(`/products/category/${categoryId}`),
  getById: (id: string) => apiFetch<Product>(`/products/${id}`),
  create: (product: { 
    name: string; 
    description: string; 
    basePrice: number; 
    type: 'PIZZA' | 'DRINK' | 'DESSERT' | 'OTHER'; 
    available: boolean; 
    imageUrl: string; 
    category: string 
  }) => apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id: string, product: { 
    name?: string; 
    description?: string; 
    basePrice?: number; 
    type?: 'PIZZA' | 'DRINK' | 'DESSERT' | 'OTHER'; 
    available?: boolean; 
    imageUrl?: string; 
    category?: string 
  }) => apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id: string) => apiFetch<{ success: boolean }>(`/products/${id}`, {
    method: 'DELETE',
  }),
};

/**
 * API service for pizza options
 */
export const pizzaOptionApi = {
  getAll: () => apiFetch<PizzaOption[]>('/pizza-options'),
  getByType: (type: string) => apiFetch<PizzaOption[]>(`/pizza-options/type/${type}`),
  create: (option: { name: string; type: 'SIZE' | 'DOUGH' | 'CRUST' | 'EXTRA'; additionalPrice: number }) => 
    apiFetch<PizzaOption>('/pizza-options', {
      method: 'POST',
      body: JSON.stringify(option),
    }),
  update: (id: string, option: { name?: string; type?: 'SIZE' | 'DOUGH' | 'CRUST' | 'EXTRA'; additionalPrice?: number }) => 
    apiFetch<PizzaOption>(`/pizza-options/${id}`, {
      method: 'PUT',
      body: JSON.stringify(option),
    }),
  delete: (id: string) => 
    apiFetch<{ success: boolean }>(`/pizza-options/${id}`, {
      method: 'DELETE',
    }),
};

/**
 * API service for authentication and user management
 */
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    apiFetch<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (userData: { name: string; email: string; password: string; phone?: string }) =>
    apiFetch<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  getProfile: () => apiFetch<User>('/users/profile'),
  
  updateProfile: (userData: { name?: string; phone?: string }) =>
    apiFetch<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

/**
 * API service for address management
 */
export const addressApi = {
  getAll: () => apiFetch<Address[]>('/addresses'),
  getById: (id: string) => apiFetch<Address>(`/addresses/${id}`),
  create: (address: { 
    street: string; 
    number: string; 
    complement?: string; 
    neighborhood: string; 
    city: string; 
    state: string; 
    zipCode: string 
  }) =>
    apiFetch<Address>('/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),
  update: (id: string, address: { 
    street?: string; 
    number?: string; 
    complement?: string; 
    neighborhood?: string; 
    city?: string; 
    state?: string; 
    zipCode?: string 
  }) =>
    apiFetch<Address>(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/addresses/${id}`, {
      method: 'DELETE',
    }),
  setDefault: (id: string) =>
    apiFetch<Address>(`/addresses/${id}/set-default`, {
      method: 'PUT',
    }),
};

/**
 * API service for payment methods
 */
export const paymentMethodApi = {
  getAll: () => apiFetch<PaymentMethod[]>('/payment-methods'),
  getById: (id: string) => apiFetch<PaymentMethod>(`/payment-methods/${id}`),
  create: (paymentMethod: { 
    type: string; 
    details?: string;
    name?: string; 
    cardNumber?: string; 
    expiryDate?: string; 
    cvv?: string 
  }) =>
    apiFetch<PaymentMethod>('/payment-methods', {
      method: 'POST',
      body: JSON.stringify(paymentMethod),
    }),
  update: (id: string, paymentMethod: { 
    type?: string; 
    details?: string;
    name?: string; 
    cardNumber?: string; 
    expiryDate?: string; 
    cvv?: string 
  }) =>
    apiFetch<PaymentMethod>(`/payment-methods/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentMethod),
    }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/payment-methods/${id}`, {
      method: 'DELETE',
    }),
  setDefault: (id: string) =>
    apiFetch<PaymentMethod>(`/payment-methods/${id}/set-default`, {
      method: 'PUT',
    }),
};

/**
 * API service for orders
 */
export const orderApi = {
  getAll: () => apiFetch<Order[]>('/orders'),
  getById: (id: string) => apiFetch<Order>(`/orders/${id}`),
  create: (order: { items: { productId: string; quantity: number }[]; total: number; addressId: string; paymentMethodId: string }) =>
    apiFetch<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  updateStatus: (id: string, status: string) =>
    apiFetch<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  cancel: (id: string) =>
    apiFetch<{ success: boolean }>(`/orders/${id}/cancel`, {
      method: 'PUT',
    }),
};