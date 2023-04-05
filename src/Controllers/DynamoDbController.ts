import { APIGatewayEvent } from 'aws-lambda'
import { client, command } from '../aws/DynamoDb'
import { ListTablesCommandOutput } from '@aws-sdk/client-dynamodb'

export class DynamoDbController {
    public async listTables(event: APIGatewayEvent): Promise<string> {
        const results = await client.send(command)
        if (results.TableNames) {
            return results.TableNames.join('\n')
        }
        return ''
    }
}
