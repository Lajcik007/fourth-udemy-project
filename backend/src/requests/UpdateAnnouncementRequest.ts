/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateAnnouncementRequest {
  name: string
  dueDate: string
  done: boolean
}