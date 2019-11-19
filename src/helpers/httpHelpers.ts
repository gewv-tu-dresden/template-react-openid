import { Request, Response } from 'express'

export function ensureLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.sendStatus(404)
}

export function httpTestSession(req: Request, res: Response): Boolean {
    if (req.session == null) {
        res.sendStatus(500)
        return false
    }

    return true
}