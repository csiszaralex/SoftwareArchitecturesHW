import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react'; // Importáld a Navigation ikont

export default function NavigationButton({ lat, lng }: { lat: number; lng: number }) {
  const handleNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    if (isIOS) {
      // iOS: Apple Maps-et próbáljuk nyitni (ez a natív),
      // de ha van Google Maps app telepítve, az iOS néha felajánlja.
      window.open(`http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`, '_system');
    } else if (isAndroid) {
      // Android: A "geo:" séma a legjobb barátunk.
      // Ez kényszeríti a rendszert, hogy válasszon appot (Intent).
      window.location.href = `geo:${lat},${lng}?q=${lat},${lng}`;
    } else {
      // Desktop / Egyéb: Marad a Google Maps Web
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
        '_blank',
      );
    }
  };

  return (
    <Button
      size="sm"
      className="h-7 w-7 bg-blue-600 hover:bg-blue-700 shadow-sm shrink-0"
      title="Tervezés ide"
      onClick={handleNavigation}>
      <Navigation className="h-3.5 w-3.5 text-white" />
    </Button>
  );
}
