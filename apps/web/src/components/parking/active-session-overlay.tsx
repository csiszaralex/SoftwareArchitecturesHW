'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useActiveSession } from '@/hooks/use-active-session';
import { useEndParking } from '@/hooks/use-end-parking';
import { openNavigationApp } from '@/lib/geo-utils';
import { cn } from '@/lib/utils';
import { Duration, formatDuration, intervalToDuration } from 'date-fns';
import { Car, Loader2, Timer } from 'lucide-react';
import * as React from 'react';

export function ActiveSessionOverlay() {
  const { data: session, isLoading, isError } = useActiveSession();
  const { mutate: endParking, isPending: isEnding } = useEndParking();
  const [duration, setDuration] = React.useState<Duration | null>(null);

  React.useEffect(() => {
    if (!session?.startedAt) {
      setDuration(null);
      return;
    }

    const startedDate = new Date(session.startedAt);

    const updateDuration = () => {
      const now = new Date();
      setDuration(intervalToDuration({ start: startedDate, end: now }));
    };

    updateDuration();
    const timer = setInterval(updateDuration, 1000);

    return () => clearInterval(timer);
  }, [session]);

  const formattedDuration = duration
    ? formatDuration(duration, {
        delimiter: ', ',
        zero: false,
        format: ['hours', 'minutes', 'seconds'],
      })
    : '--:--';

  if (isError || !session?.isActive) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="absolute bottom-4 right-4 z-40">
        <Card className="shadow-lg animate-pulse w-[300px] p-3 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 mr-2 animate-spin inline" /> Aktív parkolás keresése...
        </Card>
      </div>
    );
  }

  const handleNavigateBack = () => {
    if (!session) return;
    openNavigationApp(session.lat, session.lng);
  };

  return (
    <div className="absolute bottom-4 right-4 z-40">
      <Card
        className={cn(
          'shadow-2xl border-2 border-primary/50 w-[300px] animate-in fade-in slide-in-from-right-4 duration-500',
          isEnding && 'opacity-60',
        )}>
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <Car className="w-5 h-5 mr-2 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-wide">
            Aktív parkolási munkamenet
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {/* Idő számláló */}
          <div className="flex items-center justify-between border-b pb-2">
            <Timer className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-2xl font-mono font-bold tracking-tight text-primary">
              {formattedDuration}
            </span>
          </div>

          {/* Helyszín */}
          <p className="text-sm text-muted-foreground">
            {session.notes || session.address || 'Mentett GPS koordináta'}
          </p>

          {/* Akciók */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200"
              onClick={handleNavigateBack}
              disabled={isEnding}>
              <Car className="w-4 h-4 mr-2" />
              Visszanavigálás
            </Button>
            <Button size="sm" className="flex-1" onClick={() => endParking()} disabled={isEnding}>
              {isEnding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Lezárás...
                </>
              ) : (
                'Lezárás'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
