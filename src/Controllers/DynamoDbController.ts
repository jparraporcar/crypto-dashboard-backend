import { APIGatewayEvent } from 'aws-lambda'
import { client } from '../aws/DynamoDb'
import {
    PutItemCommand,
    GetItemCommand,
    PutItemCommandInput,
    GetItemCommandInput,
    PutItemCommandOutput,
    GetItemCommandOutput,
} from '@aws-sdk/client-dynamodb'
import { TUserSchemaZod, userSchemaZod } from '../userSchemaZod'
import { ExistingResource, ValidationError } from '../errors/ClientErrors'

export class DynamoDBController {
    public async registerUser(
        event: APIGatewayEvent
    ): Promise<PutItemCommandOutput> {
        const body = this.validate(JSON.parse(event.body as string))
        const itemExisting = await this.getUser(event)
        if (itemExisting.Item) {
            // logic for user to be able to request a new password will be necessary
            throw new ExistingResource()
        }
        const input: PutItemCommandInput = {
            TableName: 'users',
            Item: {
                userName: {
                    S: body.userName,
                },
                email: {
                    S: body.email,
                },
                password: {
                    S: body.password,
                },
                passwordConf: {
                    S: body.passwordConf,
                },
            },
            ReturnConsumedCapacity: 'TOTAL',
        }
        const command = new PutItemCommand(input)
        const response = await client.send(command)
        return response
    }

    public validate(body: TUserSchemaZod): TUserSchemaZod {
        const zodRes = userSchemaZod.parse({
            userName: body.userName,
            email: body.email,
            password: body.password,
            passwordConf: body.passwordConf,
        })
        if (
            !zodRes.userName ||
            !zodRes.email ||
            !zodRes.password ||
            !zodRes.passwordConf
        ) {
            throw new ValidationError()
        } else {
            return zodRes
        }
    }

    public async getUser(
        event: APIGatewayEvent
    ): Promise<GetItemCommandOutput> {
        const body = this.validate(JSON.parse(event.body as string))
        const input: GetItemCommandInput = {
            TableName: 'users',
            Key: {
                userName: { S: body.userName },
                email: { S: body.email },
            },
        }
        const command = new GetItemCommand(input)
        const response = await client.send(command)
        return response
    }
}
