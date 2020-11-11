import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'


import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { parseUserId } from "../../auth/utils"

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const todoId = uuid.v4()

  const newItem = {
    todoId,
    userId: parseUserId(jwtToken),
    ...newTodo,
    done: false,
    createdAt: new Date().toISOString()
  };

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
}
