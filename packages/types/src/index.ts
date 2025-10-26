
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  photo: string;
  phone: string;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  bio: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  _id: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  bio: string;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}


export interface IToken {
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface IRefreshToken {
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}


export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  password: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  password: string;
}


export interface IContactRequest {
  subject: string;
  message: string;
}


export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface IErrorResponse {
  message: string;
  stack?: string;
}


import type { Request } from 'express';

export interface IAuthRequest extends Request {
  user?: IUser;
}

