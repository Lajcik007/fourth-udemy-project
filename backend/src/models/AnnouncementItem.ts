export interface AnnouncementItem {
  userId: string
  announcementId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
