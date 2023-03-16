import express, { Request, Response } from 'express'
import { GetPricesController } from '../Controllers/GetPricesController'

const router = express.Router()

router.get('/allRawPrices', async (req: Request, res: Response) => {
    const prices = await GetPricesController.allRaw(req, res)
    res.send(prices)
})

router.get(
    '/allPricesFilteredByStableCoin',
    async (req: Request, res: Response) => {
        const pricesFiltered =
            await GetPricesController.allFilteredByStableCoin(req, res)
        res.send(pricesFiltered)
    }
)

export default router
