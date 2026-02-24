import type { Request, Response, NextFunction } from 'express';
import responebuilder from '../utils/responebuilder.js';

const userPermission = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        // ดึง Token จาก Cookie เป็นอันดับแรก
        if ((req as any).cookies && (req as any).cookies.token) {
            token = (req as any).cookies.token;
        }

        // ถ้าไม่มีใน Cookie ให้ลองดึงจาก Authorization Header ( fallback )
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return responebuilder.responseUnauthorized(res, 401, "Authorization token required", null);
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY) as any;
            (req as any).user = decoded;

            if (decoded.role !== 'user' && decoded.role !== 'admin' && decoded.role !== 'dev') {
                return responebuilder.responseUnauthorized(res, 401, "Permission denied", null);
            }

            next();
        } catch (err) {
            return responebuilder.responseUnauthorized(res, 401, "Invalid or expired token", err);
        }
    } catch (error) {
        return responebuilder.responseUnauthorized(res, 500, "Internal server error in middleware", error);
    }
};

const adminPermission = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        // ดึงจาก Cookie ก่อน
        if ((req as any).cookies && (req as any).cookies.token) {
            token = (req as any).cookies.token;
        }

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return responebuilder.responseUnauthorized(res, 401, "Authorization token required", null);
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY) as any;
            (req as any).user = decoded;

            if (decoded.role !== 'admin' && decoded.role !== 'dev') {
                return responebuilder.responseUnauthorized(res, 401, "Permission denied", null);
            }
            next();
        } catch (err) {
            return responebuilder.responseUnauthorized(res, 401, "Invalid or expired token", err);
        }
    } catch (error) {
        return responebuilder.responseUnauthorized(res, 500, "Internal server error in middleware", error);
    }
};

export default  {
    userPermission,
    adminPermission
};
