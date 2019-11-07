import express from 'express'
import { Issuer, generators, Strategy } from 'openid-client'
import session from 'express-session'
import logger from 'morgan'
import passport from 'passport'
import cors from 'cors'

import { httpTestSession, ensureLoggedIn } from './helpers/httpHelpers'

// load the basic infos from env
const port = process.env.PORT || 4000
const host = process.env.HOST || 'http://localhost:4000'
const callbackPath = '/auth/gewv/callback'
const redirect_uri = host + callbackPath
const issuer_uri = process.env.OPENID_CLIENT_ISSUER || ''
const client_id = process.env.OPENID_CLIENT_ID || ''
const client_secret = process.env.OPENID_CLIENT_SECRET
const sessionSecret = Math.random().toString(36);

const sessionConfig = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    },
}

const main = async () => {

    const issuer = await Issuer.discover(issuer_uri)
    const client = new issuer.Client({
        client_id,
        client_secret,
        redirect_uris: [redirect_uri],
        response_types: ['code'],
    })
    const code_verifier = generators.codeVerifier();
    const app = express()

    app.use(session(sessionConfig))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(cors())

    passport.use('oidc', new Strategy({ client }, (tokenSet, userinfo, done) => {
        return done(null, userinfo);
    }))

    passport.serializeUser((user, next) => {
        next(null, user);
    });

    passport.deserializeUser((obj, next) => {
        next(null, obj);
    });

    app.use('/auth/gewv/login', passport.authenticate('oidc'));

    app.use(callbackPath,
        passport.authenticate('oidc', { failureRedirect: '/error' }),
        (req, res) => {
            res.redirect('http://localhost:3000/');
        }
    );

    app.use('/api/user', ensureLoggedIn, (req, res) => {
        res.send(req.user)
    });

    app.get('/auth/gewv/logout', async function (req, res) {
        req.logout()
        req.session.destroy((err) => {
            if (err != null) {
                res.sendStatus(500)
            }
            res.sendStatus(200)
        })
    })


    //init the server
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
}

main()

