import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as uuid from 'uuid'
import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from "../models/TodoItem";
import { createLogger } from "../utils/logger";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const logger = createLogger('todoAccess')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {
    constructor(
       private readonly docClient: DocumentClient = createDynamoDBClient(),
       private readonly todosTable = process.env.TODOS_TABLE,
       private readonly userIdIndex = process.env.USER_ID_INDEX,
       private readonly bucketName = process.env.IMAGES_S3_BUCKET
    ) {}

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all groups for user with userId', userId)

        const data = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName : this.userIdIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();

        const items = data.Items;

        return items as TodoItem[];
    }

    async createTodo(todoData: CreateTodoRequest, userId: string): Promise<TodoItem> {
        logger.info('Creating todo for user with userId', userId)

        const todoId = uuid.v4()

        const newItem = {
            todoId,
            userId,
            ...todoData,
            done: false,
            createdAt: new Date().toISOString()
        };

        await this.docClient.put({
            TableName: this.todosTable,
            Item: newItem
        }).promise()

        return newItem as TodoItem;
    }

    async removeTodo(todoId: string): Promise<void> {
        logger.info('Deleting todo with Id', todoId)
        await this.docClient.delete({
            TableName: this.todosTable,
            Key:{
                "todoId": todoId,
            }
        }).promise()
    }

    async addAttachmentUrl(todoId: string): Promise<void> {
        logger.info('Adding attachmentUrl to todo with Id', todoId)
        await this.docClient.update({
            TableName: this.todosTable,
            Key:{
                "todoId": todoId,
            },
            UpdateExpression: "set attachmentUrl=:attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
            },
            ReturnValues:"NONE"
        }).promise()
    }

    async updateTodo(todoId: string, todoData: UpdateTodoRequest): Promise<void> {
        logger.info('Updating todo with Id', todoId)
        await this.docClient.update({
            TableName: this.todosTable,
            Key:{
                "todoId": todoId,
            },
            UpdateExpression: "set #n=:todoName, dueDate=:dueDate, done=:done",
            ExpressionAttributeNames: {
                "#n":"name"
            },
            ExpressionAttributeValues: {
                ":todoName": todoData.name,
                ":dueDate": todoData.dueDate,
                ":done": todoData.done
            },
            ReturnValues:"NONE"
        }).promise()
    }
}

function createDynamoDBClient(): DocumentClient {
    // @ts-ignore
    return new XAWS.DynamoDB.DocumentClient();
}