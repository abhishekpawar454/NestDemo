import { StandardResponse } from '../interfaces/interface';

export const sendResponse = <T>(
  statusCode: number,
  message: string,
  data?: T,
): StandardResponse<T> => {
  return {
    statusCode,
    message,
    data: data ?? null,
  };
};
