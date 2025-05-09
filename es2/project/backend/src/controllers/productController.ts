import { Request, Response } from 'express';
import { Product, PizzaOption } from '../models';
import { ProductCategory, getCategoryById } from '../types/enums';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';

/**
 * Obter todos os produtos
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('getAllProducts called');
    // Buscar todos os produtos incluindo o campo category
    const products = await Product.findAll();
    sendSuccess(res, products, 'Produtos obtidos com sucesso');
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    sendError(res, error as Error);
  }
};

/**
 * Obter produtos por categoria
 */
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('getProductsByCategory called');
    const { categoryId } = req.params;
    
    // Verificar se a categoria existe
    if (!Object.values(ProductCategory).includes(categoryId as ProductCategory)) {
      sendError(res, 'Categoria não encontrada', 400);
      return;
    }
    
    // Buscar produtos pela categoria especificada
    const products = await Product.findAll({
      where: {
        category: categoryId
      }
    });

    console.log('Products found:', products);

    if (products.length === 0) {
      sendNotFound(res, 'Nenhum produto encontrado para esta categoria');
      return;
    }

    sendSuccess(res, products, 'Produtos obtidos com sucesso');
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Obter produto por ID
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      sendNotFound(res, 'Produto não encontrado');
      return;
    }
    
    // For now, we'll assume product is not associated with a category
    const productData = product.toJSON();
    
    // Se o produto for uma pizza, buscar as opções disponíveis
    if (product.type === 'PIZZA') {
      const pizzaOptions = await PizzaOption.findAll();
      sendSuccess(res, { ...productData, availableOptions: pizzaOptions }, 'Produto obtido com sucesso');
      return;
    }
    
    sendSuccess(res, productData, 'Produto obtido com sucesso');
  } catch (error) {
    console.error('Error in getProductById:', error);
    sendError(res, error as Error);
  }
};

/**
 * Criar novo produto
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, basePrice, type, available, imageUrl, category } = req.body;
    
    // Validações básicas
    if (!name || !description || !basePrice || !type || !category) {
      sendError(res, 'Todos os campos obrigatórios devem ser preenchidos', 400);
      return;
    }
    
    // Verificar se a categoria é válida
    if (!Object.values(ProductCategory).includes(category as ProductCategory)) {
      sendError(res, 'Categoria inválida', 400);
      return;
    }
    
    const productData = {
      name,
      description,
      basePrice,
      type,
      available: available !== undefined ? available : true,
      imageUrl,
      category
    };
    
    const newProduct = await Product.create(productData);
    
    sendSuccess(res, newProduct, 'Produto criado com sucesso', 201);
  } catch (error) {
    console.error('Error in createProduct:', error);
    sendError(res, error as Error);
  }
};

/**
 * Atualizar produto existente
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, basePrice, type, available, imageUrl, category } = req.body;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      sendNotFound(res, 'Produto não encontrado');
      return;
    }
    
    // Verificar se a categoria é válida quando fornecida
    if (category && !Object.values(ProductCategory).includes(category as ProductCategory)) {
      sendError(res, 'Categoria inválida', 400);
      return;
    }
    
    // Update incluindo o campo category quando fornecido
    const updateData: any = {
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      basePrice: basePrice !== undefined ? basePrice : product.basePrice,
      type: type || product.type,
      available: available !== undefined ? available : product.available,
      imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl,
      category: category || product.category
    };
    
    await product.update(updateData);
    
    sendSuccess(res, product, 'Produto atualizado com sucesso');
  } catch (error) {
    console.error('Error in updateProduct:', error);
    sendError(res, error as Error);
  }
};

/**
 * Deletar produto
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      sendNotFound(res, 'Produto não encontrado');
      return;
    }
    
    await product.destroy();
    
    sendSuccess(res, null, 'Produto removido com sucesso');
  } catch (error) {
    sendError(res, error as Error);
  }
};