import express, { Request, Response } from 'express'
import { GetPriceVolumeData } from './Controllers/GetPriceVolumeData'
import { TNamedKandle } from './types'
const app = express()
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// eslint-disable-next-line no-var, @typescript-eslint/no-var-requires
var cors = require('cors')

app.use(cors())

app.get('/priceVolumeData', async (req: Request, res: Response) => {
    let data: TNamedKandle[]
    const today = new Date()
    const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    console.log(`request received at time ${time}`)
    try {
        data = await GetPriceVolumeData.handle(req, res)
        res.send(data)
    } catch (err: any) {
        console.log(err)
        if (err.code === -1003) {
            setTimeout(async () => {
                console.log('waiting 20s to send next request')
                data = await GetPriceVolumeData.handle(req, res)
                res.send(data)
            }, 20000)
        } else {
            if (err.code === 'ENOTFOUND') {
                setTimeout(async () => {
                    console.log('waiting 5min to send next request')
                    data = await GetPriceVolumeData.handle(req, res)
                    res.send(data)
                }, 300000)
            }
        }
    }
})

app.listen(8081, () => {
    console.log('server running')
})
