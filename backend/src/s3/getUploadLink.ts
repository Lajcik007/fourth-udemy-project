import * as AWS from "aws-sdk";
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export function getUploadUrl(announcementId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: announcementId,
        Expires: parseInt(urlExpiration)
    })
}