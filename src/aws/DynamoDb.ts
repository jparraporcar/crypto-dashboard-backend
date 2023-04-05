import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb'
import env from '../env'

export const client = new DynamoDBClient({
    region: env.AWS_DEFAULT_REGION,
})

export const command = new ListTablesCommand({})
