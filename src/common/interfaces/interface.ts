export interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data?: T | null;
}

export interface LoginResponse<T> {
  data?: T | null;
  token: string;
}

export interface JwtPayload {
  id: number;
  email: string;
}

export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}
