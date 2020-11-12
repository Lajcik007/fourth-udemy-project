import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateAnnouncementRequest } from '../../requests/UpdateAnnouncementRequest'
import { updatedAnnouncement } from "../../businessLogic/announcements";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const announcementId = event.pathParameters.announcementId

  const announcementData: UpdateAnnouncementRequest = JSON.parse(event.body)

  await updatedAnnouncement(announcementId, announcementData)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 'Announcement updated successfully'
  }
}
