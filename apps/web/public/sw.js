self.addEventListener('push', function (event) {
  if (!event.data) {
    console.log('Push event but no data');
    return;
  }

  try {
    const data = event.data.json();

    // Értesítés megjelenítése
    const options = {
      body: data.body,
      icon: '/icon-192x192.png', // Ha van ikonod, tedd a public mappába
      badge: '/badge-72x72.png', // Kis ikon az értesítési sávra
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/', // Hova vigyen kattintáskor
      },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } catch (err) {
    console.error('Error parsing push data:', err);
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      const url = event.notification.data.url;

      // Ha már nyitva van az ablak, fókuszáljuk
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Ha nincs, nyitunk egy újat
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    }),
  );
});
