import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as AWS from "aws-sdk"

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  await docClient.update({
    TableName: todosTable,
    Key:{
      "todoId": todoId,
    },
    UpdateExpression: "set #n=:todoName, dueDate=:dueDate, done=:done",
    ExpressionAttributeNames: {
      "#n":"name"
    },
    ExpressionAttributeValues: {
      ":todoName": updatedTodo.name,
      ":dueDate": updatedTodo.dueDate,
      ":done": updatedTodo.done
    },
    ReturnValues:"NONE"
  }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: 'Todo updated successfully'
  }
}
