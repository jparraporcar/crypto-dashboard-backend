import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy'
import axios from 'axios'

export const fetchTickerNames = async (
    query: APIGatewayProxyEventQueryStringParameters
) => {
    const exchangeInfo = await axios.get(
        'https://api.binance.com/api/v3/exchangeInfo?permissions=SPOT'
    )
    const symbols: string[] = exchangeInfo.data.symbols.map((el: any) =>
        el.symbol.toUpperCase()
    )
    const allTickerNames = symbols.filter((name: string) => {
        return (
            name.substring(name.length - 4) ===
            `${query.stableCoinName!.toUpperCase()}`
        )
    })
    return allTickerNames
}
