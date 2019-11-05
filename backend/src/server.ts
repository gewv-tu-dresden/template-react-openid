import express from 'express'
import { Issuer, generators } from 'openid-client'
import session from 'express-session'

// load the basic infos from env
const port = process.env.PORT || 4000
const host = process.env.HOST || 'http://localhost:4000'
const redirect_uri = host + '/auth/callback'
const issuer_uri = process.env.OPENID_CLIENT_ISSUER || ''
const client_id = process.env.OPENID_CLIENT_ID || ''
const client_secret = process.env.OPENID_CLIENT_SECRET


const sessionConfig = {
    secret: 'keyboard cat',
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

    app.get('/auth/gewv', async function (req, res) {
        console.log("Try to redirect to auth backen!")

        const redirectUrl = client.authorizationUrl({
            scope: 'openid email profile',
            resource: redirect_uri,
            code_challenge,
            code_challenge_method: 'S256',
        });

        console.log("Send user to redirect url: " + redirectUrl)
        res.redirect(redirectUrl)
    });

    app.get('/auth/callback', async function (req, res) {
        console.log("Get redirect callback!")

        const params = client.callbackParams(req);
        const tokenSet = await client.callback(redirect_uri, params, { code_verifier })
        console.log('received and validated tokens %j', tokenSet);
        console.log('validated ID Token claims %j', tokenSet.claims());

        res.redirect('http://localhost:3000/')
    })

    app.get('/auth/logout', async function (req, res) {
        console.log("Logout user!")
        if (req.session == null) res.sendStatus(404)

        req.session.destroy((err) => {
            if (err != null) console.error(err)
        })

        res.sendStatus(200)
    })


    //init the server
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
}

main()

