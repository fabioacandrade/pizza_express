import { Request, Response } from 'express';
import { 
  Order, OrderItem, OrderItemOption, Product, PizzaOption,
  Address, PaymentMethod, sequelize
} from '../models';
import { OrderStatus } from '../types/enums';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';
import { Transaction } from 'sequelize';
import { getDefaultUserId } from '../utils/defaultUser';

/**
 * Get all orders for the current user
 */
export const getUserOrders = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    
    const orders = await Order.findAll({
      where: { userId },
      include: [
        { 
          model: OrderItem, 
          as: 'items', 
          include: [
            { model: Product, as: 'product' },
            { model: OrderItemOption, as: 'options', include: [{ model: PizzaOption, as: 'option' }] }
          ] 
        },
        { model: Address, as: 'address' },
        { model: PaymentMethod, as: 'paymentMethod' }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    return sendSuccess(res, orders, 'Pedidos obtidos com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Get a specific order by ID
 */
export const getOrderById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    
    const order = await Order.findOne({
      where: { id, userId },
      include: [
        { 
          model: OrderItem, 
          as: 'items', 
          include: [
            { model: Product, as: 'product' },
            { model: OrderItemOption, as: 'options', include: [{ model: PizzaOption, as: 'option' }] }
          ] 
        },
        { model: Address, as: 'address' },
        { model: PaymentMethod, as: 'paymentMethod' }
      ]
    });
    
    if (!order) {
      return sendNotFound(res, 'Pedido não encontrado');
    }
    
    return sendSuccess(res, order, 'Pedido obtido com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Create a new order
 */
export const createOrder = async (req: Request, res: Response): Promise<Response> => {
  let transaction: Transaction | null = await sequelize.transaction();
  
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { addressId, paymentMethodId, items, deliveryFee = 5.00 } = req.body;
    
    // Validate required fields
    if (!addressId || !paymentMethodId || !items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      transaction = null;
      return sendError(res, 'Informações incompletas do pedido', 400);
    }
    
    // Verify address belongs to user
    const address = await Address.findOne({ where: { id: addressId, userId } });
    if (!address) {
      await transaction.rollback();
      transaction = null;
      return sendError(res, 'Endereço não encontrado ou não pertence ao usuário', 400);
    }
    
    // Verify payment method belongs to user
    const paymentMethod = await PaymentMethod.findOne({ where: { id: paymentMethodId, userId } });
    if (!paymentMethod) {
      await transaction.rollback();
      transaction = null;
      return sendError(res, 'Método de pagamento não encontrado ou não pertence ao usuário', 400);
    }
    
    // Calculate order total and verify items
    let total = 0;
    const validatedItems = [];
    
    for (const item of items) {
      const { productId, quantity, notes, selectedOptions } = item;
      
      if (!productId || !quantity || quantity <= 0) {
        await transaction.rollback();
        transaction = null;
        return sendError(res, 'Informações incompletas do item de pedido', 400);
      }
      
      // Get product
      const product = await Product.findByPk(productId);
      if (!product) {
        await transaction.rollback();
        transaction = null;
        return sendError(res, `Produto com ID ${productId} não encontrado`, 400);
      }
      
      // Calculate item price
      let itemPrice = product.basePrice * quantity;
      const processedOptions = [];
      
      // Process pizza options if provided
      if (product.type === 'PIZZA' && selectedOptions && Array.isArray(selectedOptions)) {
        for (const optionId of selectedOptions) {
          const option = await PizzaOption.findByPk(optionId);
          
          if (!option) {
            await transaction.rollback();
            transaction = null;
            return sendError(res, `Opção de pizza com ID ${optionId} não encontrada`, 400);
          }
          
          // Add option price
          itemPrice += option.additionalPrice * quantity;
          processedOptions.push(option);
        }
      }
      
      total += itemPrice;
      validatedItems.push({
        product,
        quantity,
        notes,
        options: processedOptions,
        price: itemPrice
      });
    }
    
    // Add delivery fee to total
    total += deliveryFee;
    
    // Create order
    const newOrder = await Order.create(
      {
        userId,
        addressId,
        paymentMethodId,
        total,
        deliveryFee,
        status: OrderStatus.RECEIVED,
        estimatedDeliveryTime: 45 // Default initial estimation in minutes
      },
      { transaction }
    );
    
    // Create order items
    for (const item of validatedItems) {
      const orderItem = await OrderItem.create(
        {
          orderId: newOrder.id,
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.basePrice,
          notes: item.notes || null
        },
        { transaction }
      );
      
      // Create order item options if any
      if (item.options && item.options.length > 0) {
        for (const option of item.options) {
          await OrderItemOption.create(
            {
              orderItemId: orderItem.id,
              pizzaOptionId: option.id
            },
            { transaction }
          );
        }
      }
    }
    
    await transaction.commit();
    transaction = null; // Set to null after commit to prevent rollback in catch block
    
    // Fetch complete order with all relations
    const completeOrder = await Order.findByPk(newOrder.id, {
      include: [
        { 
          model: OrderItem, 
          as: 'items', 
          include: [
            { model: Product, as: 'product' },
            { model: OrderItemOption, as: 'options', include: [{ model: PizzaOption, as: 'option' }] }
          ] 
        },
        { model: Address, as: 'address' },
        { model: PaymentMethod, as: 'paymentMethod' }
      ]
    });
    
    return sendSuccess(res, completeOrder, 'Pedido criado com sucesso', 201);
  } catch (error) {
    // Only roll back the transaction if it's still active
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Failed to rollback transaction:', rollbackError);
      }
    }
    return sendError(res, error as Error);
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(OrderStatus).includes(status as OrderStatus)) {
      return sendError(res, 'Status de pedido inválido', 400);
    }
    
    const order = await Order.findByPk(id);
    
    if (!order) {
      return sendNotFound(res, 'Pedido não encontrado');
    }
    
    // Update status
    await order.update({ status });
    
    // Update estimated delivery time based on status
    if (status === OrderStatus.PREPARING) {
      await order.update({ estimatedDeliveryTime: 30 });
    } else if (status === OrderStatus.OUT_FOR_DELIVERY) {
      await order.update({ estimatedDeliveryTime: 20 });
    } else if (status === OrderStatus.DELIVERED) {
      await order.update({ estimatedDeliveryTime: 0 });
    }
    
    return sendSuccess(res, order, 'Status do pedido atualizado com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    
    const order = await Order.findOne({
      where: { id, userId }
    });
    
    if (!order) {
      return sendNotFound(res, 'Pedido não encontrado');
    }
    
    // Only allow cancellation if order is still in RECEIVED status
    if (order.status !== OrderStatus.RECEIVED) {
      return sendError(res, 'Não é possível cancelar um pedido que já está em preparo ou saiu para entrega', 400);
    }
    
    // Update status to CANCELED
    await order.update({ status: OrderStatus.CANCELED });
    
    return sendSuccess(res, null, 'Pedido cancelado com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};