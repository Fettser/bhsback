const express = require('express')
const cors = require('cors')
const secretKey = process.env.SECRET_KEY || '6LdXcwUhAAAAAJpbiR3gN63n8qvY_PoGKZBU-_T2'
const axios = require('axios')

const app = express()

corsOptions = {
    origin: 'https://bearheadstudio.ru'
}

app.use(express.json({extended: true}))

app.use(cors(corsOptions))

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

app.listen(3000, '0.0.0.0', () => console.log('server works'))