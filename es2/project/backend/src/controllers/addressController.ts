import { Request, Response } from 'express';
import { Address } from '../models';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';
import { Op } from 'sequelize';
import { getDefaultUserId } from '../utils/defaultUser';

/**
 * Get all addresses for the logged in user
 */
export const getUserAddresses = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    
    const addresses = await Address.findAll({
      where: { userId },
      order: [['isDefault', 'DESC']]
    });
    
    return sendSuccess(res, addresses, 'Endereços obtidos com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Get a specific address by ID
 */
export const getAddressById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    
    const address = await Address.findOne({
      where: { id, userId }
    });
    
    if (!address) {
      return sendNotFound(res, 'Endereço não encontrado');
    }
    
    return sendSuccess(res, address, 'Endereço obtido com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Create a new address for the logged in user
 */
export const createAddress = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const {
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      isDefault
    } = req.body;
    
    // Validate required fields
    if (!street || !number || !neighborhood || !city || !state || !zipCode) {
      return sendError(res, 'Todos os campos obrigatórios devem ser preenchidos', 400);
    }
    
    // If this is the first address or marked as default, update other addresses
    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId } }
      );
    }
    
    // Check if it's the first address (should be default)
    const addresses = await Address.count({ where: { userId } });
    const shouldBeDefault = addresses === 0 || isDefault;
    
    const newAddress = await Address.create({
      userId,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      isDefault: shouldBeDefault
    });
    
    return sendSuccess(res, newAddress, 'Endereço criado com sucesso', 201);
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Update an existing address
 */
export const updateAddress = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    const {
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      isDefault
    } = req.body;
    
    const address = await Address.findOne({
      where: { id, userId }
    });
    
    if (!address) {
      return sendNotFound(res, 'Endereço não encontrado');
    }
    
    // If marking as default, update other addresses
    if (isDefault && !address.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId, id: { [Op.ne]: id } } }
      );
    }
    
    await address.update({
      street: street || address.street,
      number: number || address.number,
      complement: complement !== undefined ? complement : address.complement,
      neighborhood: neighborhood || address.neighborhood,
      city: city || address.city,
      state: state || address.state,
      zipCode: zipCode || address.zipCode,
      isDefault: isDefault !== undefined ? isDefault : address.isDefault
    });
    
    return sendSuccess(res, address, 'Endereço atualizado com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    
    const address = await Address.findOne({
      where: { id, userId }
    });
    
    if (!address) {
      return sendNotFound(res, 'Endereço não encontrado');
    }
    
    const wasDefault = address.isDefault;
    
    await address.destroy();
    
    // If this was the default address, set another one as default
    if (wasDefault) {
      const anotherAddress = await Address.findOne({
        where: { userId }
      });
      
      if (anotherAddress) {
        await anotherAddress.update({ isDefault: true });
      }
    }
    
    return sendSuccess(res, null, 'Endereço excluído com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { id } = req.params;
    
    const address = await Address.findOne({
      where: { id, userId }
    });
    
    if (!address) {
      return sendNotFound(res, 'Endereço não encontrado');
    }
    
    // Reset all addresses to non-default
    await Address.update(
      { isDefault: false },
      { where: { userId } }
    );
    
    // Set this address as default
    await address.update({ isDefault: true });
    
    return sendSuccess(res, address, 'Endereço definido como padrão com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};