import { Request, Response } from 'express'
import { client } from '../client'

type ResponseBody = { [key: string]: string }

export class GetAllPricesAction {
    public async handle(req: Request, res: Response): Promise<ResponseBody> {
        const prices = await client.prices()
        return prices
    }
}
