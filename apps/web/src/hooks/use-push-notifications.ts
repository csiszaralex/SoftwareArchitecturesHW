import { api } from '@/lib/api';
import { urlBase64ToUint8Array } from '@/lib/vapid-helper';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      // Ellenőrizzük, van-e már aktív feliratkozás
      navigator.serviceWorker.ready.then(registration => {
        registration.pushManager.getSubscription().then(sub => {
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  const subscribeToPush = async () => {
    setLoading(true);
    try {
      // 1. LÉPÉS: Kulcs lekérése a backendről
      const { data } = await api.get<{ publicKey: string }>('/notifications/public-key');
      const vapidPublicKey = data.publicKey;

      if (!vapidPublicKey) throw new Error('Nem érkezett VAPID kulcs a szervertől.');

      // 2. Feliratkozás a böngészőnél
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // 3. Küldés a backendnek
      // Fontos: JSON-be kell szerializálni a subscription objektumot!
      await api.post('/notifications/subscribe', subscription.toJSON());

      setIsSubscribed(true);
      setPermission('granted');
      toast.success('Sikeresen feliratkoztál az értesítésekre!');
    } catch (error) {
      console.error('Push feliratkozási hiba:', error);
      toast.error('Nem sikerült feliratkozni az értesítésekre.');
    } finally {
      setLoading(false);
    }
  };

  return { isSubscribed, subscribeToPush, permission, loading };
}
