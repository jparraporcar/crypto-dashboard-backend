import { APIGatewayEvent, Context } from 'aws-lambda'
import { GetPriceVolumeData } from './Controllers/GetPriceVolumeData'
import { TNamedCandles } from './types'

module.exports.handler = async (event: APIGatewayEvent, context: Context) => {
    let data: TNamedCandles[]
    const today = new Date()
    const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    console.log(`request received at time ${time}`)
    try {
        const data = await GetPriceVolumeData.handle(event)
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        }
    } catch (err: any) {
        console.log('error', err)
        if (err.code === -1003) {
            setTimeout(async () => {
                console.log('waiting 20s to send next request')
                data = await GetPriceVolumeData.handle(event)
                return {
                    statusCode: 200,
                    body: JSON.stringify(data),
                }
            }, 20000)
        } else {
            if (err.code === 'ENOTFOUND') {
                setTimeout(async () => {
                    console.log('waiting 5min to send next request')
                    data = await GetPriceVolumeData.handle(event)
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data),
                    }
                }, 300000)
            }
        }
    }
}
