import 'source-map-support/register';
import * as AWS from "aws-sdk";

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import {parseUserId} from "../../auth/utils";

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const userIdIndex = process.env.USER_ID_INDEX;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    const data = await docClient
        .query({
            TableName: todosTable,
            IndexName : userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': parseUserId(jwtToken)
            }
        })
        .promise();

    const items = data.Items;

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items
        })
    };
}
