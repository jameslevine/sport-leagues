import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import { TABLE_NAMES } from '../constants';
import { dynamodb } from './dynamodb';
import {
  Notification,
  NotificationChannel,
  NotificationStatus,
  NotificationType,
} from '../types/notification';
import { User } from '../types/user';

// Twilio client
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

// SES config
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@sportleagues.com';

interface SendNotificationParams {
  user: User;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export const sendNotificationToUser = async (
  params: SendNotificationParams,
): Promise<void> => {
  const { user, type, title, body, data } = params;
  const prefs = user.notificationPreferences;

  const promises: Promise<void>[] = [];

  if (prefs.push) {
    promises.push(sendPushNotification(user, type, title, body, data));
  }

  if (prefs.sms && prefs.phoneNumber) {
    promises.push(
      sendSmsNotification(user, prefs.phoneNumber, type, title, body, data),
    );
  }

  if (prefs.email) {
    promises.push(sendEmailNotification(user, type, title, body, data));
  }

  await Promise.allSettled(promises);
};

export const sendNotificationToUsers = async (
  users: User[],
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> => {
  const promises = users.map((user) =>
    sendNotificationToUser({ user, type, title, body, data }),
  );
  await Promise.allSettled(promises);
};

const saveNotification = async (
  userId: string,
  type: NotificationType,
  channel: NotificationChannel,
  status: NotificationStatus,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> => {
  const now = dayjs().toISOString();
  const notificationId = uuidv4();

  const notification: Notification = {
    pk: `NOTIFICATION#${userId}`,
    sk: `NOTIFICATION#${now}#${notificationId}`,
    gsi1pk: `NOTIFICATION#${type}`,
    gsi1sk: `NOTIFICATION#${now}`,
    notificationId,
    userId,
    type,
    channel,
    status,
    title,
    body,
    data,
    sentAt: status === NotificationStatus.SENT ? now : undefined,
    createdAt: now,
  };

  await dynamodb.send(
    new PutCommand({
      TableName: TABLE_NAMES.NOTIFICATIONS,
      Item: notification,
    }),
  );
};

const sendPushNotification = async (
  user: User,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> => {
  try {
    // TODO: Implement Expo Push Notifications
    // Use expo-server-sdk to send push notifications
    // const expo = new Expo();
    // await expo.sendPushNotificationsAsync([{ to: pushToken, title, body, data }]);

    await saveNotification(
      user.userId,
      type,
      NotificationChannel.PUSH,
      NotificationStatus.SENT,
      title,
      body,
      data,
    );
    console.log(`Push notification sent to ${user.userId}: ${title}`);
  } catch (error) {
    console.error('Error sending push notification:', error);
    await saveNotification(
      user.userId,
      type,
      NotificationChannel.PUSH,
      NotificationStatus.FAILED,
      title,
      body,
      data,
    );
  }
};

const sendSmsNotification = async (
  user: User,
  phoneNumber: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> => {
  try {
    // Twilio SMS
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = Buffer.from(
      `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`,
    ).toString('base64');

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phoneNumber,
        From: TWILIO_PHONE_NUMBER,
        Body: `${title}\n\n${body}`,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Twilio SMS failed: ${response.status}`);
    }

    await saveNotification(
      user.userId,
      type,
      NotificationChannel.SMS,
      NotificationStatus.SENT,
      title,
      body,
      data,
    );
    console.log(`SMS sent to ${phoneNumber}: ${title}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
    await saveNotification(
      user.userId,
      type,
      NotificationChannel.SMS,
      NotificationStatus.FAILED,
      title,
      body,
      data,
    );
  }
};

const sendEmailNotification = async (
  user: User,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, string>,
): Promise<void> => {
  try {
    // AWS SES
    const { SESClient, SendEmailCommand } = await import('@aws-sdk/client-ses');
    const ses = new SESClient({
      region: process.env.AWS_REGION || 'eu-west-1',
    });

    await ses.send(
      new SendEmailCommand({
        Source: SES_FROM_EMAIL,
        Destination: {
          ToAddresses: [user.email],
        },
        Message: {
          Subject: { Data: title },
          Body: {
            Html: {
              Data: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1B5E20;">${title}</h2>
                  <p>${body}</p>
                  <hr style="border: 1px solid #eee;" />
                  <p style="color: #666; font-size: 12px;">Sport Leagues - You received this because of your notification preferences.</p>
                </div>
              `,
            },
            Text: { Data: `${title}\n\n${body}` },
          },
        },
      }),
    );

    await saveNotification(
      user.userId,
      type,
      NotificationChannel.EMAIL,
      NotificationStatus.SENT,
      title,
      body,
      data,
    );
    console.log(`Email sent to ${user.email}: ${title}`);
  } catch (error) {
    console.error('Error sending email:', error);
    await saveNotification(
      user.userId,
      type,
      NotificationChannel.EMAIL,
      NotificationStatus.FAILED,
      title,
      body,
      data,
    );
  }
};

export const getDbNotificationsByUser = async (
  userId: string,
  limit: number = 50,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  notifications: Notification[];
  lastEvaluatedKey?: Record<string, unknown>;
}> => {
  const params = {
    TableName: TABLE_NAMES.NOTIFICATIONS,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': `NOTIFICATION#${userId}`,
    },
    ScanIndexForward: false,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  };

  try {
    const response = await dynamodb.send(new QueryCommand(params));
    return {
      notifications: (response.Items || []) as Notification[],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};
