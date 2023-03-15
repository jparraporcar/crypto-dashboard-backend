import express, { Request, Response } from 'express'
import { GetAllPricesAction } from './actions/GetAllPricesAction'

const app = express()

app.get('/rawPrices', async (req: Request, res: Response) => {
    const prices = await new GetAllPricesAction().handle(req, res)
    res.send(prices)
})

app.listen(8000, () => {
    console.log('server listening...')
})
