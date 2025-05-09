import { User } from '../models';

// ID de usuário padrão para usar quando a autenticação for desativada
let defaultUserId: string | null = null;

/**
 * Obtém ou cria um usuário padrão para uso quando a autenticação está desativada
 */
export const getDefaultUserId = async (): Promise<string> => {
  // Se já tivermos um ID de usuário padrão em cache, retorne-o
  if (defaultUserId) {
    return defaultUserId;
  }

  try {
    // Tenta encontrar o primeiro usuário no sistema
    const user = await User.findOne();
    
    if (user) {
      // Se encontrou um usuário, usa seu ID
      defaultUserId = user.id;
    } else {
      // Se não encontrou nenhum usuário, cria um usuário padrão
      const newUser = await User.create({
        name: 'Usuário Padrão',
        email: 'default@pizzaexpress.com',
        password: 'senha_hash_padrão_123', // Não é necessário hash já que não será usado para autenticação
        phone: '(00) 00000-0000'
      });
      
      defaultUserId = newUser.id;
    }
    
    return defaultUserId;
  } catch (error) {
    console.error('Erro ao obter/criar usuário padrão:', error);
    // Retorna um ID padrão em caso de erro
    return '00000000-0000-0000-0000-000000000000';
  }
};