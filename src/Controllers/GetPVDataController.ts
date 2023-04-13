import { CandleChartInterval_LT, CandleChartResult } from 'binance-api-node'
import { client } from '../client'
import { TNamedCandles, TNamedCandlesT } from '../types'
import {
    APIGatewayEvent,
    APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda'
import { fetchSymbolNames } from '../utils'
import { QueryStringError } from '../errors/ClientErrors'

export class GetPVDataController {
    public async allSpotSymbolNames(event: APIGatewayEvent): Promise<string[]> {
        const query = this.validate(event.queryStringParameters) // only carrying one qs "stableCoinName" which is USDT by default
        const allSpotSymbolNames = await fetchSymbolNames(query)
        const cleanNames = allSpotSymbolNames.map((name: string) => {
            return name.substring(0, name.length - 4)
        })
        return cleanNames
    }

    public async instant(event: APIGatewayEvent): Promise<TNamedCandles[]> {
        const query = this.validate(event.queryStringParameters)
        //TODO: include the querystring params that will come from frontend with customer custom options
        // to retrieve only specific tokens so, it will no longer be necessary retrieve all tokens
        // but only the ones requested by the customer -> allSymbolNames ---> symbolNames
        const symbolsNames = JSON.parse(query.symbols as string)
        const symbolsSingleNamedCandleArray: TNamedCandles[] = [] // all symbols candles at candle t0
        const symbolsSingleNamedCandle: TNamedCandles = {}
        let singleNamedCandle: CandleChartResult[]
        for (const symbolName of symbolsNames) {
            singleNamedCandle = await client.candles({
                symbol: symbolName,
                interval: `${query.interval}` as CandleChartInterval_LT,
                limit: 1,
            })
            symbolsSingleNamedCandle[symbolName] = singleNamedCandle[0]
        }
        symbolsSingleNamedCandleArray.push(symbolsSingleNamedCandle)
        return symbolsSingleNamedCandleArray
    }

    public async window(event: APIGatewayEvent): Promise<TNamedCandlesT[]> {
        const query = this.validate(event.queryStringParameters)
        const symbolsNames = JSON.parse(query.symbols as string)
        const symbolsMultipleNamedCandlesArray: TNamedCandlesT[] = [] // all symbols candles from kandle t0 to candle t0 - tlimit (number of historical candles = limit)
        const symbolsMultipleNamedCandles: TNamedCandlesT = {} //
        let multipleNamedCandles: CandleChartResult[]
        for (const symbolName of symbolsNames) {
            multipleNamedCandles = await client.candles({
                symbol: symbolName,
                interval: query.interval as CandleChartInterval_LT,
                limit: Number(query.windowLength),
            })
            symbolsMultipleNamedCandles[symbolName] = multipleNamedCandles
        }
        symbolsMultipleNamedCandlesArray.push(symbolsMultipleNamedCandles)
        return symbolsMultipleNamedCandlesArray
    }

    public validate(query: APIGatewayProxyEventQueryStringParameters | null) {
        if (!query) {
            throw new QueryStringError()
        }
        return query
    }
}
