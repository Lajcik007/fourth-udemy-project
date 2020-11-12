import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as uuid from 'uuid'
import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'
import { AnnouncementItem } from "../models/AnnouncementItem";
import { createLogger } from "../utils/logger";
import { CreateAnnouncementRequest } from "../requests/CreateAnnouncementRequest";
import { UpdateAnnouncementRequest } from "../requests/UpdateAnnouncementRequest";

const logger = createLogger('announcementAccess')
const XAWS = AWSXRay.captureAWS(AWS)

export class AnnouncementsAccess {
    constructor(
       private readonly docClient: DocumentClient = createDynamoDBClient(),
       private readonly announcementsTable = process.env.ANNOUNCEMENTS_TABLE,
       private readonly userIdIndex = process.env.USER_ID_INDEX,
       private readonly publishedIndex = process.env.PUBLISHED_INDEX,
       private readonly bucketName = process.env.IMAGES_S3_BUCKET
    ) {}

    async getAllAnnouncements(): Promise<AnnouncementItem[]> {
        logger.info('Getting all announcements')

        const data = await this.docClient
            .query({
                TableName: this.announcementsTable,
                IndexName : this.publishedIndex,
                KeyConditionExpression: 'published = :published',
                ExpressionAttributeValues: {
                    ':published': 1
                }
            })
            .promise();

        const items = data.Items;

        return items as AnnouncementItem[];
    }

    async getUserAnnouncements(userId: string): Promise<AnnouncementItem[]> {
        logger.info('Getting all announcements for user with userId', userId)

        const data = await this.docClient
            .query({
                TableName: this.announcementsTable,
                IndexName : this.userIdIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();

        const items = data.Items;

        return items as AnnouncementItem[];
    }

    async createAnnouncement(announcementData: CreateAnnouncementRequest, userId: string): Promise<AnnouncementItem> {
        logger.info('Creating announcement for user with userId', userId)

        const announcementId = uuid.v4()

        const newItem = {
            announcementId,
            userId,
            ...announcementData,
            published: 0,
            createdAt: new Date().toISOString()
        };

        await this.docClient.put({
            TableName: this.announcementsTable,
            Item: newItem
        }).promise()

        return newItem as AnnouncementItem;
    }

    async removeAnnouncement(announcementId: string): Promise<void> {
        logger.info('Deleting announcement with Id', announcementId)
        await this.docClient.delete({
            TableName: this.announcementsTable,
            Key:{
                "announcementId": announcementId,
            }
        }).promise()
    }

    async addAttachmentUrl(announcementId: string): Promise<void> {
        logger.info('Adding attachmentUrl to announcement with Id', announcementId)
        await this.docClient.update({
            TableName: this.announcementsTable,
            Key:{
                "announcementId": announcementId,
            },
            UpdateExpression: "set attachmentUrl=:attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${announcementId}`
            },
            ReturnValues:"NONE"
        }).promise()
    }

    async updatedAnnouncement(announcementId: string, announcementData: UpdateAnnouncementRequest): Promise<void> {
        logger.info(`Updating announcement with Id: ${announcementId} with data ${JSON.stringify(announcementData)}`)

        await this.docClient.update({
            TableName: this.announcementsTable,
            Key:{
                "announcementId": announcementId,
            },
            UpdateExpression: "set published=:published",
            ExpressionAttributeValues: {
                ":published": announcementData.published,
            },
            ReturnValues:"NONE"
        }).promise()
    }
}

function createDynamoDBClient(): DocumentClient {
    // @ts-ignore
    return new XAWS.DynamoDB.DocumentClient();
}