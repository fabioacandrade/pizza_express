import { Request, Response } from 'express';
import { getAllCategories, getCategoryById, ProductCategory } from '../types/enums';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';

/**
 * Obter todas as categorias
 */
export const getAllCategoriesController = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const categories = getAllCategories();
    return sendSuccess(res, categories, 'Categorias obtidas com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};

/**
 * Obter categoria por ID
 */
export const getCategoryByIdController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    
    // Verificar se o ID da categoria é válido (existe no enum ProductCategory)
    if (!Object.values(ProductCategory).includes(id as ProductCategory)) {
      return sendNotFound(res, 'Categoria não encontrada');
    }
    
    const category = getCategoryById(id as ProductCategory);
    
    if (!category) {
      return sendNotFound(res, 'Categoria não encontrada');
    }
    
    return sendSuccess(res, category, 'Categoria obtida com sucesso');
  } catch (error) {
    return sendError(res, error as Error);
  }
};