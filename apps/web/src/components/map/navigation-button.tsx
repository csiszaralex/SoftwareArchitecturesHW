import { Button } from '@/components/ui/button';
import { openNavigationApp } from '@/lib/geo-utils';
import { Navigation } from 'lucide-react'; // Importáld a Navigation ikont

export default function NavigationButton({ lat, lng }: { lat: number; lng: number }) {
  const handleNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    openNavigationApp(lat, lng);
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
