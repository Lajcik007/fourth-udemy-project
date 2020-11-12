import { AnnouncementItem } from "../models/AnnouncementItem"
import { CreateAnnouncementRequest } from "../requests/CreateAnnouncementRequest"
import { AnnouncementsAccess } from "../dataLayer/announcementsAccess"
import { UpdateAnnouncementRequest } from "../requests/UpdateAnnouncementRequest"

const announcementsAccess = new AnnouncementsAccess()

export async function getUserAnnouncements(userId: string): Promise<AnnouncementItem[]> {
    return await announcementsAccess.getAllAnnouncements(userId)
}

export async function createAnnouncement(
    newAnnouncement: CreateAnnouncementRequest,
    userId: string
): Promise<AnnouncementItem> {
    return await announcementsAccess.createAnnouncement(newAnnouncement, userId)
}

export async function updateAttachmentUrl(announcementId: string): Promise<void> {
    await announcementsAccess.addAttachmentUrl(announcementId);
}

export async function updatedAnnouncement(
    announcementId: string,
    announcementData: UpdateAnnouncementRequest
): Promise<void> {
    await announcementsAccess.updatedAnnouncement(announcementId, announcementData)
}

export async function deleteAnnouncement(announcementId: string): Promise<void> {
    await announcementsAccess.removeAnnouncement(announcementId)
}