import { CandleChartInterval_LT, CandleChartResult } from 'binance-api-node'
import { client } from '../client'
import { TNamedCandles, TNamedCandlesT } from '../types'
import {
    APIGatewayEvent,
    APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda'
import { fetchTickerNames } from '../utils'
import { QueryStringError } from '../errors/ClientErrors'

export class GetPVDataController {
    public async allSpotTickerNames(event: APIGatewayEvent): Promise<string[]> {
        const query = this.validate(event.queryStringParameters) // only carrying one qs "stableCoinName" which is USDT by default
        const allSpotTickerNames = await fetchTickerNames(query)
        const cleanNames = allSpotTickerNames.map((name: string) => {
            return name.substring(0, name.length - 4)
        })
        return cleanNames
    }

    public async instant(event: APIGatewayEvent): Promise<TNamedCandles[]> {
        const query = this.validate(event.queryStringParameters)
        //TODO: include the querystring params that will come from frontend with customer custom options
        // to retrieve only specific tokens so, it will no longer be necessary retrieve all tokens
        // but only the ones requested by the customer -> allTickerNames ---> tickerNames
        const allTickerNames = await fetchTickerNames(query)
        const allSymbolsSingleNamedCandleArray: TNamedCandles[] = [] // all symbols candles at candle t0
        const allSymbolsSingleNamedCandle: TNamedCandles = {}
        let singleNamedCandle: CandleChartResult[]
        for (const tickerName of allTickerNames) {
            singleNamedCandle = await client.candles({
                symbol: tickerName,
                interval: `${query.interval}` as CandleChartInterval_LT,
                limit: 1,
            })
            allSymbolsSingleNamedCandle[tickerName] = singleNamedCandle[0]
        }
        allSymbolsSingleNamedCandleArray.push(allSymbolsSingleNamedCandle)
        return allSymbolsSingleNamedCandleArray
    }

    public async window(event: APIGatewayEvent): Promise<TNamedCandlesT[]> {
        const query = this.validate(event.queryStringParameters)
        const allTickerNames = await fetchTickerNames(query)
        const allSymbolsMultipleNamedCandlesArray: TNamedCandlesT[] = [] // all symbols candles from kandle t0 to candle t0 - tlimit (number of historical candles = limit)
        const allSymbolsMultipleNamedCandles: TNamedCandlesT = {} //
        let multipleNamedCandles: CandleChartResult[]
        for (const tickerName of allTickerNames) {
            multipleNamedCandles = await client.candles({
                symbol: tickerName,
                interval: query.interval as CandleChartInterval_LT,
                limit: Number(query.windowLength),
            })
            allSymbolsMultipleNamedCandles[tickerName] = multipleNamedCandles
        }
        allSymbolsMultipleNamedCandlesArray.push(allSymbolsMultipleNamedCandles)
        return allSymbolsMultipleNamedCandlesArray
    }

    public validate(query: APIGatewayProxyEventQueryStringParameters | null) {
        if (!query) {
            throw new QueryStringError()
        }
        return query
    }
}
