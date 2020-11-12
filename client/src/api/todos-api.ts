import { apiEndpoint } from '../config'
import { Announcement } from '../types/Announcement';
import { CreateAnnouncementsRequest } from '../types/CreateAnnouncementsRequest';
import Axios from 'axios'
import { UpdateAnnouncementsRequest } from '../types/UpdateAnnouncementsRequest';

export async function getTodos(idToken: string): Promise<Announcement[]> {
  console.log('Fetching user todos')

  const response = await Axios.get(`${apiEndpoint}/announcement/for/user`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return response.data.items
}

export async function getAllTodos(idToken: string): Promise<Announcement[]> {
  console.log('Fetching all todos')

  const response = await Axios.get(`${apiEndpoint}/announcement`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  return response.data.items
}

export async function createTodo(
  idToken: string,
  newTodo: CreateAnnouncementsRequest
): Promise<Announcement> {
  const response = await Axios.post(`${apiEndpoint}/announcement`,  JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateAnnouncementsRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/announcement/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/announcement/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/announcement/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
