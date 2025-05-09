import { Request, Response } from 'express';
import { PizzaOption } from '../models';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';

/**
 * Obter todas as opções de pizza
 */
export const getAllPizzaOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const pizzaOptions = await PizzaOption.findAll();
    sendSuccess(res, pizzaOptions, 'Opções de pizza obtidas com sucesso');
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Obter opções de pizza por tipo
 */
export const getPizzaOptionsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    
    // Validar o tipo
    const validTypes = ['SIZE', 'DOUGH', 'CRUST', 'EXTRA'];
    if (!validTypes.includes(type)) {
      sendError(res, 'Tipo de opção inválido', 400);
      return;
    }
    
    const pizzaOptions = await PizzaOption.findAll({
      where: { type }
    });
    
    sendSuccess(res, pizzaOptions, `Opções de ${type} obtidas com sucesso`);
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Obter opção de pizza por ID
 */
export const getPizzaOptionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const pizzaOption = await PizzaOption.findByPk(id);
    
    if (!pizzaOption) {
      sendNotFound(res, 'Opção de pizza não encontrada');
      return;
    }
    
    sendSuccess(res, pizzaOption, 'Opção de pizza obtida com sucesso');
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Criar nova opção de pizza
 */
export const createPizzaOption = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, additionalPrice } = req.body;
    
    // Validações
    if (!name || !type) {
      sendError(res, 'Nome e tipo são obrigatórios', 400);
      return;
    }
    
    // Validar o tipo
    const validTypes = ['SIZE', 'DOUGH', 'CRUST', 'EXTRA'];
    if (!validTypes.includes(type)) {
      sendError(res, 'Tipo de opção inválido', 400);
      return;
    }
    
    const newPizzaOption = await PizzaOption.create({
      name,
      type,
      additionalPrice: additionalPrice || 0
    });
    
    sendSuccess(res, newPizzaOption, 'Opção de pizza criada com sucesso', 201);
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Atualizar opção de pizza existente
 */
export const updatePizzaOption = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, type, additionalPrice } = req.body;
    
    const pizzaOption = await PizzaOption.findByPk(id);
    
    if (!pizzaOption) {
      sendNotFound(res, 'Opção de pizza não encontrada');
      return;
    }
    
    // Validar o tipo se foi fornecido
    if (type) {
      const validTypes = ['SIZE', 'DOUGH', 'CRUST', 'EXTRA'];
      if (!validTypes.includes(type)) {
        sendError(res, 'Tipo de opção inválido', 400);
        return;
      }
    }
    
    await pizzaOption.update({
      name: name || pizzaOption.name,
      type: type || pizzaOption.type,
      additionalPrice: additionalPrice !== undefined ? additionalPrice : pizzaOption.additionalPrice
    });
    
    sendSuccess(res, pizzaOption, 'Opção de pizza atualizada com sucesso');
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Deletar opção de pizza
 */
export const deletePizzaOption = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const pizzaOption = await PizzaOption.findByPk(id);
    
    if (!pizzaOption) {
      sendNotFound(res, 'Opção de pizza não encontrada');
      return;
    }
    
    await pizzaOption.destroy();
    
    sendSuccess(res, null, 'Opção de pizza removida com sucesso');
  } catch (error) {
    sendError(res, error as Error);
  }
};