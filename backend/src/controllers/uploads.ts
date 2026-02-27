import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { HTTP_STATUS } from '../constants';

const s3 = new S3Client({ region: 'eu-west-1' });
const BUCKET_NAME = process.env.WEBSITE_BUCKET || 'sport-leagues-dev-website';
const CLOUDFRONT_URL =
  process.env.CLOUDFRONT_URL || 'https://d3e8loweracod4.cloudfront.net';

export const getUploadUrl = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const userId = req.user.sub;
    const { contentType } = req.query;
    const fileType = (contentType as string) || 'image/jpeg';
    const extension = fileType.split('/')[1] || 'jpg';
    const key = `avatars/${userId}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    // Use CloudFront URL since S3 bucket blocks public access
    const publicUrl = `${CLOUDFRONT_URL}/${key}`;

    res.json({ uploadUrl, publicUrl, key });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: 'Error generating upload URL',
    });
  }
};
