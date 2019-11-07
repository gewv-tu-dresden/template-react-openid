import passport from 'passport'

const buildAuthRoutes = (app, callbackPath) => {

    app.use('/auth/gewv/login', passport.authenticate('oidc'));

    app.use(callbackPath,
        passport.authenticate('oidc', { failureRedirect: '/error' }),
        (req, res) => {
            res.redirect('http://localhost:3000/');
        }
    );

    app.get('/auth/gewv/logout', async function (req, res) {
        req.logout()
        req.session.destroy((err) => {
            if (err != null) {
                res.sendStatus(500)
            }
            res.sendStatus(200)
        })
    })

}

export default buildAuthRoutes