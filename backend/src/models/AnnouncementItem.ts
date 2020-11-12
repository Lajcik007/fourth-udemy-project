export interface AnnouncementItem {
  userId: string
  announcementId: string
  createdAt: string
  name: string
  description: string;
  published: number;
  attachmentUrl?: string
}
