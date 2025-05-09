import { Request, Response } from 'express';
import { PaymentMethod } from '../models';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';
import { Op } from 'sequelize';
import { getDefaultUserId } from '../utils/defaultUser';

/**
 * Get all payment methods for the logged in user
 */
export const getUserPaymentMethods = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    
    const paymentMethods = await PaymentMethod.findAll({
      where: { userId },
      order: [['isDefault', 'DESC']]
    });
    
    return sendSuccess(res, paymentMethods, 'Métodos de pagamento obtidos com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Get a specific payment method by ID
 */
export const getPaymentMethodById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    
    const paymentMethod = await PaymentMethod.findOne({
      where: { id, userId }
    });
    
    if (!paymentMethod) {
      return sendNotFound(res, 'Método de pagamento não encontrado');
    }
    
    return sendSuccess(res, paymentMethod, 'Método de pagamento obtido com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Create a new payment method for the logged in user
 */
export const createPaymentMethod = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { type, details, isDefault } = req.body;
    
    // Validate required fields
    if (!type) {
      return sendError(res, 'Tipo de pagamento é obrigatório', 400);
    }
    
    // Validate payment method type
    const validTypes = ['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH'];
    if (!validTypes.includes(type)) {
      return sendError(res, 'Tipo de método de pagamento inválido', 400);
    }
    
    // Se não houver detalhes, criar uma descrição padrão baseada no tipo
    const paymentDetails = details || `Pagamento via ${type === 'PIX' ? 'PIX' : 'Dinheiro'}`;
    
    // If this is the first payment method or marked as default, update other payment methods
    if (isDefault) {
      await PaymentMethod.update(
        { isDefault: false }, 
        { where: { userId } }
      );
    }
    
    // Check if it's the first payment method (should be default)
    const paymentMethods = await PaymentMethod.count({ where: { userId } });
    const shouldBeDefault = paymentMethods === 0 || isDefault;
    
    const newPaymentMethod = await PaymentMethod.create({
      userId,
      type,
      details: paymentDetails,
      isDefault: shouldBeDefault
    });
    
    return sendSuccess(res, newPaymentMethod, 'Método de pagamento criado com sucesso', 201);
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Update an existing payment method
 */
export const updatePaymentMethod = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    const { type, details, isDefault } = req.body;
    
    const paymentMethod = await PaymentMethod.findOne({
      where: { id, userId }
    });
    
    if (!paymentMethod) {
      return sendNotFound(res, 'Método de pagamento não encontrado');
    }
    
    // Validate payment method type if provided
    if (type) {
      const validTypes = ['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'CASH'];
      if (!validTypes.includes(type)) {
        return sendError(res, 'Tipo de método de pagamento inválido', 400);
      }
    }
    
    // If marking as default, update other payment methods
    if (isDefault && !paymentMethod.isDefault) {
      await PaymentMethod.update(
        { isDefault: false },
        { where: { userId, id: { [Op.ne]: id } } }
      );
    }
    
    await paymentMethod.update({
      type: type || paymentMethod.type,
      details: details || paymentMethod.details,
      isDefault: isDefault !== undefined ? isDefault : paymentMethod.isDefault
    });
    
    return sendSuccess(res, paymentMethod, 'Método de pagamento atualizado com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Delete a payment method
 */
export const deletePaymentMethod = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    
    const paymentMethod = await PaymentMethod.findOne({
      where: { id, userId }
    });
    
    if (!paymentMethod) {
      return sendNotFound(res, 'Método de pagamento não encontrado');
    }
    
    const wasDefault = paymentMethod.isDefault;
    
    await paymentMethod.destroy();
    
    // If this was the default payment method, set another one as default
    if (wasDefault) {
      const anotherPaymentMethod = await PaymentMethod.findOne({
        where: { userId }
      });
      
      if (anotherPaymentMethod) {
        await anotherPaymentMethod.update({ isDefault: true });
      }
    }
    
    return sendSuccess(res, null, 'Método de pagamento excluído com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Set a payment method as default
 */
export const setDefaultPaymentMethod = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    
    const paymentMethod = await PaymentMethod.findOne({
      where: { id, userId }
    });
    
    if (!paymentMethod) {
      return sendNotFound(res, 'Método de pagamento não encontrado');
    }
    
    // Reset all payment methods to non-default
    await PaymentMethod.update(
      { isDefault: false },
      { where: { userId } }
    );
    
    // Set this payment method as default
    await paymentMethod.update({ isDefault: true });
    
    return sendSuccess(res, paymentMethod, 'Método de pagamento definido como padrão com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};