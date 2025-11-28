'use client';

import { Car, Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { LocationPicker } from '@/components/map/location-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useStartParking } from '@/hooks/use-start-parking';

export function StartParkingDialog() {
  const [open, setOpen] = useState(false);
  const location = useGeolocation();
  const { mutate, isPending } = useStartParking();

  const [endsAtTime, setEndsAtTime] = useState('');
  // Alapértelmezett koordináta (Budapest), ha nincs GPS
  const [coords, setCoords] = useState({ lat: 47.4979, lng: 19.0402 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // GPS pozíció frissítése, ha megérkezik
  useEffect(() => {
    if (location.isAvailable && !open) {
      const timer = setTimeout(() => {
        setCoords({ lat: location.lat, lng: location.lng });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.isAvailable, location.lat, location.lng, open]);

  const handleStart = () => {
    let endsAtDate: Date | undefined = undefined;

    if (endsAtTime) {
      const [hours, minutes] = endsAtTime.split(':').map(Number);
      const now = new Date();
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      if (date < now) date.setDate(date.getDate() + 1);
      endsAtDate = date;
    }

    mutate(
      {
        lat: coords.lat,
        lng: coords.lng,
        address: 'Kézi/GPS pozíció',
        endsAt: endsAtDate,
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  if (!isMounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="absolute bottom-4 right-4 z-40">
        <DialogTrigger asChild>
          <Button
            // Engedjük kattintani, ha betöltött a kliens (akár GPS nélkül is, akkor kézi)
            className="shadow-xl bg-green-600 hover:bg-green-700 text-white h-14 w-14 rounded-full text-lg p-0 transition-transform active:scale-95">
            {isPending ? <Loader2 className="animate-spin" /> : <Car className="h-6 w-6" />}
          </Button>
        </DialogTrigger>
      </div>

      {/* JAVÍTÁS: sm:max-w-md és overflow kezelés */}
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto flex flex-col gap-0 p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Parkolás indítása</DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-5">
          {/* 1. Helyszín - Fix magasságot adunk neki! */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Helyszín pontosítása</Label>
            {/* Itt a fix magasság (h-64) kritikus, különben összecsuklik */}
            <div className="h-64 w-full rounded-lg border shadow-inner">
              <LocationPicker value={coords} onChange={setCoords} />
            </div>
            <p className="text-[10px] text-muted-foreground text-right">
              Mozgasd a piros jelölőt a pontos helyre.
            </p>
          </div>

          {/* 2. Lejárat */}
          <div className="space-y-2 bg-muted/30 p-3 rounded-md border">
            <Label className="text-sm font-medium">Parkolójegy lejárata (Opcionális)</Label>
            <div className="flex gap-3 items-center">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="text-primary h-4 w-4" />
              </div>
              <Input
                type="time"
                className="flex-1"
                value={endsAtTime}
                onChange={e => setEndsAtTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            onClick={handleStart}
            className="w-full bg-green-600 hover:bg-green-700 h-11 text-base font-semibold"
            disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Car className="mr-2 h-5 w-5" />
            )}
            Parkolás Indítása
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
