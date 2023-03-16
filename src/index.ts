import express from 'express'
import priceDataRouter from './routes/PriceDataRouter'
const app = express()

app.get('/priceData', priceDataRouter)

app.listen(8000, () => {
    console.log('server listening...')
})
