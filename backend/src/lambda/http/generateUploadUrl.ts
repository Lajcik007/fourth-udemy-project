import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { updateAttachmentUrl } from "../../businessLogic/announcements";
import { getUploadUrl } from "../../s3/getUploadLink";


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const announcementId = event.pathParameters.announcementId

  const uploadUrl = await getUploadUrl(announcementId)

  await updateAttachmentUrl(announcementId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  };
}
