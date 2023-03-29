import { APIGatewayEvent, Context } from 'aws-lambda'
import { GetPriceVolumeData } from './Controllers/GetPriceVolumeData'
import { ClientError, ServerError } from './errorTypes'
import { TNamedCandles, TNamedCandlesT } from './types'

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
        const data = await new GetPriceVolumeData().instant(event)
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(data),
        }
    } catch (err: any) {
        if (err instanceof ClientError) {
            return {
                statusCode: err.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(err),
            }
        } else if (err.code === -1003) {
            setTimeout(async () => {
                console.log('waiting 20s to send next request')
                data = await new GetPriceVolumeData().instant(event)
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                }
            }, 20000)
        } else if (err.code === -1120) {
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify(err),
            }
        } else if (err.code === 'ENOTFOUND') {
            setTimeout(async () => {
                console.log('waiting 5min to send next request')
                data = await new GetPriceVolumeData().instant(event)
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                }
            }, 300000)
        } else {
            return {
                statusCode: 500,
                body: 'unknown error',
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
        const data = await new GetPriceVolumeData().window(event)
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(data),
        }
    } catch (err: any) {
        if (err instanceof ClientError) {
            return {
                statusCode: err.statusCode,
                headers: corsHeaders,
                body: JSON.stringify(err),
            }
        } else if (err.code === -1003) {
            setTimeout(async () => {
                console.log('waiting 20s to send next request')
                data = await new GetPriceVolumeData().window(event)
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify(data),
                }
            }, 20000)
        } else if (err.code === -1120) {
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify(err),
            }
        } else {
            if (err.code === 'ENOTFOUND') {
                setTimeout(async () => {
                    console.log('waiting 5min to send next request')
                    data = await new GetPriceVolumeData().window(event)
                    return {
                        statusCode: 200,
                        headers: corsHeaders,
                        body: JSON.stringify(data),
                    }
                }, 300000)
            }
        }
    }
}
