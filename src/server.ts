import express from 'express'
import { Issuer } from 'openid-client'
import session from 'express-session'
import logger from 'morgan'
import passport from 'passport'
import cors from 'cors'

import buildAuthRoutes from './routes/auth'
import buildUserRoutes from './routes/user'
import preparePassport from './helpers/passportHelpers'

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

    // initialize the open id client
    const issuer = await Issuer.discover(issuer_uri)
    const client = new issuer.Client({
        client_id,
        client_secret,
        redirect_uris: [redirect_uri],
        response_types: ['code'],
    })
    const app = express()

    // prepare express to use passport for auth
    app.use(session(sessionConfig))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(cors()) // TODO: Check if that is necassary
    preparePassport(client)

    // build all the shiny new routes
    buildAuthRoutes(app, callbackPath)
    buildUserRoutes(app)

    //init the server
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
}

main()

