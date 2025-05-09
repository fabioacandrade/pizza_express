import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { 
  Address, 
  CartItem, 
  Order, 
  OrderStatus,
  PaymentMethod, 
  Product,
  Category,
  PizzaOption,
  User,
  ApiResponse,
  AuthResponse,
  ProductCategory
} from '../types';
import { 
  categoryApi,
  productApi,
  orderApi,
  authApi
} from '../services/api';

interface AppContextType {
  // Products & Categories
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  getProductById: (id: string) => Promise<Product | undefined>;
  getProductsByCategory: (categoryId: string) => Product[];
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, selectedOptions?: PizzaOption[], notes?: string) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // Checkout
  selectedAddress: Address | null;
  selectAddress: (address: Address) => void;
  selectedPaymentMethod: PaymentMethod | null;
  selectPaymentMethod: (method: PaymentMethod) => void;
  
  // Orders
  orders: Order[];
  createOrder: (address: Address, paymentMethod: PaymentMethod) => Promise<Order | undefined>;
  getOrderById: (id: string) => Promise<Order | undefined>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  
  // UI state
  isCartOpen: boolean;
  toggleCart: () => void;
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  
  // Auth
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  user: User | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // State for orders, checkout, and UI
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authToken') !== null;
  });
  const [user, setUser] = useState<User | null>(null);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await categoryApi.getAll() as ApiResponse<Category[]>;
        const fetchedCategories = categoriesResponse.data ?? [];
        setCategories(fetchedCategories);
        
        // Set initial active category
        if (fetchedCategories.length > 0 && !activeCategory) {
          setActiveCategory(fetchedCategories[0].id);
        }
        
        // Fetch products
        const productsResponse = await productApi.getAll() as ApiResponse<Product[]>;
        const fetchedProducts = productsResponse.data ?? [];
        setProducts(fetchedProducts);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeCategory]);
  
  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Fetch user data if authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          const userResponse = await authApi.getProfile() as ApiResponse<User>;
          setUser(userResponse.data);
          
          // Fetch user orders
          const ordersResponse = await orderApi.getAll() as ApiResponse<Order[]>;
          setOrders(ordersResponse.data ?? []);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If token is invalid, log out without redirecting
          if ((error as Error).message.includes('token')) {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            setUser(null);
            setOrders([]);
          }
        }
      }
    };
    
    fetchUserData();
  }, [isAuthenticated]);
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity);
  }, 0);
  
  // Calculate cart count
  const cartCount = cart.reduce((count, item) => {
    return count + item.quantity;
  }, 0);
  
  // Authentication methods
  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password }) as AuthResponse;
    const { token, user: userData } = response;
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setUser(userData);
  };
  
  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await authApi.register({ name, email, password, phone }) as AuthResponse;
    const { token, user: userData } = response;
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setOrders([]);
  };
  
  // Cart methods
  const addToCart = (product: Product, quantity: number, selectedOptions: PizzaOption[] = [], notes?: string) => {
    // Calculate price with options
    let unitPrice = product.basePrice;
    if (selectedOptions?.length > 0) {
      selectedOptions.forEach(option => {
        unitPrice += option.additionalPrice || 0;
      });
    }
    
    // Create unique ID based on product and options
    const optionsKey = selectedOptions?.map(opt => opt.id).sort((a, b) => a.localeCompare(b)).join('-') ?? '';
    
    // Create item ID (avoiding nested template literals)
    let itemId = product.id;
    if (optionsKey) {
      itemId = itemId + '-' + optionsKey;
    }
    
    setCart(prevCart => {
      // Check if item already in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === itemId);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item
        return [...prevCart, {
          id: itemId,
          product: product,
          quantity,
          unitPrice,
          selectedOptions: selectedOptions || [],
          notes
        }];
      }
    });
    
    setIsCartOpen(true);
  };
  
  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };
  
  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  // Checkout methods
  const selectAddress = (address: Address) => {
    setSelectedAddress(address);
  };
  
  const selectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };
  
  // Order methods
  const createOrder = async (address: Address, paymentMethod: PaymentMethod): Promise<Order | undefined> => {
    try {
      // Format cart items for the API
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        notes: item.notes ?? '',
        selectedOptions: item.selectedOptions?.map(opt => opt.id) || []
      }));
      
      const orderData = {
        addressId: address.id,
        // Se o método de pagamento for temporário (com id = 'new'), usar um valor padrão que o backend possa aceitar
        // Em uma implementação real, deveríamos criar o método de pagamento antes
        paymentMethodId: paymentMethod.id !== 'new' ? paymentMethod.id : 'default',
        items: orderItems,
        total: cartTotal
      };
      
      console.log('Sending order data:', orderData);
      
      const response = await orderApi.create(orderData) as ApiResponse<Order>;
      const newOrder = response.data;
      
      // Update orders list
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      // Clear cart after successful order
      clearCart();
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return undefined;
    }
  };
  
  const getOrderById = async (id: string): Promise<Order | undefined> => {
    try {
      const response = await orderApi.getById(id) as ApiResponse<Order>;
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      return undefined;
    }
  };
  
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    try {
      await orderApi.updateStatus(orderId, status);
      
      // Update local orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  
  const cancelOrder = async (orderId: string): Promise<void> => {
    try {
      await orderApi.cancel(orderId);
      
      // Update local orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: OrderStatus.CANCELED } : order
        )
      );
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };
  
  // Product methods
  const getProductById = async (id: string): Promise<Product | undefined> => {
    // First check if we already have the product in state
    const existingProduct = products.find(p => p.id === id);
    if (existingProduct) return existingProduct;
    
    // Otherwise fetch it from the API
    try {
      const response = await productApi.getById(id) as ApiResponse<Product>;
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return undefined;
    }
  };
  
  const getProductsByCategory = (categoryId: string): Product[] => { 
    // Handle both numeric IDs and enum string values
    return products.filter(product => {
      // Check if the categoryId is the same as product.category
      // OR if product.category is the enum value and categoryId is its numeric representation
      return product.category === categoryId || 
             (product.category === ProductCategory.PIZZAS && categoryId === '1') ||
             (product.category === ProductCategory.BEBIDAS && categoryId === '2') ||
             (product.category === ProductCategory.SOBREMESAS && categoryId === '3') ||
             (product.category === ProductCategory.COMBOS && categoryId === '4');
    });
  };
  
  // UI methods
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };
  
  const value = {
    products,
    categories,
    isLoading,
    getProductById,
    getProductsByCategory,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal,
    cartCount,
    selectedAddress,
    selectAddress,
    selectedPaymentMethod,
    selectPaymentMethod,
    orders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    isCartOpen,
    toggleCart,
    activeCategory,
    setActiveCategory,
    isAuthenticated,
    login,
    register,
    logout,
    user
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};