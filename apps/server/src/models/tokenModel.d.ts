import mongoose, { Document } from 'mongoose';
import type { IToken, IRefreshToken } from '@noted/types';
export interface ITokenDocument extends Omit<IToken, 'userId'>, Document {
    userId: mongoose.Types.ObjectId;
}
export interface IRefreshTokenDocument extends Omit<IRefreshToken, 'userId'>, Document {
    userId: mongoose.Types.ObjectId;
}
export declare const Token: mongoose.Model<ITokenDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITokenDocument, {}, {}> & ITokenDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const RefreshToken: mongoose.Model<IRefreshTokenDocument, {}, {}, {}, mongoose.Document<unknown, {}, IRefreshTokenDocument, {}, {}> & IRefreshTokenDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=tokenModel.d.ts.map