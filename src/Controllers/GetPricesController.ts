import { Request, Response } from 'express'
import { client } from '../client'

type ResponseBody = { [key: string]: string }

export class GetPricesController {
    public static async allRaw(
        req: Request,
        res: Response
    ): Promise<ResponseBody> {
        const prices = await client.prices()
        return prices
    }

    public static async allFilteredByStableCoin(
        req: Request,
        res: Response
    ): Promise<ResponseBody> {
        const stableCoinName = 'USDT'
        const prices = await client.prices()
        const pricesFiltered = Object.keys(prices)
            .filter((name: string) => name.includes(stableCoinName))
            .reduce((acc: any, cv) => {
                acc[cv] = prices[cv]
                return acc
            }, {})
        console.log(pricesFiltered)
        console.log(Object.keys(pricesFiltered).length)
        return pricesFiltered
    }
}
