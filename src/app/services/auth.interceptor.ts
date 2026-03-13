import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('token') || localStorage.getItem('shipperToken');
    const userId = localStorage.getItem('userId');

    const headers: Record<string, string> = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
        headers['X-User-Id'] = userId;
    }

    if (Object.keys(headers).length > 0) {
        const authReq = req.clone({ setHeaders: headers });
        return next(authReq);
    }

    return next(req);
};
