const express = require('express')
const axios = require('axios')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const secretKey = process.env.SECRET_KEY || '6LdXcwUhAAAAAJpbiR3gN63n8qvY_PoGKZBU-_T2'
const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || '0.0.0.0'

const app = express()

const corsOptions = {
    origin: 'https://bearheadstudio.ru'
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP address',
    standardHeaders: true,
    legacyHeaders: false
})

app.use(express.json({extended: true}))

app.use(cors(corsOptions))

app.use(limiter)

app.post('/api/form', async function (req, res, next) {
    try {
        if (!req.body.captcha) {
            return res.status(403).json({message: 'Forbidden'})
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`

        const verifyResponse = await axios.get(verifyUrl)

        if (!verifyResponse.data.success || verifyResponse.data.score < 0.4) {
            return res.status(403).json({message: 'Forbidden'})
        }

        const formsResponse = await axios('https://secret-retreat-07359.herokuapp.com/https://docs.google.com/forms/u/0/d/e/1FAIpQLSePcjg6mT-g_KgcIVJaVZN12ZguLcQS6t8sQmYjAGJ05Ehlyw/formResponse', {
            method: 'POST',
            data: req.body.formBody,
            headers: {
                'Origin': 'https://safe-stream-23201.herokuapp.com',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        if (formsResponse.status === 200) {
            return res.status(200).json({message: formsResponse.statusText})
        } else {
            return res.status(formsResponse.status).json(formsResponse.statusText)
        }
    } catch (e) {
        return res.status(500).json({message: e.message, body: req.body})
    }
})

app.listen(PORT, HOST, () => console.log('server works'))