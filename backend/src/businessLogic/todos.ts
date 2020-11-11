import { TodoItem } from "../models/TodoItem";
import { CreateTodoRequest } from "../requests/CreateTodoRequest";
import {TodosAccess} from "../dataLayer/todosAccess";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";

const todosAccess = new TodosAccess()

export async function getUserTodos(userId: string): Promise<TodoItem[]> {
    return await todosAccess.getAllTodos(userId)
}

export async function createTodo(
    newTodo: CreateTodoRequest,
    userId: string
): Promise<TodoItem> {
    return await todosAccess.createTodo(newTodo, userId)
}

export async function updateAttachmentUrl(todoId: string): Promise<void> {
    await todosAccess.addAttachmentUrl(todoId);
}

export async function updateTodo(
    todoId: string,
    todoData: UpdateTodoRequest
): Promise<void> {
    await todosAccess.updateTodo(todoId, todoData)
}

export async function deleteTodo(todoId: string): Promise<void> {
    await todosAccess.removeTodo(todoId)
}