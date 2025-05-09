import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { sendError } from '../utils/apiResponse';
import { getDefaultUserId } from '../utils/defaultUser';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware que não bloqueia mais nenhuma requisição, mas tenta obter
 * o usuário do token se fornecido para funcionalidades que dependem do usuário
 */
export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    // Inicializa req.user como undefined
    req.user = undefined;

    // Verifica se há token no cabeçalho
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        // Obtém o token do cabeçalho
        const token = authHeader.split(' ')[1];
        
        // Verifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        
        // Busca o usuário pelo ID decodificado do token
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password'] }
        });
        
        if (user) {
          // Se encontrou o usuário, adiciona à requisição
          req.user = user;
        }
      } catch (error) {
        console.log('Token inválido ou expirado, continuando sem autenticação');
        // Não retorna erro, apenas continua sem req.user
      }
    }

    // Sempre continua para o próximo middleware/controlador
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    // Ainda continua para o próximo middleware/controlador mesmo em caso de erro
    next();
  }
};