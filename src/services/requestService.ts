import * as MailComposer from 'expo-mail-composer';
import { saveBookRequest, RequestedBook } from './localDb';

export type { RequestedBook };

export async function requestBook(data: {
  title: string;
  author: string;
  reason?: string;
  requestedBy: string | null;
  requestedByName?: string;
}): Promise<{ id: string; emailSent: boolean }> {
  const request: RequestedBook = {
    id: `request_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: data.title.trim(),
    author: data.author.trim(),
    reason: data.reason?.trim(),
    requestedBy: data.requestedBy,
    requestedByName: data.requestedByName,
    createdAt: Date.now(),
    status: 'pending',
  };
  await saveBookRequest(request);

  let emailSent = false;
  try {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: ['maktaba.support@gmail.com'],
        subject: `Book Request: ${data.title}`,
        body: [
          `Book Request`,
          ``,
          `Title: ${data.title}`,
          `Author: ${data.author}`,
          data.reason ? `Note: ${data.reason}` : '',
          data.requestedByName ? `Requested by: ${data.requestedByName}` : '',
          ``,
          `Sent from Maktaba`,
        ].filter(Boolean).join('\n'),
      });
      emailSent = true;
    }
  } catch {}

  return { id: request.id, emailSent };
}
