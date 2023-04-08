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
import bcryptjs from 'bcryptjs'

export class DynamoDBController {
    public async registerUser(
        event: APIGatewayEvent
    ): Promise<PutItemCommandOutput> {
        const body = this.validate(JSON.parse(event.body as string))
        const hashedPassword = await bcryptjs.hash(body.password, 12)
        const conditionExpression =
            'attribute_not_exists(email) AND attribute_not_exists(userName)'
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
                    S: hashedPassword,
                },
                passwordConf: {
                    S: hashedPassword,
                },
            },
            ReturnConsumedCapacity: 'TOTAL',
            ConditionExpression: conditionExpression,
        }
        console.log(input)
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

    public async loginUser(
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
