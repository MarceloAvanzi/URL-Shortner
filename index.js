require('./database/db_connection')
const express = require('express')
const mongoose = require('mongoose')
const shortid = require('shortid')

const app = express()
const PORT = 3333

const urlSchema = new mongoose.Schema({
    shortUrl: {type: String, required: true},
    longUrl: {type: String, required: true},
    counter: {type: Number, default: 1}
})

const url = mongoose.model('url', urlSchema)
   
app.use(express.json());

app.post('/api/shortner', async (req, res) => {
    const {longUrl} = req.body;

    if(!longUrl) {
        res.status(400).json({message: "Please provide a valid url"})
    }

    const shortUrl = shortid.generate()

    try {
        const urlExists = await url.findOne({longUrl})

        if(urlExists) {
            urlExists.counter++
            urlExists.save()
        } else {
            const url2 = new url({shortUrl, longUrl})
            await url2.save()
        }

        res.json({shortUrl})
    } catch (error) {
        console.error(error)
        res.status(400)
    }
})

app.get('/api/:shortUrl', async (req, res) => {
    const {shortUrl} = req.params
    
    if (!shortUrl) {
        res.status(400).json({message: "Please provide a valid url"})
    }

    try {
        const url2 = await url.findOne({shortUrl})

        console.log(url2)
        res.send(url2)
    } catch {
        res.status(400)
    }
})

app.get('/top5', async (req, res) => {
    try {
        const topUrls = await url.find().sort({counter: -1}).limit(5)

        res.json(topUrls)
    } catch {
        res.status(500)
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
