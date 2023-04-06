import { APIGatewayEvent } from 'aws-lambda'
import { client } from '../aws/DynamoDb'
import {
    ListTablesCommandOutput,
    PutItemCommand,
    PutItemCommandInput,
} from '@aws-sdk/client-dynamodb'
import { TUserSchemaZod, userSchemaZod } from '../userSchemaZod'
import { ClientError } from '../errorTypes'

export class DynamoDBController {
    public async registerUser(event: APIGatewayEvent): Promise<any> {
        const body = this.validate(JSON.parse(event.body as string))

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
            throw new ClientError(
                'Validation error',
                'Please refresh you page and introduce inputs again'
            )
        } else {
            return zodRes
        }
    }
}
