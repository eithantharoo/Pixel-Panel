import { useCallback, useEffect, useState } from 'react';
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationService';
import { loadAuth } from '../utils/authState';
import { POLL_INTERVAL_MS } from '../utils/notificationClientState';

// Polls the backend for real (server-generated, e.g. new-chapter) notifications
// and exposes them alongside the client-synthesized ones HomePage already
// builds from local favorites/history data.
export function useServerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    const token = loadAuth()?.token;
    if (!token) return;
    try {
      const [{ notifications: list }, { count }] = await Promise.all([
        getNotifications({ limit: 20 }, token),
        getUnreadCount(token),
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } catch {
      // Best-effort polling — a transient failure shouldn't surface as an error.
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(refresh);
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const markRead = useCallback(async (id) => {
    const token = loadAuth()?.token;
    if (!token) return;
    setNotifications((current) => current.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((count) => Math.max(0, count - 1));
    try {
      await markNotificationRead(id, token);
    } catch {
      /* noop */
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const token = loadAuth()?.token;
    if (!token) return;
    setNotifications((current) => current.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead(token);
    } catch {
      /* noop */
    }
  }, []);

  return { notifications, unreadCount, refresh, markRead, markAllRead };
}
