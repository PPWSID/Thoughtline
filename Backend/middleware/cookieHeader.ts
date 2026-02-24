import type { Request, Response, NextFunction } from 'express';
import responebuilder from '../utils/responebuilder.js';

const cookieHeader = (req: Request, res: Response, next: NextFunction) => {
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        const cookies: Record<string, string> = {};
        cookieHeader.split(';').forEach((cookie: string) => {
            const parts = cookie.split('=');
            const name = parts[0]?.trim();
            if (name) {
                cookies[name] = parts.slice(1).join('=');
            }
        });
        req.cookies = cookies;
    } else {
        req.cookies = {};
    }
    next();
}

export default  {
    cookieHeader,
};
