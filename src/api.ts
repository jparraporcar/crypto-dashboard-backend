import { APIGatewayEvent, Context } from 'aws-lambda'
import { GetPVDataController } from './Controllers/GetPVDataController'
import { TNamedCandles, TNamedCandlesT } from './types'
import { DynamoDBController } from './Controllers/DynamoDbController'
import { BinanceError, UnknownError } from './errors/ServerErrors'
import { ExistingResource } from './errors/ClientErrors'

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
        console.log(err)
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
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(data),
        }
        console.log(response)
        return response
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
            // Connection error thrown error
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
        await new DynamoDBController().registerUser(event)
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: 'USER_REGISTERED',
        }
        console.log(response)
        return response
    } catch (err: any) {
        console.log(err)
        if (err.name === 'ConditionalCheckFailedException') {
            // DynamoDB thrown error
            const newError = new ExistingResource()
            const response = {
                statusCode: newError.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(newError),
            }
            return response
        } else {
            const newError = new UnknownError()
            const response = {
                statusCode: newError.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(newError),
            }
            return response
        }
    }
}

module.exports.loginUser = async (event: APIGatewayEvent, context: Context) => {
    try {
        const token = await new DynamoDBController().loginUser(event)
        const response = {
            statusCode: 200,
            headers: corsHeaders,
            body: { message: 'USER_LOGGEDIN', token: token },
        }
        console.log(response)
        return response
    } catch (err: any) {
        console.log(err)
        if (err.name === 'ResourceNotFoundException') {
            // DynamoDB thrown error
            const newError = new ExistingResource('The user does not exist')
            const response = {
                statusCode: newError.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(newError),
            }
            console.log(response)
            return response
            // user trying to login with wrong credentials
        } else if (err.name === 'AUTHENTICATION_ERROR') {
            const response = {
                statusCode: err.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(err),
            }
            console.log(response)
            return response
        }
    }
}

// TODO: handle other typde of errors in the register/login workflow like connection errors...
