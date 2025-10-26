import { Request } from 'express';
import { IUserDocument } from '../models/userModel';
export interface AuthRequest extends Request {
    user?: IUserDocument;
}
declare const protect: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export default protect;
//# sourceMappingURL=authMiddleware.d.ts.map