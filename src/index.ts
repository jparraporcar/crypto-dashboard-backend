import express, { Request, Response } from 'express'
import { GetPriceVolumeData } from './Controllers/GetPriceVolumeData'
const app = express()

app.get('/priceVolumeData', async (req: Request, res: Response) => {
    const data = await GetPriceVolumeData.handle(req, res)
    res.send(data)
})

app.listen(8081, () => {
    console.log('server running')
})
