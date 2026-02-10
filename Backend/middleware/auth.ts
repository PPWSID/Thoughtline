import type { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        // 1. ตรวนสอบจาก Authorization Header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } 
        
        // 2. ถ้าไม่มีใน Header ให้ตรวจสอบใน Cookie (ต้องใช้ cookie-parser)
        if (!token && (req as any).cookies) {
            token = (req as any).cookies.token;
        }

        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // Verify token using global jwt and SECRET_KEY
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            (req as any).user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Middleware Error:', error);
        return res.status(500).json({ error: 'Internal server error in middleware' });
    }
};

export default  {
    authMiddleware
};
