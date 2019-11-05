import express from 'express'
import { Issuer, generators } from 'openid-client'
import OpenIDConnectStrategy from 'openid-client/lib/passport_strategy'
import session from 'express-session'
import logger from 'morgan'
import passport from 'passport'

import { httpTestSession, ensureLoggedIn } from './helpers/httpHelpers'

// load the basic infos from env
const port = process.env.PORT || 4000
const host = process.env.HOST || 'http://localhost:4000'
const redirect_uri = host + '/auth/callback'
const issuer_uri = process.env.OPENID_CLIENT_ISSUER || ''
const client_id = process.env.OPENID_CLIENT_ID || ''
const client_secret = process.env.OPENID_CLIENT_SECRET
const sessionSecret = Math.random().toString(36);

const sessionConfig = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
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
    const code_challenge = generators.codeChallenge(code_verifier);
    const app = express()

    app.use(session(sessionConfig))
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use('oidc', new OpenIDConnectStrategy({ client, sessionKey: sessionSecret }, (tokenSet, profile, done) => {
        return done(null, profile);
    }))

    passport.serializeUser((user, next) => {
        next(null, user);
    });

    passport.deserializeUser((obj, next) => {
        next(null, obj);
    });

    app.use('/auth/gewv', passport.authenticate('oidc'));

    app.use('/auth/callback',
        passport.authenticate('oidc', { failureRedirect: '/error' }),
        (req, res) => {
            res.redirect('http://localhost:3000/');
        }
    );

    app.use('/profile', ensureLoggedIn, (req, res) => {
        res.render('profile', { title: 'Express', user: req.user });
    });

    app.get('/auth/logout', async function (req, res) {
        req.logout()
        req.session.destroy(() => { })
        res.redirect('http://localhost:3000/')
    })


    //init the server
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
}

main()

