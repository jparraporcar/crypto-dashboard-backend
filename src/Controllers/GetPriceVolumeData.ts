import { CandleChartInterval_LT, CandleChartResult } from 'binance-api-node'
import { Request, Response } from 'express'
import { client } from '../client'
import { TNamedKandle } from '../types'

export class GetPriceVolumeData {
    public static async handle(
        req: Request,
        res: Response
    ): Promise<TNamedKandle[]> {
        const { query } = req
        const prices = await client.prices()
        const allTickerNames = Object.keys(prices).filter((name) => {
            return name.substring(name.length - 4) === `${query.stableCoinName}`
        })
        const allNamedCandles: TNamedKandle[] = []
        const singleNamedCandle: TNamedKandle = {}
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
