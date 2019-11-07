import { ensureLoggedIn } from '../helpers/httpHelpers'

const buildUserRoutes = (app) => {
    app.use('/api/user', ensureLoggedIn, (req, res) => {
        res.send(req.user)
    });

}

export default buildUserRoutes