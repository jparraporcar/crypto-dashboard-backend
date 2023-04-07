import { APIGatewayEvent, Context } from 'aws-lambda'
import { GetPVDataController } from './Controllers/GetPVDataController'
import { TNamedCandles, TNamedCandlesT } from './types'
import { DynamoDBController } from './Controllers/DynamoDbController'
import { BinanceError } from './errors/ServerErrors'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
}

module.exports.multiplePVData = async (
    event: APIGatewayEvent,
    context: Context
) => {
    let data: TNamedCandles[]
    const today = new Date()
    const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    console.log(`request received at time ${time} at endpoint multiplePVData`)
    try {
        const data = await new GetPVDataController().instant(event)
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(data),
        }
        console.log(response)
        return response
    } catch (err: any) {
        if (err.code === -1003) {
            setTimeout(async () => {
                console.log('waiting 20s to send next request')
                data = await new GetPVDataController().instant(event)
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                }
            }, 20000)
        } else if (err.code === -1120) {
            const binanceError = new BinanceError(-1120)
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify(binanceError),
            }
        } else if (err.code === 'ENOTFOUND') {
            setTimeout(async () => {
                console.log('waiting 5min to send next request')
                data = await new GetPVDataController().instant(event)
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                }
            }, 300000)
        } else {
            const unknownError = new Error('UNKNOWN_ERROR')
            return {
                statusCode: err.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(unknownError),
            }
        }
    }
}

module.exports.multiplePVDataWindow = async (
    event: APIGatewayEvent,
    context: Context
) => {
    let data: TNamedCandlesT[]
    const today = new Date()
    const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    console.log(
        `request received at time ${time} at endpoint /multiplePVDataWindow`
    )
    try {
        const data = await new GetPVDataController().window(event)
        console.log(
            'Payload size:',
            new TextEncoder().encode(JSON.stringify(data)).length
        )
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(data),
        }
    } catch (err: any) {
        console.log(err)
        if (err.code === -1003) {
            setTimeout(async () => {
                console.log('waiting 20s to send next request')
                data = await new GetPVDataController().window(event)
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                }
            }, 20000)
        } else if (err.code === -1120) {
            const binanceError = new BinanceError(-1120)
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify(binanceError),
            }
        } else if (err.code === 'ENOTFOUND') {
            setTimeout(async () => {
                console.log('waiting 5min to send next request')
                data = await new GetPVDataController().window(event)
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                }
            }, 300000)
        } else {
            const unknownError = new Error('UNKNOWN_ERROR')
            return {
                statusCode: err.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(unknownError),
            }
        }
    }
}

module.exports.registerUser = async (
    event: APIGatewayEvent,
    context: Context
) => {
    try {
        // first check if gmail already || userName already exists in the DB
        // if user already exists then throw a ClientError 'user already exists
        // otherwise create token and deliver to the user
        const res = await new DynamoDBController().registerUser(event)
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(res),
        }
        console.log(response)
        return response
    } catch (err) {
        const response = {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify(err),
        }
        console.log(response)
        return response
    }
}
