import { Request, Response, NextFunction } from 'express';
interface ErrorWithStatus extends Error {
    statusCode?: number;
}
declare const errorHandler: (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorMiddleware.d.ts.map