import 'source-map-support/register'

import { APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllAnnouncements } from "../../businessLogic/announcements"

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
    const items = await getAllAnnouncements()

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items
        })
    };
}
