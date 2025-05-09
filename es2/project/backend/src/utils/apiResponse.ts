import { Response } from 'express';

// Interface para padronizar as respostas da API
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Envia uma resposta de sucesso padronizada
 * @param res objeto Response do Express
 * @param data dados a serem retornados
 * @param message mensagem de sucesso opcional
 * @param statusCode código HTTP (default: 200)
 */
export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message = 'Operação realizada com sucesso',
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data
  };
  return res.status(statusCode).json(response);
};

/**
 * Envia uma resposta de erro padronizada
 * @param res objeto Response do Express
 * @param error mensagem de erro ou objeto Error
 * @param statusCode código HTTP (default: 500)
 */
export const sendError = (
  res: Response,
  error: string | Error,
  statusCode = 500
): Response => {
  const errorMessage = error instanceof Error ? error.message : error;
  const response: ApiResponse = {
    success: false,
    error: errorMessage
  };
  return res.status(statusCode).json(response);
};

/**
 * Envia uma resposta para requisição não encontrada
 * @param res objeto Response do Express
 * @param message mensagem personalizada opcional
 */
export const sendNotFound = (
  res: Response,
  message = 'Recurso não encontrado'
): Response => {
  return sendError(res, message, 404);
};