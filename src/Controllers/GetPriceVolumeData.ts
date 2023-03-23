import { CandleChartInterval_LT, CandleChartResult } from 'binance-api-node'
import { Request, Response } from 'express'
import { client } from '../client'
import { TNamedCandles } from '../types'

export class GetPriceVolumeData {
    public static async handle(
        req: Request,
        res: Response
    ): Promise<TNamedCandles[]> {
        const { query } = req
        const prices = await client.prices()
        const allTickerNames = Object.keys(prices).filter((name) => {
            return name.substring(name.length - 4) === `${query.stableCoinName}`
        })
        const allNamedCandles: TNamedCandles[] = []
        const singleNamedCandle: TNamedCandles = {}
        let singleCandle: CandleChartResult[]
        for (const tickerName of allTickerNames) {
            singleCandle = await client.candles({
                symbol: `${tickerName}`,
                interval: `${query.interval}` as CandleChartInterval_LT,
                limit: 1,
            })
            singleNamedCandle[`${tickerName}`] = singleCandle[0]
        }
        allNamedCandles.push(singleNamedCandle)
        return allNamedCandles
    }
}
