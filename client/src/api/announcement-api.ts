import { apiEndpoint } from '../config'
import { Announcement } from '../types/Announcement';
import { CreateAnnouncementsRequest } from '../types/CreateAnnouncementsRequest';
import Axios from 'axios'
import { UpdateAnnouncementsRequest } from '../types/UpdateAnnouncementsRequest';

export async function getAnnouncements(idToken: string): Promise<Announcement[]> {
  console.log('Fetching user Announcements')

  const response = await Axios.get(`${apiEndpoint}/announcement/for/user`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Announcements:', response.data)
  return response.data.items
}

export async function getAllAnnouncements(idToken: string): Promise<Announcement[]> {
  console.log('Fetching all Announcements')

  const response = await Axios.get(`${apiEndpoint}/announcement`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Announcements:', response.data)
  return response.data.items
}

export async function createAnnouncement(
  idToken: string,
  newAnnouncement: CreateAnnouncementsRequest
): Promise<Announcement> {
  const response = await Axios.post(`${apiEndpoint}/announcement`,  JSON.stringify(newAnnouncement), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchAnnouncement(
  idToken: string,
  announcementId: string,
  updatedAnnouncement: UpdateAnnouncementsRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/announcement/${announcementId}`, JSON.stringify(updatedAnnouncement), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteAnnouncement(
  idToken: string,
  announcementId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/announcement/${announcementId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  announcementId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/announcement/${announcementId}/attachment`, '', {
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
