import mongoose, { Document, Schema } from 'mongoose';
import type { IToken, IRefreshToken } from '@noted/types';

// Token for password reset
export interface ITokenDocument extends Omit<IToken, 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const tokenSchema = new Schema<ITokenDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Refresh token for authentication
export interface IRefreshTokenDocument extends Omit<IRefreshToken, 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const refreshTokenSchema = new Schema<IRefreshTokenDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Index for automatic cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Token = mongoose.model<ITokenDocument>('Token', tokenSchema);
export const RefreshToken = mongoose.model<IRefreshTokenDocument>('RefreshToken', refreshTokenSchema);

