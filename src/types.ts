import { CandleChartResult } from 'binance-api-node'

export type TObject = { [key: string]: string }

export type TNamedCandles = { [key: string]: CandleChartResult }

export type TNamedCandlesT = { [key: string]: CandleChartResult[] }

export type LambdaResponse = {
    statusCode: number
    headers: any
    body: string
}
