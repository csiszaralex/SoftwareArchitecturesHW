'use client';

import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { Bell, BellOff, Loader2 } from 'lucide-react';

export function NotificationToggle() {
  const { isSubscribed, subscribeToPush, permission, loading } = usePushNotifications();

  if (typeof window !== 'undefined' && !('Notification' in window)) {
    return null;
  }

  if (permission === 'denied') {
    return (
      <div className="text-xs text-red-500 px-2">
        Az értesítések le vannak tiltva a böngészőben.
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <Button variant="ghost" className="w-full justify-start text-green-600 cursor-default">
        <Bell className="mr-2 h-4 w-4" />
        Értesítések aktívak
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={subscribeToPush}
      disabled={loading}>
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <BellOff className="mr-2 h-4 w-4" />
      )}
      Értesítések bekapcsolása
    </Button>
  );
}
