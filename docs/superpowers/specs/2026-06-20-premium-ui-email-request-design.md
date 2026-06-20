# Premium UI + Email Request Design

## Overview

Three features to make the app feel premium and functional:
1. **expo-image** for fast image loading with caching
2. **Dynamic notifications** from local user data
3. **Email book requests** to zesho.support@gmail.com

---

## Feature 1: expo-image

### Problem
React Native's built-in `Image` component has no disk caching, no placeholders, and no progressive loading. Images flash in blank, then appear. Feels cheap.

### Solution
Install `expo-image` and replace all `Image` usage. expo-image provides:
- Disk + memory caching (images load instantly on repeat visits)
- Fade-in transitions (smooth appearance)
- Placeholder support (colored rects while loading)

### Changes

**Install:** `npx expo install expo-image`

**Replace imports** in these files (change `import { Image } from 'react-native'` to `import { Image } from 'expo-image'`):
- `src/components/BookCard.tsx` — book cover thumbnails
- `app/(tabs)/index.tsx` — featured book image
- `app/book/[id].tsx` — hero background + cover image

**Add props to each Image:**
```tsx
<Image
  source={{ uri: book.thumbnail }}
  style={styles.image}
  contentFit="cover"
  transition={300}
  cachePolicy="memory-disk"
/>
```

**Fallback:** `BookCoverPlaceholder` stays as-is — it's already a gradient fallback for missing thumbnails.

### Impact
- First load: smooth 300ms fade-in instead of flash
- Repeat loads: instant from disk cache
- Memory: managed automatically by expo-image

---

## Feature 2: Dynamic Notifications

### Problem
Notifications are 3 hardcoded welcome messages. No real content, no reason to open the notification center.

### Solution
Generate notifications from local user data (AsyncStorage). No backend needed.

### Notification Types

**1. Welcome (first launch only)**
- Title: "Welcome to Zesho"
- Message: "Discover thousands of free books from world-class libraries."
- Generated when: no dismissed notifications exist
- Auto-clears after 24 hours

**2. Book Request Confirmation**
- Title: "Request Submitted"
- Message: "Your request for '{book title}' has been sent. We'll notify you when it's available."
- Generated when: user submits a book request
- Stored in AsyncStorage with key `local_notifications`

**3. Library Milestone**
- Title: "Library Growing!"
- Message: "You've added {count} books to your library. Keep it up!"
- Generated when: user's library count hits 5, 10, 25, 50, 100
- Checked on each library add

**4. Reading Reminder**
- Title: "Reading Reminder"
- Message: "You haven't read in a while. Your books are waiting!"
- Generated when: last library activity was 3+ days ago
- Checked on app open (once per day max)

### Data Model

```typescript
interface AppNotification {
  id: string;
  type: 'welcome' | 'request' | 'milestone' | 'reminder';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  meta?: Record<string, any>; // e.g., { bookTitle: '...', milestone: 5 }
}
```

### Storage
- Key: `local_notifications_{userId}` (or `local_notifications_guest` for unauthenticated)
- Max 20 notifications (trim oldest when exceeding)
- Dismissed IDs tracked separately in existing `dismissed_notifications` key

### New Service: `src/services/notificationService.ts`

Functions:
- `generateNotifications(userId: string)` — checks conditions, creates new notifications
- `getUserNotifications(userId: string)` — returns all notifications sorted by time
- `markAsRead(userId: string, notifId: string)` — marks single notification read
- `dismissNotification(userId: string, notifId: string)` — removes notification
- `clearAll(userId: string)` — removes all notifications

### UI Changes (`app/notifications.tsx`)
- Replace hardcoded `ALL_NOTIFICATIONS` with dynamic data from `getUserNotifications()`
- Add pull-to-refresh to regenerate notifications
- Show relative time ("2 min ago", "1 hour ago", "Yesterday")
- Swipe-to-dismiss stays
- Add "mark as read" on tap
- Better empty state: "All caught up! No new notifications"
- Notification dot on home screen updates based on unread count

### Home Screen Dot Update (`app/(tabs)/index.tsx`)
- Replace `getDismissedNotifications()` check with `getUserNotifications(userId)` 
- Show red dot if any notification has `read: false`
- Update on each tab focus

### Impact
- Notification center has real, relevant content
- Users see confirmation when they request books
- Motivation through milestones
- Gentle reminders to keep reading

---

## Feature 3: Email Book Requests

### Problem
Book requests save to AsyncStorage only. The developer (you) never receives them.

### Solution
On submit, open the device's mail app with a pre-filled email to `zesho.support@gmail.com`. User taps Send. Zero backend needed.

### Changes

**Install:** `npx expo install expo-mail-composer`

**Update `src/services/requestService.ts`:**
```typescript
import * as MailComposer from 'expo-mail-composer';

export async function requestBook(data: {
  title: string;
  author: string;
  reason?: string;
  requestedBy: string | null;
  requestedByName?: string;
}): Promise<{ id: string; emailSent: boolean }> {
  // 1. Save locally (existing behavior)
  const request = { ... };
  await saveBookRequest(request);

  // 2. Compose email
  const isAvailable = await MailComposer.isAvailableAsync();
  if (isAvailable) {
    await MailComposer.composeAsync({
      recipients: ['zesho.support@gmail.com'],
      subject: `Book Request: ${data.title}`,
      body: [
        `Book Request`,
        ``,
        `Title: ${data.title}`,
        `Author: ${data.author}`,
        data.reason ? `Note: ${data.reason}` : '',
        data.requestedByName ? `Requested by: ${data.requestedByName}` : '',
        ``,
        `Sent from Zesho`,
      ].filter(Boolean).join('\n'),
    });
    return { id: request.id, emailSent: true };
  }

  return { id: request.id, emailSent: false };
}
```

**Update `src/components/RequestBookModal.tsx`:**
- After successful submit, show different alert based on `emailSent`:
  - `emailSent: true` → "Request sent! Check your email to confirm."
  - `emailSent: false` → "Request saved. Mail app not available — please email zesho.support@gmail.com manually."
- Also generate a notification (Feature 2) on successful request

### Impact
- Book requests reach zesho.support@gmail.com via device mail app
- Works offline (saves locally, email composed when mail app opens)
- No backend, no API keys, no costs

---

## Files Changed Summary

| File | Change |
|------|--------|
| `package.json` | Add `expo-image`, `expo-mail-composer` |
| `src/components/BookCard.tsx` | Replace `Image` import, add cache/transition props |
| `app/(tabs)/index.tsx` | Replace `Image` import, add cache/transition props |
| `app/book/[id].tsx` | Replace `Image` import, add cache/transition props |
| `src/services/notificationService.ts` | **NEW** — notification generation and management |
| `app/notifications.tsx` | Dynamic data, pull-to-refresh, mark-as-read |
| `src/services/requestService.ts` | Add email sending via expo-mail-composer |
| `src/components/RequestBookModal.tsx` | Update submit flow, show email status |
| `app/(tabs)/index.tsx` | Update notification dot to use dynamic count |

---

## Testing

1. **Image loading:** Open app → images should fade in smoothly → close and reopen → images load instantly from cache
2. **Notifications:** Open notifications → see welcome message → request a book → reopen notifications → see request confirmation → add 5 books → see milestone notification
3. **Email request:** Request a book → mail app opens with pre-filled email → verify email content is correct
4. **TypeScript:** `npx tsc --noEmit` passes with no errors
5. **Build:** `cd android && ./gradlew assembleRelease` succeeds
