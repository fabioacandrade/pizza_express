import { Request, Response } from 'express';
import { User, Address, PaymentMethod } from '../models';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDefaultUserId } from '../utils/defaultUser';

// Extend Express Request interface to include user property
declare module 'express' {
  interface Request {
    user?: any;
  }
}

// Função para gerar o token JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) : undefined
  });
};

/**
 * Registrar um novo usuário
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      sendError(res, 'Nome, email e senha são obrigatórios', 400);
      return;
    }

    // Verificar se o email já está sendo usado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      sendError(res, 'Este email já está sendo utilizado', 400);
      return;
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar o usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone
    });

    // Gerar token JWT
    const token = generateToken(user.id);

    sendSuccess(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token
      },
      'Usuário registrado com sucesso',
      201
    );
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Login de usuário
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      sendError(res, 'Email e senha são obrigatórios', 400);
      return;
    }

    // Buscar usuário pelo email
    const user = await User.findOne({ 
      where: { email },
      include: [
        { model: Address, as: 'addresses' },
        { model: PaymentMethod, as: 'paymentMethods' }
      ]
    });

    if (!user) {
      sendError(res, 'Email ou senha inválidos', 401);
      return;
    }

    // Validar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendError(res, 'Email ou senha inválidos', 401);
      return;
    }

    // Gerar token JWT
    const token = generateToken(user.id);

    sendSuccess(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        paymentMethods: user.paymentMethods,
        token
      },
      'Login realizado com sucesso'
    );
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Obter dados do perfil do usuário
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Se req.user não existir, usa o usuário padrão
    const userId = req?.user?.id || await getDefaultUserId();

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Address, as: 'addresses' },
        { model: PaymentMethod, as: 'paymentMethods' }
      ]
    });

    if (!user) {
      sendNotFound(res, 'Usuário não encontrado');
      return;
    }

    sendSuccess(res, user, 'Perfil do usuário obtido com sucesso');
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Atualizar dados do perfil do usuário
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { name, phone } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      sendNotFound(res, 'Usuário não encontrado');
      return;
    }

    await user.update({
      name: name || user.name,
      phone: phone !== undefined ? phone : user.phone
    });

    sendSuccess(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      'Perfil atualizado com sucesso'
    );
  } catch (error) {
    sendError(res, error as Error);
  }
};

/**
 * Alterar senha do usuário
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || await getDefaultUserId();
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      sendError(res, 'Senha atual e nova senha são obrigatórias', 400);
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      sendNotFound(res, 'Usuário não encontrado');
      return;
    }

    // Validar senha atual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      sendError(res, 'Senha atual inválida', 400);
      return;
    }

    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Atualizar senha
    await user.update({
      password: hashedPassword
    });

    sendSuccess(res, null, 'Senha alterada com sucesso');
  } catch (error) {
    sendError(res, error as Error);
  }
};