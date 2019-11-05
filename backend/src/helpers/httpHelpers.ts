import { Request, Response } from 'express'

export function ensureLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('http://localhost:3000/auth/login')
}

export function httpTestSession(req: Request, res: Response): Boolean {
    if (req.session == null) {
        res.sendStatus(500)
        return false
    }

    return true
}