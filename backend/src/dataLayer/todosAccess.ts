import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as uuid from 'uuid'
import * as AWS from "aws-sdk";
import { TodoItem } from "../models/TodoItem";
import { createLogger } from "../utils/logger";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";

const logger = createLogger('todoAccess')

export class TodosAccess {
    constructor(
       private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
       private readonly todosTable = process.env.TODOS_TABLE,
       private readonly userIdIndex = process.env.USER_ID_INDEX,
       private readonly bucketName = process.env.TODOS_TABLE
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
        await this.docClient.delete({
            TableName: this.todosTable,
            Key:{
                "todoId": todoId,
            }
        }).promise()
    }

    async addAttachmentUrl(todoId: string): Promise<void> {
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