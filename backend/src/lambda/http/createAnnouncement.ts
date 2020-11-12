import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateAnnouncementRequest } from '../../requests/CreateAnnouncementRequest'
import { getUserId } from "../utils";
import { createAnnouncement } from "../../businessLogic/announcements";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newAnnouncement: CreateAnnouncementRequest = JSON.parse(event.body);
  const userId = getUserId(event)

  const newItem = await createAnnouncement(newAnnouncement, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
