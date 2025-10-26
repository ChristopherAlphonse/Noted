import mongoose, { Document } from 'mongoose';
import type { IUser } from '@noted/types';
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    _id: mongoose.Types.ObjectId;
}
declare const User: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=userModel.d.ts.map