import { CandleChartInterval_LT, CandleChartResult } from 'binance-api-node'
import { client } from '../client'
import { TNamedCandles } from '../types'
import axios from 'axios'
import { APIGatewayEvent } from 'aws-lambda'

export class GetPriceVolumeData {
    public static async handle(
        event: APIGatewayEvent
    ): Promise<TNamedCandles[]> {
        const { queryStringParameters: query } = event
        if (!query) {
            return []
        }
        const exchangeInfo = await axios.get(
            'https://api.binance.com/api/v3/exchangeInfo'
        )
        const symbols = exchangeInfo.data.symbols.map((el: any) =>
            el.symbol.toUpperCase()
        )
        const allTickerNames = symbols.filter((name: string) => {
            return (
                name.substring(name.length - 4) ===
                `${query.stableCoinName!.toUpperCase()}`
            )
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
