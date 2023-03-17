import express, { Request, Response } from 'express'
import { GetPriceVolumeData } from './Controllers/GetPriceVolumeData'
const app = express()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// eslint-disable-next-line no-var, @typescript-eslint/no-var-requires
var cors = require('cors')

app.use(cors())

app.get('/priceVolumeData', async (req: Request, res: Response) => {
    const today = new Date()
    const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    console.log(`request received at time ${time}`)
    const data = await GetPriceVolumeData.handle(req, res)
    res.send(data)
})

app.listen(8081, () => {
    console.log('server running')
})
